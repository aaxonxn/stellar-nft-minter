#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct MetadataContract;

#[contractimpl]
impl MetadataContract {
    pub fn set_metadata(env: Env, token_id: u64, uri: String) {
        env.storage().persistent().set(&token_id, &uri);
    }

    pub fn get_metadata(env: Env, token_id: u64) -> String {
        env.storage()
            .persistent()
            .get(&token_id)
            .unwrap_or_else(|| String::from_str(&env, "No metadata mapped"))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, String};

    #[test]
    fn test_metadata() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MetadataContract);
        let client = MetadataContractClient::new(&env, &contract_id);
        
        let uri = String::from_str(&env, "ipfs://metadata...");
        client.set_metadata(&1, &uri);
        
        let result = client.get_metadata(&1);
        assert_eq!(result, uri);
    }
}
