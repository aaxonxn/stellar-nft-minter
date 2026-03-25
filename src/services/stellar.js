import { Horizon, Keypair, Asset, TransactionBuilder, Networks, Operation } from "stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

// Use Testnet
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export const fetchBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(b => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0.0000000";
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return "0.0000000"; // Unfunded account
    }
    console.error("Error fetching balance", error);
    throw new Error("Failed to fetch balance");
  }
};

export const mintNFT = async (userPublicKey, nftData, onProgress) => {
  try {
    // 1. Create a dedicated issuer account for this NFT
    if (onProgress) onProgress("Initializing issuer account...");
    const issuerKeypair = Keypair.random();
    
    // 2. Fund the issuer keypair using Friendbot (Testnet only)
    if (onProgress) onProgress("Funding issuer via Testnet Friendbot...");
    const fbResponse = await fetch(`https://friendbot.stellar.org?addr=${issuerKeypair.publicKey()}`);
    if (!fbResponse.ok) {
      throw new Error("Failed to fund issuer account on Testnet.");
    }

    // 3. Define the NFT asset code
    let assetCode = nftData.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toUpperCase();
    if (!assetCode) assetCode = "NFT";
    
    const nftAsset = new Asset(assetCode, issuerKeypair.publicKey());

    // 4. Build Trustline transaction for the User
    if (onProgress) onProgress("Preparing Trustline transaction...");
    const userAccount = await server.loadAccount(userPublicKey);
    const trustlineTx = new TransactionBuilder(userAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(
      Operation.changeTrust({
        asset: nftAsset,
        limit: "1" // Limit to 1 for NFT supply
      })
    )
    .setTimeout(300)
    .build();

    // 5. User signs the Trustline via Freighter
    if (onProgress) onProgress("Please sign the Trustline transaction in Freighter...");
    const signedXdr = await signTransaction(trustlineTx.toXDR(), { network: "TESTNET" });
    const signedUserTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    
    // 6. Submit user's Trustline tx
    if (onProgress) onProgress("Submitting Trustline to Stellar network...");
    const trustlineResult = await server.submitTransaction(signedUserTx);
    if (!trustlineResult.successful) {
      throw new Error("Failed to establish trustline.");
    }

    // 7. Issuer sends precisely 1 unit of Asset to User and locks itself
    if (onProgress) onProgress("Minting token and permanently locking supply...");
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    const paymentTx = new TransactionBuilder(issuerAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(
      Operation.payment({
        destination: userPublicKey,
        asset: nftAsset,
        amount: "1" // Supply 1
      })
    )
    .addOperation(
      // Lock account to ensure supply stays perfectly at 1
      Operation.setOptions({
        masterWeight: 0
      })
    )
    .setTimeout(300)
    .build();

    paymentTx.sign(issuerKeypair);
    const paymentResult = await server.submitTransaction(paymentTx);

    return {
      success: true,
      hash: paymentResult.hash,
      assetCode,
      issuer: issuerKeypair.publicKey(),
      data: nftData // Metadata JSON passed directly into frontend
    };
    
  } catch (error) {
    console.error("Minting Error:", error);
    throw new Error(error.message || "Minting transaction failed");
  }
};

