import React from 'react';
import { ExternalLink, Database, Loader2, Hexagon } from 'lucide-react';
import { formatPublicKey } from '../utils/validation';

const NFTGallery = ({ nfts = [], fetchedAssets = [], isLoading = false }) => {
  if (nfts.length === 0 && fetchedAssets.length === 0 && !isLoading) return null;

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto flex flex-col gap-12 pb-12">
      
      {/* Session Minted NFTs */}
      {nfts.length > 0 && (
        <div>
          <h3 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full inline-block"></span>
            Session Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {nfts.map((nft, idx) => (
              <div 
                key={`session-${idx}`} 
                className="group relative bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-white/20"
              >
                {/* Gradient Accent Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-colors duration-500 pointer-events-none z-0" />
                
                <div className="relative w-full aspect-square bg-black/50 z-10 border-b border-white/5">
                  <img 
                    src={nft.data.imageUrl} 
                    alt={nft.data.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Inner shadow overlay for image */}
                  <div className="absolute inset-0 shadow-[inset_0_-20px_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>
                
                <div className="p-5 flex flex-col flex-1 relative z-10 bg-slate-900/40">
                  <h4 className="m-0 mb-1 font-bold text-xl text-white line-clamp-1" title={nft.data.name}>
                    {nft.data.name}
                  </h4>
                  <div className="text-[0.7rem] text-cyan-400 font-semibold mb-3 uppercase tracking-widest opacity-80">
                    Stellar Asset
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-5 flex-1 line-clamp-2 overflow-hidden text-ellipsis leading-relaxed" title={nft.data.description}>
                    {nft.data.description}
                  </p>
                  
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">Asset Code</span>
                      <span className="font-bold text-white truncate pl-2">{nft.assetCode}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">Transaction</span>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${nft.hash}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyan-400 font-medium no-underline flex items-center gap-1.5 hover:text-white transition-colors group/link"
                      >
                        <span className="group-hover/link:underline">{formatPublicKey(nft.hash)}</span> 
                        <ExternalLink size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persisted Blockchain Assets */}
      {(fetchedAssets.length > 0 || isLoading) && (
        <div className="pt-8 border-t border-white/10 mt-4">
          <div className="flex items-center gap-3 mb-8">
             <h3 className="text-2xl font-bold text-white flex items-center gap-2 m-0">
               <span className="w-2 h-8 bg-gradient-to-b from-[#a29bfe] to-[#6c5ce7] rounded-full inline-block"></span>
               Your Wallet NFTs
             </h3>
             {isLoading && <Loader2 className="w-6 h-6 text-[#a29bfe] animate-spin" />}
          </div>
          
          {!isLoading && fetchedAssets.length === 0 ? (
            <div className="text-gray-400 text-base bg-white/5 p-6 rounded-xl border border-white/10">
              No custom assets found in your wallet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {fetchedAssets.map((asset, idx) => (
                <div 
                  key={`asset-${idx}`} 
                  className="group relative bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-[#6c5ce7]/20 hover:border-white/20"
                >
                  {/* Gradient Accent Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a29bfe]/0 to-[#6c5ce7]/0 group-hover:from-[#a29bfe]/10 group-hover:to-[#6c5ce7]/10 transition-colors duration-500 pointer-events-none z-0" />
                  
                  {asset.metadata?.imageUrl ? (
                    <div className="relative w-full aspect-[2/1] sm:aspect-[4/3] bg-black/50 z-10 border-b border-white/5 overflow-hidden">
                      <img 
                        src={asset.metadata.imageUrl} 
                        alt={asset.metadata.name || asset.asset_code} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 shadow-[inset_0_-20px_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[2/1] sm:aspect-[4/3] bg-gradient-to-br from-slate-900 to-black z-10 border-b border-white/5 flex items-center justify-center overflow-hidden">
                      <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6c5ce7]/20 via-transparent to-transparent opacity-50"></div>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                        <Hexagon size={32} className="text-[#a29bfe] group-hover:text-white transition-colors" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5 flex flex-col flex-1 relative z-10 bg-slate-900/40">
                    <h4 className="m-0 mb-1 font-bold text-xl text-white uppercase tracking-wider truncate" title={asset.metadata?.name || asset.asset_code}>
                      {asset.metadata?.name || asset.asset_code}
                    </h4>
                    
                    <div className={`text-[0.7rem] text-[#a29bfe] font-semibold uppercase tracking-widest opacity-80 ${asset.metadata?.description ? 'mb-3' : 'mb-6'}`}>
                      Stellar Asset
                    </div>

                    {asset.metadata?.description && (
                      <p className="text-gray-400 text-sm mb-5 flex-1 line-clamp-2 overflow-hidden text-ellipsis leading-relaxed" title={asset.metadata.description}>
                        {asset.metadata.description}
                      </p>
                    )}
                    
                    <div className={`pt-4 border-t border-white/10 flex flex-col gap-3 ${!asset.metadata?.description ? 'mt-auto' : ''}`}>
                      <div className="flex justify-between items-center text-sm bg-black/20 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400 font-medium">Balance</span>
                        <span className="font-bold text-white text-base">{asset.balance}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm px-1 py-1">
                        <span className="text-gray-400 font-medium">Issuer</span>
                        <a 
                          href={`https://stellar.expert/explorer/testnet/account/${asset.asset_issuer}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#a29bfe] font-medium no-underline flex items-center gap-1.5 hover:text-white transition-colors group/link"
                        >
                          <span className="group-hover/link:underline">{formatPublicKey(asset.asset_issuer)}</span> 
                          <ExternalLink size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default NFTGallery;
