
import React, { useState, useEffect } from 'react';
import { getExhibitions } from '../services/data';
import { Share2 } from 'lucide-react';
import { Exhibition } from '../types';

const ExhibitionGrid: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/exhibitions`;
    
    if (navigator.share) {
        navigator.share({
            title: `MOCA Gandhinagar: ${title}`,
            text: `Check out the exhibition "${title}" at MOCA Gandhinagar.`,
            url: url
        }).catch((err) => console.log('Share canceled', err));
    } else {
        navigator.clipboard.writeText(url);
        alert('Exhibition link copied to clipboard!');
    }
  };

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black pb-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Current Exhibitions</h2>
        <a href="/exhibitions" className="text-sm font-bold uppercase tracking-widest mt-4 md:mt-0 hover:underline">See All</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {exhibitions.map((exhibition) => (
          <div key={exhibition.id} className="group cursor-pointer flex flex-col h-full relative">
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-100 mb-6">
              <img 
                src={exhibition.imageUrl} 
                alt={exhibition.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:contrast-110"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {exhibition.category}
              </div>
              <button 
                onClick={(e) => handleShare(e, exhibition.title)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                title="Share Exhibition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow flex flex-col">
                <span className="text-xs font-medium text-gray-500 mb-2 block">{exhibition.dateRange}</span>
                <h3 className="text-2xl font-bold leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">{exhibition.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{exhibition.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExhibitionGrid;
