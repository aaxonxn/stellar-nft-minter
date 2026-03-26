import React, { useState } from 'react';
import { connectWallet } from '../services/wallet';
import { Wallet, Loader2 } from 'lucide-react';

const ConnectWallet = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');
    
    const result = await connectWallet();
    
    if (result.success) {
      onConnect(result.publicKey);
    } else {
      setError(result.error);
    }
    
    setIsConnecting(false);
  };

  return (
    <div className="flex flex-col items-end sm:items-start gap-1 sm:gap-2">
      <button 
        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 border-none bg-stellar text-black shadow-[0_4px_14px_0_rgba(20,212,244,0.39)] hover:bg-stellar-hover hover:shadow-[0_6px_20px_rgba(20,212,244,0.23)] hover:-translate-y-[1px] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none animate-fade-in whitespace-nowrap active:scale-[0.98]" 
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? <Loader2 className="w-4 h-4 sm:w-4 sm:h-4 animate-spin shrink-0" /> : <Wallet size={16} className="sm:w-[18px] sm:h-[18px] shrink-0" />}
        <span>{isConnecting ? "Connecting..." : "Connect Freighter"}</span>
      </button>
      {error && <span className="text-red-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1 animate-fade-in">{error}</span>}
    </div>
  );
};

export default ConnectWallet;
