#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
    Name,
    Symbol,
}

#[contract]
pub struct VibecoinContract;

#[contractimpl]
impl VibecoinContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Name, &String::from_str(&env, "Vibecoin"));
        env.storage().persistent().set(&DataKey::Symbol, &String::from_str(&env, "VIBE"));
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();
        
        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to), &balance);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        let mut from_balance: i128 = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        from_balance -= amount;
        env.storage().persistent().set(&DataKey::Balance(from), &from_balance);
        
        let mut to_balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        to_balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to), &to_balance);
    }

    pub fn balance_of(env: Env, user: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(user)).unwrap_or(0)
    }
}
