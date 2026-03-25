#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contract]
pub struct NftContract;

#[contracttype]
pub enum DataKey {
    OwnerTokens(Address),
}

#[contractimpl]
impl NftContract {
    /// Mints a new NFT by storing its name mapped directly to the owner's address.
    pub fn mint_nft(env: Env, owner: Address, name: String) {
        // Enforce that the transaction is authorized defensively by the given owner
        owner.require_auth();
        
        // Fetch existing tokens for this owner, or initialize a clean empty Vector
        let mut tokens: Vec<String> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnerTokens(owner.clone()))
            .unwrap_or_else(|| Vec::new(&env));
            
        // Map the new NFT logic bounds onto the local structure
        tokens.push_back(name);
        
        // Safely push the structured vector precisely back to explicit persistent storage
        env.storage()
            .persistent()
            .set(&DataKey::OwnerTokens(owner), &tokens);
    }

    /// Retrieve all exact NFT mappings organically owned by a mapped address securely.
    pub fn get_nfts(env: Env, owner: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(owner))
            .unwrap_or_else(|| Vec::new(&env))
    }
}
