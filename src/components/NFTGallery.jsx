import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatPublicKey } from '../utils/validation';

const NFTGallery = ({ nfts }) => {
  if (!nfts || nfts.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-6xl mx-auto">
      <h3 className="mb-6 text-xl font-semibold text-gradient">
        Session Activity (Minted NFTs)
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {nfts.map((nft, idx) => (
          <div key={idx} className="bg-stellar-card backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden flex flex-col animate-fade-in transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(20,212,244,0.15)]">
            <div className="relative w-full aspect-square bg-black/20">
              <img 
                src={nft.data.imageUrl} 
                alt={nft.data.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h4 className="m-0 mb-2 font-semibold text-lg line-clamp-1" title={nft.data.name}>{nft.data.name}</h4>
              <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3 overflow-hidden text-ellipsis" title={nft.data.description}>
                {nft.data.description}
              </p>
              
              <div className="pt-4 border-t border-white/10 text-[0.85rem]">
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-400 truncate">Code:</span>
                  <span className="font-medium truncate pl-2">{nft.assetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tx Hash:</span>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${nft.hash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-stellar no-underline flex items-center gap-1 hover:underline"
                  >
                    {formatPublicKey(nft.hash)} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
