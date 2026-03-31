import { rpc, TransactionBuilder, Networks, Contract, nativeToScVal, scValToNative, Horizon } from "stellar-sdk";

const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");

const NFT_CONTRACT_ID = "CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB";
const METADATA_CONTRACT_ID = "CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON";
const publicKey = "GAD56K5E7ZP5J42B3DJWSF4LJSCBBKBWR4PN4QGIGYIDATJ36XXFWWUZ";

async function run() {
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

    console.log("Simulating parent...");
    const request = await sorobanServer.simulateTransaction(tx);

    if (request.results && request.results[0]) {
      const nfts = scValToNative(request.results[0].retval);
      console.log("Raw NFTs:", nfts);
      const tokenIds = nfts || [];
      const metaContract = new Contract(METADATA_CONTRACT_ID);
      
      const fetchedNFTs = await Promise.all(tokenIds.map(async (tId) => {
        const tokenId = BigInt(tId);
        try {
          const opMeta = metaContract.call("get_metadata", nativeToScVal(tokenId, { type: "u64" }));
          const txBuilderMeta = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });
          txBuilderMeta.addOperation(opMeta).setTimeout(86400);
          console.log("Simulating metadata for", tokenId.toString());
          const reqMeta = await sorobanServer.simulateTransaction(txBuilderMeta.build());
          
          let imageUrl = "";
          if (reqMeta.results && reqMeta.results[0]) {
             imageUrl = scValToNative(reqMeta.results[0].retval);
          }
          
          return {
             asset_code: `TOKEN #${tokenId.toString()}`,
             imageUrl: imageUrl
          }
        } catch (e) {
          console.error("Error evaluating Soroban mapping bounds", e);
          return null;
        }
      }));
      console.log("Result:", fetchedNFTs);
    } else {
      console.log("No results:", request);
    }
  } catch(e) {
    console.error("Failed:", e.message);
  }
}
run();
