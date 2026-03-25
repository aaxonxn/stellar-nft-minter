import React, { useState, useEffect } from 'react';
import ConnectWallet from './components/ConnectWallet';
import WalletDisplay from './components/WalletDisplay';
import MintForm from './components/MintForm';
import NFTGallery from './components/NFTGallery';
import { fetchBalance } from './services/stellar';
import { getStoredPublicKey, disconnectWallet } from './services/wallet';
import { Rocket, LogOut } from 'lucide-react';

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState('0.0000000');
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [sessionNFTs, setSessionNFTs] = useState([]);

  const handleMintSuccess = (nft) => {
    setSessionNFTs(prev => [nft, ...prev]);
  };

  useEffect(() => {
    // Check if wallet is stored in local storage
    const initWallet = async () => {
      const storedKey = getStoredPublicKey();
      if (storedKey) {
        setPublicKey(storedKey);
      }
    };
    initWallet();
  }, []);

  useEffect(() => {
    if (publicKey) {
      const getBalance = async () => {
        setIsBalanceLoading(true);
        try {
          const bal = await fetchBalance(publicKey);
          setBalance(bal);
        } catch (err) {
          console.error("Balance fetch error:", err);
          setBalance('Error');
        } finally {
          setIsBalanceLoading(false);
        }
      };
      getBalance();
    } else {
      setBalance('0.0000000');
    }
  }, [publicKey]);

  const handleConnect = (key) => {
    setPublicKey(key);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setPublicKey(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="min-h-[80px] flex items-center justify-between px-6 md:px-12 xl:px-[5%] border-b border-white/10 bg-[#0d0e12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-stellar to-[#6c5ce7] p-2 rounded-xl flex items-center justify-center">
            <Rocket size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-semibold m-0 text-gradient leading-tight">Stellar Mint</h1>
            <div className="text-xs text-gray-400">NFT Generator</div>
          </div>
        </div>

        <div>
          {!publicKey ? (
            <ConnectWallet onConnect={handleConnect} />
          ) : (
            <div className="flex items-center gap-3">
               <div className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg font-medium text-sm animate-fade-in cursor-default">
                 Connected
               </div>
               <button 
                 onClick={handleDisconnect} 
                 className="bg-white/5 border border-white/10 hover:bg-white/10 text-white p-2.5 rounded-lg transition-colors animate-fade-in"
                 title="Disconnect"
               >
                 <LogOut size={18} />
               </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 py-12 md:py-16 xl:px-[5%] flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col items-center gap-10">
          
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mint on <span className="text-gradient-primary">Stellar</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
              Create, verify, and launch your non-fungible tokens on the open network.
            </p>
          </div>

          <WalletDisplay publicKey={publicKey} balance={balance} isLoading={isBalanceLoading} />
          
          <div className="flex w-full justify-center">
            <MintForm publicKey={publicKey} onMintSuccess={handleMintSuccess} />
          </div>

          <NFTGallery nfts={sessionNFTs} />

        </div>
      </main>
    </div>
  );
}

export default App;
