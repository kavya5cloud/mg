import React from 'react';
import { ARTWORKS } from '../constants';

const CollectionHighlights: React.FC = () => {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block">The Collection</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Art for Our Time</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ARTWORKS.map((art) => (
                <div key={art.id} className="group relative aspect-square overflow-hidden bg-gray-900">
                    <img 
                        src={art.imageUrl} 
                        alt={art.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{art.artist}</p>
                        <h3 className="text-xl font-bold italic serif">{art.title}</h3>
                        <p className="text-sm text-gray-300 mt-1">{art.year}, {art.medium}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-12 text-center">
             <button className="border border-white text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Explore The Collection
             </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionHighlights;
