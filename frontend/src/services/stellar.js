import { Horizon, rpc, TransactionBuilder, Networks, Contract, Address, nativeToScVal, scValToNative } from "stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

// Using Stellar Testnet
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");

// Contract constants
export const NFT_CONTRACT_ID = "CANFTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
export const METADATA_CONTRACT_ID = "CAMETAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
export const TOKEN_CONTRACT_ID = "CATOKENXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

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
     
     // Build pure RPC fetch call mapping Address native format
     const op = contract.call(
         "get_owner_nfts", 
         nativeToScVal(publicKey, { type: "address" })
     );
     
     txBuilder.addOperation(op).setTimeout(30);
     const tx = txBuilder.build();
     
     const request = await sorobanServer.simulateTransaction(tx);
     
     if (request.results && request.results[0]) {
         const nfts = scValToNative(request.results[0].retval);
         // Transform pure blockchain arrays into standard view formats smoothly
         return (nfts || []).map(tokenId => ({
             asset_code: `TOKEN #${tokenId}`,
             asset_issuer: NFT_CONTRACT_ID,
             balance: "1",
             metadata: {
                 name: `SOROBAN NFT #${tokenId}`,
                 description: "Fetched dynamically from Soroban RPC",
                 imageUrl: "" // Metadata requires further dynamic chaining normally
             }
         }));
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
    .setTimeout(30)
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
        throw new Error("RPC transaction execution rejection.");
    }
    
    if (onProgress) onProgress("Syncing network consensus state confirmations...");
    
    let txResult = await sorobanServer.getTransaction(result.hash);
    let attempts = 0;
    while (txResult.status === "NOT_FOUND" && attempts < 15) {
        await new Promise(r => setTimeout(r, 2000));
        txResult = await sorobanServer.getTransaction(result.hash);
        attempts++;
    }
    
    if (txResult.status !== "SUCCESS") {
        throw new Error(`Transaction state failure natively mapping: ${txResult.status}`);
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

