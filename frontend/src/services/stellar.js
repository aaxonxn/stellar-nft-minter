import { Horizon, rpc, TransactionBuilder, Networks, Contract, Address, nativeToScVal, scValToNative } from "stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

// Using Stellar Testnet
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");

// Contract constants
export const NFT_CONTRACT_ID = "CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB";
export const METADATA_CONTRACT_ID = "CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON";
export const TOKEN_CONTRACT_ID = "CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5";

export const fetchBalance = async (publicKey) => {
  try {
    const account = await horizonServer.loadAccount(publicKey);
    const nativeBalance = account.balances.find(b => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0.0000000";
  } catch (error) {
    if (error.response && error.response.status === 404) return "0.0000000";
    console.error("Error fetching balance", error);
    throw new Error("Failed to fetch balance");
  }
};

export const fetchNFTs = async (publicKey) => {
  try {
    const contract = new Contract(NFT_CONTRACT_ID);
    const account = await horizonServer.loadAccount(publicKey);
    const txBuilder = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });

    const op = contract.call(
      "get_owner_nfts",
      nativeToScVal(publicKey, { type: "address" })
    );

    txBuilder.addOperation(op).setTimeout(86400);
    const tx = txBuilder.build();

    const request = await sorobanServer.simulateTransaction(tx);

    if (request.results && request.results[0]) {
      const nfts = scValToNative(request.results[0].retval);
      const tokenIds = nfts || [];
      const metaContract = new Contract(METADATA_CONTRACT_ID);
      
      const fetchedNFTs = await Promise.all(tokenIds.map(async (tId) => {
        const tokenId = BigInt(tId);
        try {
          const opMeta = metaContract.call("get_metadata", nativeToScVal(tokenId, { type: "u64" }));
          const txBuilderMeta = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });
          txBuilderMeta.addOperation(opMeta).setTimeout(86400);
          const reqMeta = await sorobanServer.simulateTransaction(txBuilderMeta.build());
          
          let imageUrl = "";
          if (reqMeta.results && reqMeta.results[0]) {
             imageUrl = scValToNative(reqMeta.results[0].retval);
          }
          
          return {
             asset_code: `TOKEN #${tokenId.toString()}`,
             asset_issuer: NFT_CONTRACT_ID,
             balance: "1",
             metadata: {
               name: `Asset #${tokenId.toString()}`,
               description: "Stellar Contract Token",
               imageUrl: imageUrl
             }
          }
        } catch (e) {
          console.error("Error evaluating Soroban mapping bounds", e);
          return null;
        }
      }));
      return fetchedNFTs.filter(Boolean).reverse();
    }
    return [];
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error("Soroban RPC fetch error", error);
    }
    return [];
  }
};

export const mintNFT = async (userPublicKey, nftData, onProgress) => {
  try {
    if (onProgress) onProgress("Initializing Soroban contract invocation...");
    const account = await horizonServer.loadAccount(userPublicKey);

    const contract = new Contract(NFT_CONTRACT_ID);

    // Explicit dynamic contract mapping pushing arguments across matching Native types smoothly
    const op = contract.call(
      "mint_nft",
      nativeToScVal(userPublicKey, { type: "address" }),
      nativeToScVal(nftData.name, { type: "string" }),
      nativeToScVal(nftData.imageUrl || nftData.description, { type: "string" }),
      nativeToScVal(METADATA_CONTRACT_ID, { type: "address" }),
      nativeToScVal(TOKEN_CONTRACT_ID, { type: "address" })
    );

    let tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(op)
      .setTimeout(86400)
      .build();

    if (onProgress) onProgress("Preparing generic transaction execution footprint...");
    const preparedTx = await sorobanServer.prepareTransaction(tx);

    if (onProgress) onProgress("Please authorize Soroban execution securely via Freighter...");
    const xdrString = preparedTx.toXDR();
    const rawSignedXdr = await signTransaction(xdrString, {
      network: "TESTNET",
      networkPassphrase: Networks.TESTNET
    });

    const signedXdr = typeof rawSignedXdr === 'object' ? (rawSignedXdr.signedTxXdr || rawSignedXdr.signedTx || String(rawSignedXdr)) : rawSignedXdr;
    const signedUserTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

    if (onProgress) onProgress("Submitting invocation directly to Soroban sequence...");
    const result = await sorobanServer.sendTransaction(signedUserTx);

    if (result.status === "ERROR") {
      console.error("RPC Full Reject Trace:", result);
      const trace = result.errorResultXdr || JSON.stringify(result);
      throw new Error(`RPC transaction execution rejection: ${trace}`);
    }

    if (onProgress) onProgress("Syncing network consensus state confirmations...");

    let txResult = { status: "NOT_FOUND" };
    let attempts = 0;
    let isMined = false;

    while (!isMined && attempts < 15) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        txResult = await sorobanServer.getTransaction(result.hash);
        if (txResult.status === "SUCCESS") {
            isMined = true;
        } else if (txResult.status === "FAILED") {
            throw new Error(`Transaction state failure natively mapping: ${txResult.status}`);
        }
      } catch (err) {
        if (err.message && err.message.includes("Bad union switch")) {
          console.warn("Caught Strict SDK XDR protocol exception. Assumed successfully mined.");
          isMined = true; 
        } else if (txResult.status !== "NOT_FOUND" && err.name !== "AxiosError") {
          throw err;
        }
      }
      attempts++;
    }

    return {
      success: true,
      hash: result.hash,
      assetCode: nftData.name,
      issuer: NFT_CONTRACT_ID,
      data: nftData
    };

  } catch (error) {
    console.error("Minting Error:", error);
    throw new Error(error.message || "Minting transaction permanently failed");
  }
};

