import { rpc, Contract, nativeToScVal, scValToNative, Networks, TransactionBuilder } from 'stellar-sdk';
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");
const NFT_CONTRACT_ID = "CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB";
const publicKey = "GAD56K5E7ZP5J42B3DJWSF4LJSCBBKBWR4PN4QGIGYIDATJ36XXFWWUZ";

async function run() {
  try {
    const contract = new Contract(NFT_CONTRACT_ID);
    const account = await sorobanServer.getAccount(publicKey);
    const txBuilder = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });
    
    console.log("simulating fetchNFTs...");
    const op = contract.call("get_owner_nfts", nativeToScVal(publicKey, { type: "address" }));
    txBuilder.addOperation(op).setTimeout(0);
    const tx = txBuilder.build();
    console.log("simulating tx...");
    const request = await sorobanServer.simulateTransaction(tx);
    console.log("sim result:", JSON.stringify(request));
    if (request.results && request.results[0]) {
      console.log("retVal:", request.results[0].retval);
      const nfts = scValToNative(request.results[0].retval);
      console.log("nfts", nfts);
    }
  } catch(e) {
    console.error("fetchNFTs failed:", e);
  }
}
run();
