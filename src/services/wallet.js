import { requestAccess, isAllowed, setAllowed, getPublicKey, isConnected } from "@stellar/freighter-api";

const STORAGE_KEY = "stellar_app_pubkey";

export const connectWallet = async () => {
  try {
    let connectedRes;
    try {
      connectedRes = await isConnected();
    } catch(e) { }
    
    const installed = typeof connectedRes === 'object' ? connectedRes.isConnected : !!connectedRes;
    
    if (!installed) {
      return { success: false, error: "Freighter wallet is not installed or available." };
    }
    
    // Modern Freighter API v6 approach
    if (typeof requestAccess === 'function') {
      const accessRes = await requestAccess();
      const addr = typeof accessRes === 'object' ? (accessRes.address || accessRes.publicKey) : accessRes;
      const err = typeof accessRes === 'object' ? accessRes.error : null;
      if (err || !addr) {
        return { success: false, error: err || "User rejected Freighter access." };
      }
      localStorage.setItem(STORAGE_KEY, addr);
      return { success: true, publicKey: addr };
    }
    
    // Fallback to older Freighter API style
    const allowedRes = await isAllowed();
    let allowed = typeof allowedRes === 'object' ? allowedRes.isAllowed : allowedRes;
    
    if (!allowed) {
      const setAllowedRes = await setAllowed();
      allowed = typeof setAllowedRes === 'object' ? setAllowedRes.isAllowed : setAllowedRes;
      if (!allowed) {
        return { success: false, error: "User rejected Freighter access." };
      }
    }
    
    const pkRes = await getPublicKey();
    const publicKey = typeof pkRes === 'object' ? (pkRes.publicKey || pkRes.address) : pkRes;
    
    if (!publicKey) {
      return { success: false, error: "Could not retrieve public key." };
    }
    
    localStorage.setItem(STORAGE_KEY, publicKey);
    return { success: true, publicKey };
  } catch (error) {
    console.error("Wallet Connection Error:", error);
    return { success: false, error: `Freighter error: ${error.message || String(error)}` };
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
