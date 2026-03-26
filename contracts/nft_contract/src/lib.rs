#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, IntoVal, String, Symbol, Vec};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    TokenCount,
    Token(u64),
    OwnerTokens(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NftToken {
    pub token_id: u64,
    pub owner: Address,
    pub name: String,
    // Note: metadata_uri was explicitly removed to isolate responsibilities!
}

#[contract]
pub struct NftContract;

#[contractimpl]
impl NftContract {
    pub fn mint_nft(env: Env, to: Address, name: String, metadata_uri: String, metadata_contract: Address, token_contract: Address) -> u64 {
        to.require_auth();
        
        // --- NFT Minting Payment ---
        // Require a 10 VIBE fee to be strictly transferred from the minting user mapping to this contract.
        // Cleanly separate token tracking logic utilizing standard dynamic cross-invocations.
        let fee_amount: i128 = 10;
        let contract_address = env.current_contract_address();
        
        let token_args = soroban_sdk::vec![&env, to.into_val(&env), contract_address.into_val(&env), fee_amount.into_val(&env)];
        env.invoke_contract::<()>(&token_contract, &Symbol::new(&env, "transfer"), token_args);
        
        let mut count: u64 = env.storage().persistent().get(&DataKey::TokenCount).unwrap_or(0);
        count += 1;
        let token_id = count;
        
        let token = NftToken {
            token_id,
            owner: to.clone(),
            name,
        };
        
        env.storage().persistent().set(&DataKey::Token(token_id), &token);
        
        // --- Inter-Contract Metadata Linking ---
        // Clean separation of concerns: The NFT Contract handles network-native minting and execution, 
        // while the dedicated Metadata Contract independently handles persistent storage mapping
        // of URIs to ensure safe separation of core token logic vs application data views securely.
        let args = soroban_sdk::vec![&env, token_id.into_val(&env), metadata_uri.into_val(&env)];
        env.invoke_contract::<()>(&metadata_contract, &Symbol::new(&env, "set_metadata"), args);
        
        let mut owner_tokens: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnerTokens(to.clone()))
            .unwrap_or(Vec::new(&env));
            
        owner_tokens.push_back(token_id);
        env.storage().persistent().set(&DataKey::OwnerTokens(to.clone()), &owner_tokens);
        env.storage().persistent().set(&DataKey::TokenCount, &count);
        
        token_id
    }

    pub fn transfer_nft(env: Env, from: Address, to: Address, token_id: u64) {
        from.require_auth();
        
        let mut token: NftToken = env
            .storage()
            .persistent()
            .get(&DataKey::Token(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"));
            
        if token.owner != from {
            panic!("Not the owner of the token");
        }
        
        let mut from_tokens: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnerTokens(from.clone()))
            .unwrap_or_else(|| panic!("Owner holds no tokens"));
            
        if let Some(index) = from_tokens.first_index_of(token_id) {
            from_tokens.remove(index);
            env.storage().persistent().set(&DataKey::OwnerTokens(from), &from_tokens);
        } else {
            panic!("Token not in owner list");
        }
        
        let mut to_tokens: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::OwnerTokens(to.clone()))
            .unwrap_or(Vec::new(&env));
            
        to_tokens.push_back(token_id);
        env.storage().persistent().set(&DataKey::OwnerTokens(to.clone()), &to_tokens);
        
        token.owner = to;
        env.storage().persistent().set(&DataKey::Token(token_id), &token);
    }

    pub fn get_nft(env: Env, token_id: u64) -> NftToken {
        env.storage()
            .persistent()
            .get(&DataKey::Token(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"))
    }

    pub fn get_owner_nfts(env: Env, owner: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(owner))
            .unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    // We can define a simplified mock standard metadata contract entirely locally to map our invocation calls correctly
    #[contract]
    pub struct MockMetadataContract;

    #[contractimpl]
    impl MockMetadataContract {
        pub fn set_metadata(env: Env, token_id: u64, uri: String) {
            env.storage().persistent().set(&token_id, &uri);
        }
    }
    
    // Abstract Token Mock logically mapping identical parameter layouts safely
    #[contract]
    pub struct MockTokenContract;

    #[contractimpl]
    impl MockTokenContract {
        pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {
            // Standard simulated dummy return 
        }
    }

    #[test]
    fn test_mint() {
        let env = Env::default();
        let meta_id = env.register_contract(None, MockMetadataContract);
        let token_id_addr = env.register_contract(None, MockTokenContract);
        let contract_id = env.register_contract(None, NftContract);
        let client = NftContractClient::new(&env, &contract_id);
        
        let user = Address::generate(&env);
        let name = String::from_str(&env, "Test NFT");
        let uri = String::from_str(&env, "ipfs://QmTest...");

        env.mock_all_auths();
        
        // Dynamic cross invocation
        let token_id = client.mint_nft(&user, &name, &uri, &meta_id, &token_id_addr);
        assert_eq!(token_id, 1);
        
        let nft = client.get_nft(&token_id);
        assert_eq!(nft.token_id, 1);
        assert_eq!(nft.owner, user);
        assert_eq!(nft.name, name);
        
        let owner_nfts = client.get_owner_nfts(&user);
        assert_eq!(owner_nfts.len(), 1);
        assert_eq!(owner_nfts.get(0).unwrap(), 1);
    }

    #[test]
    fn test_transfer() {
        let env = Env::default();
        let meta_id = env.register_contract(None, MockMetadataContract);
        let token_id_addr = env.register_contract(None, MockTokenContract);
        let contract_id = env.register_contract(None, NftContract);
        let client = NftContractClient::new(&env, &contract_id);
        
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let name = String::from_str(&env, "Test NFT");
        let uri = String::from_str(&env, "ipfs://QmTest...");

        env.mock_all_auths();
        
        let token_id = client.mint_nft(&user1, &name, &uri, &meta_id, &token_id_addr);
        client.transfer_nft(&user1, &user2, &token_id);
        
        let nft = client.get_nft(&token_id);
        assert_eq!(nft.owner, user2);
        
        let user1_nfts = client.get_owner_nfts(&user1);
        assert_eq!(user1_nfts.len(), 0);
        
        let user2_nfts = client.get_owner_nfts(&user2);
        assert_eq!(user2_nfts.len(), 1);
        assert_eq!(user2_nfts.get(0).unwrap(), token_id);
    }
    
    #[test]
    #[should_panic(expected = "Token does not exist")]
    fn test_get_nonexistent_nft() {
        let env = Env::default();
        let contract_id = env.register_contract(None, NftContract);
        let client = NftContractClient::new(&env, &contract_id);
        client.get_nft(&999);
    }

    #[test]
    #[should_panic(expected = "Not the owner of the token")]
    fn test_transfer_unathorized() {
        let env = Env::default();
        let meta_id = env.register_contract(None, MockMetadataContract);
        let token_id_addr = env.register_contract(None, MockTokenContract);
        let contract_id = env.register_contract(None, NftContract);
        let client = NftContractClient::new(&env, &contract_id);
        
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let user3 = Address::generate(&env);
        let name = String::from_str(&env, "Test NFT");
        let uri = String::from_str(&env, "ipfs://QmTest...");

        env.mock_all_auths();
        
        let token_id = client.mint_nft(&user1, &name, &uri, &meta_id, &token_id_addr);
        client.transfer_nft(&user2, &user3, &token_id);
    }
}
