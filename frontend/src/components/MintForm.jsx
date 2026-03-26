import React, { useState } from 'react';
import { validateNFTData, formatPublicKey } from '../utils/validation';
import { mintNFT } from '../services/stellar';
import { ImagePlus, Loader2, CodeXml, Sparkles, ExternalLink } from 'lucide-react';

const MintForm = ({ publicKey, onMintSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [mintStatus, setMintStatus] = useState('idle'); // idle, minting, success, error
  const [progressText, setProgressText] = useState('');
  const [mintedInfo, setMintedInfo] = useState(null);

  const isValid = validateNFTData(formData.name, formData.description, formData.imageUrl).isValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (mintStatus === 'error') {
      setMintStatus('idle');
      setProgressText('');
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    
    // Validate
    const validation = validateNFTData(formData.name, formData.description, formData.imageUrl);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setMintStatus('minting');
    setProgressText('Initializing...');
    setMintedInfo(null);

    try {
      const result = await mintNFT(publicKey, formData, (msg) => {
        setProgressText(msg);
      });
      
      if (result.success) {
        setMintStatus('success');
        setMintedInfo(result);
        if (onMintSuccess) onMintSuccess(result);
        setFormData({ name: '', description: '', imageUrl: '' });
      }
    } catch (err) {
      console.error(err);
      setMintStatus('error');
      setProgressText(err.message || "Minting failed. Please try again.");
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-12 text-center animate-fade-in w-full max-w-lg mx-auto">
        <CodeXml size={48} className="text-stellar opacity-50 mx-auto mb-4 w-10 h-10 sm:w-12 sm:h-12" />
        <h3 className="font-semibold text-lg sm:text-xl">Wallet Not Connected</h3>
        <p className="text-gray-400 mt-2 text-sm sm:text-base px-2">
          Please connect your Freighter wallet to access the minter.
        </p>
      </div>
    );
  }

  if (mintStatus === 'success' && mintedInfo) {
    return (
      <div className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-10 text-center w-full max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stellar/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
          <Sparkles className="text-stellar w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h2 className="text-gradient font-semibold text-xl sm:text-2xl">NFT Minted Successfully!</h2>
        <p className="text-gray-400 mt-2 mb-5 sm:mb-6 text-sm sm:text-base px-2 truncate">
          Your asset "{mintedInfo.data.name}" is now live.
        </p>
        
        {mintedInfo.data.imageUrl && (
          <img 
            src={mintedInfo.data.imageUrl} 
            alt={mintedInfo.data.name}
            className="w-full max-w-[250px] sm:max-w-[300px] rounded-xl object-cover aspect-square mb-5 sm:mb-6 border border-white/10 mx-auto shadow-lg" 
          />
        )}

        <div className="text-left bg-black/20 p-3 sm:p-4 rounded-lg mb-5 sm:mb-6 text-xs sm:text-sm border border-white/5 break-words">
          <div className="mb-2">
             <span className="text-gray-400">Asset Code:</span> <span className="text-white ml-1 font-medium">{mintedInfo.assetCode}</span>
          </div>
          <div className="mb-2">
             <span className="text-gray-400">Issuer:</span> <span className="text-white ml-1">{formatPublicKey(mintedInfo.issuer)}</span>
          </div>
          <div>
             <span className="text-gray-400">Transaction:</span> 
             <a 
               href={`https://stellar.expert/explorer/testnet/tx/${mintedInfo.hash}`} 
               target="_blank" 
               rel="noreferrer"
               className="text-stellar no-underline ml-1.5 inline-flex items-center gap-1 hover:underline"
             >
               {formatPublicKey(mintedInfo.hash)} <ExternalLink size={12} />
             </a>
          </div>
        </div>
        
        <div>
          <button 
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200"
            onClick={() => {
              setMintStatus('idle');
              setMintedInfo(null);
            }}
          >
            Mint Another NFT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8 w-full max-w-lg mx-auto animate-fade-in">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-gradient font-semibold text-xl sm:text-2xl">Create New NFT</h2>
        <p className="text-gray-400 mt-1 sm:mt-1.5 text-xs sm:text-sm">
          Mint a new digital asset on the Stellar network
        </p>
      </div>

      <form onSubmit={handleMint}>
        <div className="mb-4 sm:mb-5 flex flex-col gap-1.5 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1 sm:ml-0" htmlFor="name">NFT Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-3 sm:py-3.5 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-stellar focus:ring-2 focus:ring-stellar/10 transition-all placeholder-gray-500 disabled:opacity-50"
            placeholder="e.g. Celestial Voyager"
            value={formData.name}
            onChange={handleChange}
            disabled={mintStatus === 'minting'}
          />
          {errors.name && <span className="text-red-500 text-[10px] sm:text-xs mt-0.5 ml-1">{errors.name}</span>}
        </div>

        <div className="mb-4 sm:mb-5 flex flex-col gap-1.5 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1 sm:ml-0" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full px-4 py-3 sm:py-3.5 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-stellar focus:ring-2 focus:ring-stellar/10 transition-all placeholder-gray-500 resize-y min-h-[80px] disabled:opacity-50"
            placeholder="Describe your NFT..."
            rows="3"
            value={formData.description}
            onChange={handleChange}
            disabled={mintStatus === 'minting'}
          />
          {errors.description && <span className="text-red-500 text-[10px] sm:text-xs mt-0.5 ml-1">{errors.description}</span>}
        </div>

        <div className="mb-5 sm:mb-6 flex flex-col gap-1.5 sm:gap-2">
          <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1 sm:ml-0" htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            className="w-full px-4 py-3 sm:py-3.5 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-stellar focus:ring-2 focus:ring-stellar/10 transition-all placeholder-gray-500 disabled:opacity-50"
            placeholder="https://example.com/image.png"
            value={formData.imageUrl}
            onChange={handleChange}
            disabled={mintStatus === 'minting'}
          />
          {errors.imageUrl && <span className="text-red-500 text-[10px] sm:text-xs mt-0.5 ml-1">{errors.imageUrl}</span>}
        </div>

        {mintStatus === 'minting' && (
          <div className="p-3 sm:p-3.5 bg-stellar/10 text-stellar rounded-lg mb-5 text-xs sm:text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
            <span className="truncate">{progressText}</span>
          </div>
        )}

        {mintStatus === 'error' && (
          <div className="p-3 sm:p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg mb-5 text-xs sm:text-sm break-words">
            {progressText}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full mt-1 sm:mt-2 p-3.5 sm:p-4 flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all duration-200 bg-stellar text-black shadow-[0_4px_14px_0_rgba(20,212,244,0.39)] hover:bg-stellar-hover hover:shadow-[0_6px_20px_rgba(20,212,244,0.23)] hover:-translate-y-[1px] active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={mintStatus === 'minting' || (!isValid && formData.name.length > 0)}
        >
          {mintStatus === 'minting' ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <ImagePlus size={18} className="shrink-0" />}
          <span className="truncate">{mintStatus === 'minting' ? 'Minting in Progress...' : 'Mint NFT on Stellar'}</span>
        </button>
      </form>
    </div>
  );
};

export default MintForm;
