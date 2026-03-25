import { isAllowed, setAllowed, getPublicKey, isConnected } from "@stellar/freighter-api";

const STORAGE_KEY = "stellar_app_pubkey";

export const connectWallet = async () => {
  try {
    const connected = await isConnected();
    if (!connected) {
      return { success: false, error: "Freighter wallet is not installed or available." };
    }
    
    // Check if user has already granted permission
    let allowed = await isAllowed();
    if (!allowed) {
      // Prompt freighter permission
      await setAllowed();
      allowed = await isAllowed();
      if (!allowed) {
        return { success: false, error: "User rejected Freighter access." };
      }
    }
    
    // Get public key
    const publicKey = await getPublicKey();
    
    // Store public key in local storage to keep user logged in
    localStorage.setItem(STORAGE_KEY, publicKey);
    
    return { success: true, publicKey };
  } catch (error) {
    console.error("Wallet Connection Error:", error);
    return { success: false, error: "An error occurred while connecting to your wallet." };
  }
};

export const disconnectWallet = () => {
  // Freighter doesn't have an explicit disconnect, so we remove the local state
  localStorage.removeItem(STORAGE_KEY);
  return { success: true };
};
export const getStoredPublicKey = () => {
  return localStorage.getItem(STORAGE_KEY);
};
