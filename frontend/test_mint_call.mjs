import { rpc, Contract, nativeToScVal, Networks, TransactionBuilder, xdr } from 'stellar-sdk';
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");
const NFT_CONTRACT_ID = "CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB";
const METADATA_CONTRACT_ID = "CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON";
const TOKEN_CONTRACT_ID = "CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5";
const publicKey = "GAD56K5E7ZP5J42B3DJWSF4LJSCBBKBWR4PN4QGIGYIDATJ36XXFWWUZ";

async function run() {
  try {
    const account = await sorobanServer.getAccount(publicKey);
    const contract = new Contract(NFT_CONTRACT_ID);
    console.log("Creating OP...");
    const op = contract.call(
      "mint_nft",
      nativeToScVal(publicKey, { type: "address" }),
      nativeToScVal("Nebula Genesis #001", { type: "string" }),
      nativeToScVal("https://images.unsplash.com...", { type: "string" }),
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

    console.log("Preparing transaction...");
    const preparedTx = await sorobanServer.prepareTransaction(tx);
    console.log("Prepared!", preparedTx);
  } catch(e) {
    console.error("FAILED:", e.message);
  }
}
run();
