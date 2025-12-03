import React from 'react';
import { EXHIBITIONS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';

const ExhibitionsPage: React.FC = () => {
  const handleShare = (title: string) => {
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
    <div className="pt-10 min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-6 mb-20">
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Exhibitions</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
                Discover our rotation of pioneering contemporary art, featuring local and international artists who challenge the status quo.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-20">
            {EXHIBITIONS.map((exhibition, index) => (
                <div key={exhibition.id} className="grid md:grid-cols-2 gap-8 md:gap-16 items-center group">
                    <div className={`overflow-hidden aspect-[4/3] bg-gray-100 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                         <img 
                            src={exhibition.imageUrl} 
                            alt={exhibition.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                         />
                    </div>
                    <div className={`${index % 2 === 1 ? 'md:order-1 md:text-right items-end' : 'items-start'} flex flex-col justify-center`}>
                        <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block w-fit">
                            {exhibition.category}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 group-hover:underline decoration-4 underline-offset-8">
                            {exhibition.title}
                        </h2>
                        <p className="text-lg font-medium text-gray-500 mb-6">{exhibition.dateRange}</p>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-lg mb-8">
                            {exhibition.description} This exhibition invites viewers to reconsider their relationship with the medium through immersive installations and historical context.
                        </p>
                        <div className={`flex items-center gap-6 ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
                            <button className="border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition-colors">
                                Learn More
                            </button>
                            <button 
                                onClick={() => handleShare(exhibition.title)}
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;