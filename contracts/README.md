# Stellar Smart Contracts Architecture

This directory serves as the standard organizational anchor for blockchain smart contracts inside typical EVM-compatible monolithic repositories natively. 

However, **this project explicitly utilizes the lightning-fast native "Stellar Classic" architecture** and strictly does not require complex or structurally heavy Soroban smart contracts!

## How our NFT Simulation Works without Soroban
Instead of deploying custom virtual code into a decentralized remote virtual machine execution layer, we strictly utilize the foundational native primitives natively engineered exclusively into the Stellar Network protocols:
- **Custom Assets**: Utilizing dynamically constructed unique Keypair identifiers rigorously capping global distribution limits structurally mapped to a `Supply: 1`.
- **Trustlines**: Resolving a single localized explicit `ChangeTrust` network authorization exclusively mapping limits bound specifically to your dynamic target.
- **Payments & Master Keys**: Broadcasting flawlessly precisely `1` immutable sequence `Payment` before immediately destroying account authority structurally via `masterWeight: 0`, enforcing true immutability over the final network supply mathematically globally!

You can natively track all deeply nested custom transaction loops safely operating inside `/frontend/src/services/stellar.js`!
