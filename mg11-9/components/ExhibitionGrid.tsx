
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExhibitions, getStaffMode } from '../services/data';
import { Share2, Settings, ImageIcon } from 'lucide-react';
import { Exhibition } from '../types';

const ExhibitionGrid: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isStaffMode, setIsStaffMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setExhibitions(getExhibitions());
    setIsStaffMode(getStaffMode());
  }, []);

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.preventDefault(); 
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

  const handleEditImage = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/admin?tab=exhibitions&editExhibition=${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <section 
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto"
      role="region" 
      aria-label="Current Exhibitions"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black pb-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Current Exhibitions</h2>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link 
            to="/admin" 
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 transition-colors"
            aria-label="Go to Staff Dashboard"
          >
            <Settings className="w-3 h-3" /> Manage Content
          </Link>
          <Link 
            to="/exhibitions" 
            className="text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
            aria-label="View all exhibitions"
          >
            See All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12" role="list">
        {exhibitions.map((exhibition) => (
          <div 
            key={exhibition.id} 
            className="group cursor-pointer flex flex-col h-full relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 rounded-sm"
            onClick={() => navigate('/exhibitions')}
            role="listitem"
          >
            <div 
              className="flex flex-col h-full"
              role="button"
              tabIndex={0}
              aria-label={`Exhibition: ${exhibition.title}. ${exhibition.dateRange}. Click for details.`}
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
                
                {/* Actions Layer */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    {isStaffMode && (
                        <button 
                          onClick={(e) => handleEditImage(e, exhibition.id)}
                          className="bg-black text-white p-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-110 flex items-center justify-center"
                          title="Edit Exhibition Content"
                          aria-label={`Edit ${exhibition.title} exhibition image and details`}
                        >
                          <ImageIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                    )}
                    <button 
                      onClick={(e) => handleShare(e, exhibition.title)}
                      className="bg-white/90 backdrop-blur p-2.5 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transform translate-y-2 group-hover:translate-y-0 focus:translate-y-0 shadow-sm hover:shadow-md outline-none focus:ring-2 focus:ring-black"
                      title="Share Exhibition"
                      aria-label={`Share link for ${exhibition.title}`}
                    >
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-2 block">{exhibition.dateRange}</span>
                  <h3 className="text-2xl font-black leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4 tracking-tight">{exhibition.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{exhibition.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExhibitionGrid;
