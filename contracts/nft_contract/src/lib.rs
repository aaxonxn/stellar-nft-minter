#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

#[contract]
pub struct NftContract;

#[contractimpl]
impl NftContract {
    pub fn mint_nft(env: Env, owner: Address, name: String) {
        owner.require_auth();
        
        let mut tokens: Vec<String> = env
            .storage()
            .persistent()
            .get(&owner)
            .unwrap_or(Vec::new(&env));
            
        tokens.push_back(name);
        
        env.storage().persistent().set(&owner, &tokens);
    }

    pub fn get_nfts(env: Env, owner: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&owner)
            .unwrap_or(Vec::new(&env))
    }
}
