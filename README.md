# Stellar NFT Minter

[![CI/CD Pipeline](https://github.com/aaxon/stellar-nft-minter/actions/workflows/main.yml/badge.svg)](https://github.com/aaxon/stellar-nft-minter/actions)
[![Deploy Platform](https://img.shields.io/badge/deploy-vercel-black.svg?style=flat-square)](#)

🚀 **Stellar NFT Minter** is a professional decentralized application (dApp) built on the robust Soroban smart contract platform. It enables users to securely mint Non-Fungible Tokens (NFTs) while leveraging an advanced, componentized smart contract architecture on the Stellar network.

Built with a clean React + Tailwind CSS aesthetic, the platform abstracts away the complexity of blockchain interactions. It allows creators to automatically run multi-contract flows, connect their Freighter wallet, and instantly view transactions natively via the Stellar Expert Block Explorer.

🌍 **Live Demo:** [Open Stellar NFT Minter](https://stellar-nft-minter.vercel.app)

## 🌟 Features

- **Freighter Wallet Integration**: Secure and seamless connection utilizing `@stellar/freighter-api`.
- **Advanced Inter-Contract Minting Flow**: Requires dynamic fungible token fee transfers (VIBE token gating) to protect the network.
- **Soroban RPC Executions**: Reliable integrations using `simulateTransaction` explicitly isolating executions.
- **Fully Responsive UI**: Mobile-first premium glassmorphism architecture. Fully responsive to 320px Viewports.
- **Dynamic Gallery System**: Retrieves and tracks on-chain NFTs fetched via RPC explicitly connecting standard user interfaces directly to blockchain datasets seamlessly.

## 🧠 Why This Project Stands Out

This application sets a high standard for modern Web3 integration on the Stellar Network:
- **Multi-Contract Architecture:** Instead of building a fragile monolithic structure, concerns are clearly separated across three distinct compiled Soroban WebAssembly contracts.
- **Token-Gated Minting:** Employs an exact programmatic VIBE-coin payment flow (built from a standard Fungible Token interface) required internally during mint execution—an enterprise-level workflow pattern for protocol fee mechanisms.
- **Inter-Contract Calls:** Perfectly handles recursive contract `env.invoke_contract` routing, forwarding executions from the NFT core logic dynamically over to isolated `MetadataContract` systems and the `FungibleContract`.
- **Modern Soroban Deployment:** Designed exclusively using the latest Soroban RPC endpoints bypassing legacy horizon asset wrappers.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 / Vite
- **Styling**: Tailwind CSS v3
- **Network Bridges**: `stellar-sdk` (Soroban RPC), `@stellar/freighter-api`
- **Smart Contracts**: Rust (Soroban SDK v25.x)
- **Testing**: Vitest (Frontend), Cargo Test (Contracts)

## 📂 Project Structure

- `/frontend` → React dApp executing standard Soroban wallet connectors flawlessly mapped dynamically off UI handlers.
- `contracts/nft_contract` → The primary Token implementation tracking accounts and standard tokens safely interacting securely.
- `contracts/metadata_contract` → An effectively isolated Metadata contract managing URI mappings and image allocations exclusively.
- `contracts/fungible_contract` → The protocol `Vibecoin` fungible token mapping cross-contract payments precisely and enforcing access bounds.

## 📦 Architecture & Inter-Contract Call Explanation

Unlike traditional iterations, this platform leverages a robust **Inter-Contract Architecture**:

1. **Token Payment Leg (Token-Gated Mint)**: When an NFT is minted via the `NftContract`, the contract immediately runs an explicit cross-contract execution triggering the `transfer` method against the isolated `FungibleContract` (VIBE token). This strictly enforces an automatic 10 VIBE fee payment.
2. **Execution & Immutable Setup**: Once the user safely clears the fee requirements, the `NftContract` constructs the persistent Token counter and immutable ownership map assigning the asset to the Creator.
3. **Data Mapping Leg**: The `NftContract` extracts application-level attributes routing dynamically via `env.invoke_contract` sending the specific `token_id` and `metadata_uri` mappings directly to the secondary `MetadataContract`.

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

Check out the live deployment securely operating over global CDN endpoints here:
👉 **[Live Demo: Stellar NFT Minter](https://stellar-nft-minter.vercel.app/)**

---

## 📸 Screenshots

### 💻 Desktop Wallet Integration
![Desktop Platform View](/assets/desktop.png)

### 📱 Responsive Mobile Target
![Mobile Layout Prototype](/assets/mobile.png)

### 🖼 NFT Gallery
![Gallery Render View](/assets/gallery.png)

### 🚀 Minting Experience
![Mint Progress View](/assets/mint.png)

---

## 🔗 Contract Addresses & References

All contracts have been actively deployed onto the Stellar Testnet sequentially using Soroban CLI execution nodes.

| Contract Target | Stellar Address Reference | Explorer Hash ID |
| --- | --- | --- |
| **NFT Contract** | `CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB` | `https://stellar.expert/explorer/testnet/contract/CBUGCHFXDS4U6W7TB7773XU7QRMWYAWI6UZQAU5D5UNQDAGXPZ6BFLZB` |
| **Metadata Mapping** | `CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON` | `https://stellar.expert/explorer/testnet/contract/CCC5W657SPEEQDFQSJ3LTRUYPWT7PLYAEO4ZDRG6PTOIIBK26UWQTYON` |
| **VibeCoin (VIBE)** | `CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5` | `https://stellar.expert/explorer/testnet/contract/CCAPTATJJBBE6EFF25ZURXVJB2QDWKEEU462V37CVTO5773GW5E2G5U5` |

### ✅ Recent Testnet Transactions / Proof of Mint
- Review sample cross-contract token payments and mint execution natively on Stellar Expert:
- **Transaction Hash:** [7a4c7b0b8e6ff4d0075e5132f73aca0f6b5b (View Proof)](https://stellar.expert/explorer/testnet/tx/7a4c7b0b8e6ff4d0075e5132f73aca0f6b5b)
