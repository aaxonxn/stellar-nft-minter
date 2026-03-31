import React, { useState, useEffect } from 'react';
import ConnectWallet from './components/ConnectWallet';
import WalletDisplay from './components/WalletDisplay';
import MintForm from './components/MintForm';
import NFTGallery from './components/NFTGallery';
import { fetchBalance, fetchNFTs } from './services/stellar';
import { getStoredPublicKey, disconnectWallet } from './services/wallet';
import { Rocket, LogOut } from 'lucide-react';

const METADATA_KEY = 'stellar_nft_metadata';

const getMetadataFromStorage = () => {
  try {
    const data = localStorage.getItem(METADATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveMetadataToStorage = (nft) => {
  const existing = getMetadataFromStorage();
  const newEntry = {
    name: nft.data.name,
    description: nft.data.description,
    imageUrl: nft.data.imageUrl
  };
  
  if (!existing.some(m => m.imageUrl === newEntry.imageUrl && m.name === newEntry.name)) {
    localStorage.setItem(METADATA_KEY, JSON.stringify([newEntry, ...existing]));
  }
};

function App() {
  const [publicKey, setPublicKey] = useState(() => getStoredPublicKey());
  const [balance, setBalance] = useState('0.0000000');
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [fetchedAssets, setFetchedAssets] = useState([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(false);

  const fetchWalletData = async () => {
    if (!publicKey) return;
    setIsBalanceLoading(true);
    setIsAssetsLoading(true);
    try {
      const bal = await fetchBalance(publicKey);
      setBalance(bal);
      
      const rawAssets = await fetchNFTs(publicKey);
      const metadataStore = getMetadataFromStorage();
      
      const mergedAssets = rawAssets.map(asset => {
        const meta = metadataStore.find(m => m.imageUrl === asset.metadata.imageUrl || m.name === asset.metadata.name);
        if (meta) {
          return { 
            ...asset, 
            metadata: { ...asset.metadata, name: meta.name, description: meta.description } 
          };
        }
        return asset;
      });
      
      setFetchedAssets(mergedAssets);
    } catch (err) {
      console.error("Data fetch error:", err);
      setBalance('Error');
    } finally {
      setIsBalanceLoading(false);
      setIsAssetsLoading(false);
    }
  };

  // Synced local init entirely avoids screen flash during refreshes natively

  useEffect(() => {
    if (publicKey) {
      fetchWalletData();
    } else {
      setBalance('0.0000000');
      setFetchedAssets([]);
    }
  }, [publicKey]);

  const handleMintSuccess = (nft) => {
    saveMetadataToStorage(nft);
    // UX Request: Auto-refresh after mint
    fetchWalletData();
  };

  const handleConnect = (key) => setPublicKey(key);

  const handleDisconnect = () => {
    disconnectWallet();
    setPublicKey(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="min-h-[70px] sm:min-h-[80px] flex items-center justify-between px-4 sm:px-6 md:px-12 xl:px-[5%] border-b border-white/10 bg-[#0d0e12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-stellar to-[#6c5ce7] p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
            <Rocket size={20} className="text-black sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-semibold m-0 text-gradient leading-tight">Stellar Mint</h1>
            <div className="text-[10px] sm:text-xs text-gray-400">NFT Generator</div>
          </div>
        </div>

        <div>
          {!publicKey ? (
            <ConnectWallet onConnect={handleConnect} />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-stellar/10 border border-stellar/20 text-stellar px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-sm animate-fade-in cursor-default whitespace-nowrap shadow-[0_0_10px_rgba(20,212,244,0.1)]">
                 Connected
               </div>
               <button 
                 onClick={handleDisconnect} 
                 className="bg-white/5 border border-white/10 hover:bg-white/10 text-white p-2 sm:p-2.5 rounded-lg transition-colors animate-fade-in flex items-center justify-center"
                 title="Disconnect"
               >
                 <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
               </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 md:py-16 xl:px-[5%] flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8 sm:gap-10">
          <div className="text-center px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Mint on <span className="text-gradient-primary">Stellar</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed">
              Create, verify, and launch your non-fungible tokens on the open network.
            </p>
          </div>

          <WalletDisplay publicKey={publicKey} balance={balance} isLoading={isBalanceLoading} />
          
          <div className="flex w-full justify-center">
            <MintForm publicKey={publicKey} onMintSuccess={handleMintSuccess} />
          </div>

          <NFTGallery fetchedAssets={fetchedAssets} isLoading={isAssetsLoading} />

        </div>
      </main>
    </div>
  );
}

export default App;
