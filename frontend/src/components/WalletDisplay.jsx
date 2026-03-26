import React from 'react';
import { Coins, User, ExternalLink, Loader2 } from 'lucide-react';
import { formatPublicKey } from '../utils/validation';

const WalletDisplay = ({ publicKey, balance, isLoading }) => {
  if (!publicKey) return null;

  return (
    <div className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-5 sm:p-6 animate-fade-in flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full max-w-lg">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="bg-stellar/10 p-2.5 rounded-full flex items-center justify-center shrink-0">
          <User size={20} className="text-stellar" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-400 text-xs sm:text-sm font-medium">Connected Wallet</div>
          <div className="font-semibold flex items-center gap-2 truncate">
            <span className="truncate">{formatPublicKey(publicKey)}</span>
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${publicKey}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors shrink-0"
              title="View on Stellar Expert"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full h-px sm:w-px sm:h-10 bg-white/10 my-1 sm:my-0 shrink-0"></div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="bg-[#6c5ce7]/10 p-2.5 rounded-full flex items-center justify-center shrink-0">
          <Coins size={20} color="#6c5ce7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-400 text-xs sm:text-sm font-medium">Balance</div>
          <div className="font-semibold truncate">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : balance === 'Error' ? (
              <span className="text-red-500 text-sm">Error fetching</span>
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
