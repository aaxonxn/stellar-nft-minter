import React from 'react';
import { Coins, User, ExternalLink, Loader2 } from 'lucide-react';
import { formatPublicKey } from '../utils/validation';

const WalletDisplay = ({ publicKey, balance, isLoading }) => {
  if (!publicKey) return null;

  return (
    <div className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 animate-fade-in flex gap-6 items-center">
      <div className="flex items-center gap-3">
        <div className="bg-stellar/10 p-2.5 rounded-full flex items-center justify-center">
          <User size={20} className="text-stellar" />
        </div>
        <div>
          <div className="text-gray-400 text-sm font-medium">Connected Wallet</div>
          <div className="font-semibold flex items-center gap-2">
            {formatPublicKey(publicKey)}
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${publicKey}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="View on Stellar Expert"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="w-px h-10 bg-white/10"></div>

      <div className="flex items-center gap-3">
        <div className="bg-[#6c5ce7]/10 p-2.5 rounded-full flex items-center justify-center">
          <Coins size={20} color="#6c5ce7" />
        </div>
        <div>
          <div className="text-gray-400 text-sm font-medium">Balance</div>
          <div className="font-semibold">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : balance === 'Error' ? (
              <span className="text-red-500">Error fetching</span>
            ) : (
              `${balance} XLM`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDisplay;
