import { rpc, TransactionBuilder, Networks, Contract, nativeToScVal, Keypair } from 'stellar-sdk';
const sorobanServer = new rpc.Server("https://soroban-testnet.stellar.org");
async function testFull() {
    try {
        const keypair = Keypair.fromSecret("SAZ7Z7ZQK2W4K2WOG2OKVGBWWONK4GKVH7P5HHLF2M43MIMK7L6B4PXZ"); // I'll generate a fresh keypair and fund it, wait...
    } catch(e) {
        console.error(e);
    }
}
