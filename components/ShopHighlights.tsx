
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { getCollectables } from '../services/data';
import { Collectable } from '../types';

const ShopHighlights: React.FC = () => {
  const [items, setItems] = useState<Collectable[]>([]);

  useEffect(() => {
    // Get 3 items, preferably specifically chosen, but here we slice
    const allItems = getCollectables();
    // Grab items 0, 2, and 5 for variety if available, else just first 3
    const showcase = allItems.length > 5 ? [allItems[0], allItems[2], allItems[5]] : allItems.slice(0, 3);
    setItems(showcase);
  }, []);

  return (
    <section className="py-24 bg-white border-t border-black/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <span className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-2 block flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> MOCA Design Store
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Curated Objects</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-orange-600 transition-colors mt-6 md:mt-0">
                Shop The Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item) => (
                <Link key={item.id} to="/shop" className="group block">
                    <div className="bg-gray-50 aspect-square overflow-hidden mb-6 relative">
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                         <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.category}
                         </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-xl leading-tight group-hover:underline decoration-2 underline-offset-4 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                        <span className="font-medium text-lg">₹{item.price.toLocaleString()}</span>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ShopHighlights;
