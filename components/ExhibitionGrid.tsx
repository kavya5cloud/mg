
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExhibitions } from '../services/data';
import { Share2 } from 'lucide-react';
import { Exhibition } from '../types';

const ExhibitionGrid: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExhibitions(getExhibitions());
  }, []);

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.preventDefault(); // Prevent Link navigation if wrapped
    e.stopPropagation(); // Stop click from bubbling to parent card
    
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

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black pb-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Current Exhibitions</h2>
        <Link to="/exhibitions" className="text-sm font-bold uppercase tracking-widest mt-4 md:mt-0 hover:underline">See All</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12" role="list">
        {exhibitions.map((exhibition) => (
          <div 
            key={exhibition.id} 
            className="group cursor-pointer flex flex-col h-full relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 rounded-sm"
            onClick={() => navigate('/exhibitions')}
            role="button"
            tabIndex={0}
            aria-label={`View details for exhibition: ${exhibition.title}`}
            onKeyDown={(e) => handleKeyDown(e, '/exhibitions')}
          >
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-100 mb-6">
              <img 
                src={exhibition.imageUrl} 
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:contrast-110"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider z-10">
                {exhibition.category}
              </div>
              <button 
                onClick={(e) => handleShare(e, exhibition.title)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transform translate-y-2 group-hover:translate-y-0 focus:translate-y-0 shadow-sm hover:shadow-md z-20 outline-none focus:ring-2 focus:ring-black"
                title="Share Exhibition"
                aria-label={`Share ${exhibition.title}`}
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
