import { rpc, Contract, nativeToScVal, Networks, TransactionBuilder, Keypair } from 'stellar-sdk';
import fs from 'fs';
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");
const NFT_CONTRACT_ID = "CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB";
const METADATA_CONTRACT_ID = "CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON";
const TOKEN_CONTRACT_ID = "CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5";
// I will just read my local `aaxon` keypair from the testnet config!
const homePaths = ["C:/Users/aaxon/.soroban/identities/aaxon.toml"];
let secret = "SAZ7Z7..."; // I'll use run_command to get this if needed, or simply run `soroban contract invoke` and fetch the hash!
