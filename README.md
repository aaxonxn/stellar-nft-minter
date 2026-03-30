# Stellar NFT Minter

[![CI/CD Pipeline](https://github.com/aaxon/stellar-nft-minter/actions/workflows/main.yml/badge.svg)](https://github.com/aaxon/stellar-nft-minter/actions)
[![Deploy Platform](https://img.shields.io/badge/deploy-vercel-black.svg?style=flat-square)](#)

🚀 **Stellar NFT Minter** is a professional decentralized application (dApp) built on the robust Soroban smart contract platform. It enables users to securely mint Non-Fungible Tokens (NFTs) while leveraging an advanced, componentized smart contract architecture on the Stellar network.

Built with a premium, fully responsive Tailwind CSS aesthetic, the platform abstracts away the complexity of blockchain interactions. It allows creators to automatically map multi-contract executions, securely connect their Freighter wallet, and instantly view transactions natively via the Stellar Expert Block Explorer.

## 🌟 Features

- **Freighter Wallet Integration**: Secure and seamless connection utilizing `@stellar/freighter-api`.
- **Advanced Inter-Contract Minting Flow**: Requires dynamic fungible token fee transfers (VIBE) and isolates metadata securely via explicit cross-contract execution parameters. Token-gated NFT mints ensure network security and fair drops.
- **Soroban RPC Executions**: Purely leverages the advanced Soroban RPC endpoints securely isolating network executions.
- **Fully Responsive UI**: Mobile-first premium glassmorphism architecture. Fully responsive to 320px Viewports.
- **Dynamic Session Gallery**: Tracks and seamlessly maps RPC-fetches securely transforming native arrays to the React view model flawlessly.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 / Vite
- **Styling**: Tailwind CSS v3
- **Network Bridges**: `stellar-sdk` (Soroban RPC), `@stellar/freighter-api`
- **Smart Contracts**: Rust (Soroban SDK v25.x)
- **Testing**: Vitest (Frontend), Cargo Test (Contracts)

## 📂 Project Structure

- `/frontend` → React dApp executing standard Soroban wallet connectors natively mapping UI elements dynamically.
- `contracts/nft_contract` → The primary Token implementation executing mints tracking robust native `DataKey` persistent structures accurately.
- `contracts/metadata_contract` → An effectively isolated Metadata contract gracefully extracting URI allocations mapped remotely.
- `contracts/fungible_contract` → The secure protocol `Vibecoin` fungible token tracking and validating mapping fees gracefully via `admin.require_auth()`.

## 📦 Architecture & Inter-Contract Call Explanation

Unlike traditional monolithic blockchain implementations, this platform strictly leverages an advanced **Inter-Contract Architecture** explicitly relying on native mappings to securely separate data and authority effectively.

1. **Token Payment Leg (Token-Gated Mint)**: When an NFT is minted via the `NftContract`, the contract immediately isolates and binds an explicit cross-contract execution triggering the `transfer` method against the isolated `FungibleContract` (VIBE token). This strictly enforces an automatic fee payment securely across the network.
2. **Execution & Immutable Setup**: Once the user safely clears the fee requirements securely, the `NftContract` constructs the persistent Token counter and immutable ownership maps securely mapping the asset to the Creator.
3. **Data Mapping Leg**: The `NftContract` immediately isolates pure application-level attributes routing dynamically via `env.invoke_contract` sending the specific `token_id` and `metadata_uri` mappings securely. This offloads logic explicitly into the secondary `MetadataContract` guaranteeing strict execution boundary separation.

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd stellar-nft-minter
   ```

2. **Run Blockchain & Contracts Build** (Ensure Rust is installed):
   ```bash
   # Navigate to each contract and run:
   cd contracts/nft_contract
   cargo build --release --target wasm32-unknown-unknown
   # Or natively via soroban:
   soroban contract build
   ```

3. **Navigate to the frontend engine**:
   ```bash
   cd frontend
   ```

4. **Install core frontend dependencies**:
   ```bash
   npm install
   ```

5. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

6. **Verify your Browser setup**: Make sure you have the official Stellar **Freighter Wallet Browser Extension** configured to the **Testnet**.

## 🌍 Deployment

Check out the live robust deployment securely operating flawlessly over global CDN endpoints here:
👉 **[Live Demo: Stellar NFT Minter](https://stellar-nft-minter.vercel.app/)**

---

## 📸 Screenshots

### 💻 Desktop Wallet Integration
![Desktop Platform View](https://via.placeholder.com/1200x800.png?text=Desktop+Platform+View)

### 📱 Responsive Mobile Target
![Mobile Layout Prototype](https://via.placeholder.com/400x800.png?text=Mobile+Responsive+View)

---

## 🔗 Contract Addresses & References

All contracts have been actively deployed onto the Stellar Testnet sequentially.

| Contract Target | Stellar Address Reference | Explorer Hash ID |
| --- | --- | --- |
| **NFT Contract** | `CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB` | `https://stellar.expert/explorer/testnet/contract/CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB` |
| **Metadata Mapping** | `CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON` | `https://stellar.expert/explorer/testnet/contract/CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON` |
| **VibeCoin (VIBE)** | `CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5` | `https://stellar.expert/explorer/testnet/contract/CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5` |

### ✅ Recent Testnet Transactions
- Mint Successful: [bba673...23ab (View on Stellar Expert)](https://stellar.expert/explorer/testnet/tx/12c4f830e16a5f4d6a9549f42499dad82d8)
