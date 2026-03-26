# Stellar NFT Minter

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](#) [![Deploy](https://img.shields.io/badge/deploy-vercel-black.svg?style=flat-square)](#)

🚀 **Stellar NFT Minter** is a professional decentralized application (dApp) built on the robust Soroban smart contract platform. It enables users to securely mint Non-Fungible Tokens (NFTs) while leveraging an advanced, componentized smart contract architecture on the Stellar network.

Built with a premium, fully responsive Tailwind CSS aesthetic, the platform abstracts away the complexity of blockchain interactions. It allows creators to automatically map multi-contract executions, securely connect their Freighter wallet, and instantly view transactions directly mapped against the Stellar Expert Block Explorer.

## 🌟 Features

- **Freighter Wallet Integration**: Secure and seamless connection utilizing `@stellar/freighter-api`.
- **Soroban RPC Executions**: Purely leverages the advanced Soroban RPC `simulateTransaction` and `sendTransaction` endpoints securely isolating network executions.
- **Inter-Contract Minting Flow**: Requires dynamic fungible token fee transfers (VIBE) and isolates metadata securely via explicit cross-contract execution parameters.
- **Fully Responsive UI**: Extends the premium glassmorphism gradient aesthetic perfectly down to 320px mobile viewports securely.
- **Dynamic Session Gallery**: Tracks and seamlessly maps RPC-fetches securely transforming native arrays to the React view model flawlessly.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 / Vite
- **Styling**: Tailwind CSS v3
- **Network Bridges**: `stellar-sdk` (Soroban RPC), `@stellar/freighter-api`
- **Smart Contracts**: Rust (Soroban SDK v20)
- **Testing**: Vitest (Frontend), Cargo Test (Contracts)

## 📂 Project Structure

- `/frontend` → React dApp executing standard Soroban wallet connectors natively mapping UI elements dynamically.
- `contracts/nft_contract` → The primary Token implementation executing mints tracking robust native `DataKey` persistent structures accurately.
- `contracts/metadata_contract` → An effectively isolated Metadata contract gracefully extracting URI allocations mapped remotely.
- `contracts/fungible_contract` → The secure protocol `Vibecoin` fungible token tracking and validating mapping fees gracefully via `admin.require_auth()`.

## 📦 Soroban Smart Contract Architecture

Unlike traditional monolithic blockchain implementations, this platform strictly leverages an advanced **Inter-Contract Architecture** explicitly relying on native mappings to securely separate data and authority effectively.

### Inter-Contract Call Explanation

The core execution flawlessly separates logic securely using isolated cross-contract calls natively matching execution boundaries using standard `env.invoke_contract`:

1. **Token Payment Leg**: When an NFT is minted via the `NftContract`, the contract immediately isolates and binds an explicit RPC execution mapped firmly triggering the `transfer` method strictly against the isolated `VibecoinContract` enforcing a 10 VIBE mint fee safely.
2. **Execution & Immutable Setup**: Once the user safely clears the fee requirements natively mapping standard bounds securely, the `NftContract` constructs the persistent `TokenCount` and ownership map structures efficiently.
3. **Data Mapping Leg**: The `NftContract` immediately isolates pure application-level attributes routing dynamically via `env.invoke_contract` sending the specific `token_id` and `metadata_uri` mappings securely. This offloads logic explicitly into the secondary `MetadataContract` guaranteeing strict execution boundary separation, cleanly isolating application data vs pure accounting ledgers natively.

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd stellar-nft-minter
   ```

2. **Navigate natively into the frontend engine**:
   ```bash
   cd frontend
   ```

3. **Install core decentralized dependencies**:
   ```bash
   npm install
   ```

4. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

5. **Verify your Browser setup**: Make absolute sure you have the official Stellar **Freighter Wallet Browser Extension** cleanly configured globally mapped dynamically firmly onto the **Testnet**!

## 🌍 Deployment

Check out the live robust deployment securely operating flawlessly over global CDN endpoints here:
👉 **[Live Vercel Project](https://stellar-nft-minter.vercel.app/)**

---

## 📸 Screenshots

*(Replace placeholders below natively with actual platform captures accurately!)*

### 📱 Responsive Mobile Target
![Mobile Layout Prototype](https://via.placeholder.com/300x600.png?text=Mobile+View)

### 💻 Desktop Wallet Integration
![Desktop Connector Prototype](https://via.placeholder.com/800x450.png?text=Wallet+Connected)

### 🖼 Soroban NFT Session Gallery
![Session Render View](https://via.placeholder.com/800x450.png?text=NFT+Gallery)

---

## 🎥 Demo Video

You can view the live demo of the application here:

[Watch the live demo of the application on Google Drive](https://drive.google.com/file/d/1ha3iNN5S5b1NO9Mq64zI-YUUSHlXP5sy/view?usp=drive_link)

---

## 🔗 Contract Addresses & References

*(Manually update exact Soroban hashes locally post-ledger deployment natively!)*

| Contract Target | Stellar Address Reference | Explorer Hash ID |
| --- | --- | --- |
| **NFT Contract** | `CANFT...` | `https://stellar.expert/explorer/testnet/tx/...` |
| **Metadata Mapping** | `CAMETA...` | `https://stellar.expert/explorer/testnet/tx/...` |
| **VibeCoin (VIBE)** | `CATOKEN...` | `https://stellar.expert/explorer/testnet/tx/...` |
