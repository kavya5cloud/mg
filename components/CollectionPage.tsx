import React from 'react';
import { ARTWORKS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';

const CollectionPage: React.FC = () => {
  return (
    <div className="pt-10 min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 mb-20">
         <div className="mb-16 border-b border-gray-800 pb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">The Collection</h1>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Housing over 2,000 works of modern and contemporary art, focusing on the dialogue between Gujarat's heritage and global modernism.
                    </p>
                </div>
                <button className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors">
                    <Filter className="w-4 h-4" /> Filter Works
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTWORKS.map((art) => (
                <div key={art.id} className="group cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-gray-900 mb-4">
                        <img 
                            src={art.imageUrl} 
                            alt={art.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                         <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold italic serif group-hover:underline underline-offset-4">{art.title}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-1">{art.artist}</p>
                        <p className="text-xs text-gray-600 mt-1">{art.year}, {art.medium}</p>
                    </div>
                </div>
            ))}
             {/* Duplicate for visual grid fullness */}
             {ARTWORKS.map((art) => (
                <div key={`${art.id}-dup`} className="group cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-gray-900 mb-4">
                        <img 
                            src={art.imageUrl} 
                            alt={art.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter hue-rotate-15"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold italic serif group-hover:underline underline-offset-4">{art.title}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-1">{art.artist}</p>
                        <p className="text-xs text-gray-600 mt-1">{art.year}, {art.medium}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;