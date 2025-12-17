
import React, { useState, useMemo, useEffect } from 'react';
import { Menu, X, Search, Ticket, Heart, ChevronRight, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoGeometric from './Logo';
import { getExhibitions, getArtworks, getCollectables } from '../services/data';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Visit', path: '/visit' },
    { name: 'Exhibitions', path: '/exhibitions' },
    { name: 'Collection', path: '/collection' },
    { name: 'Shop', path: '/shop' },
  ];

  // Close search and menu on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // Search Logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search Pages
    const pages = [
      { title: 'Plan Your Visit', path: '/visit', type: 'Page' },
      { title: 'Shop & Collectables', path: '/shop', type: 'Page' },
      { title: 'Book Tickets', path: '/booking', type: 'Page' },
      { title: 'The Collection', path: '/collection', type: 'Page' },
      { title: 'Membership', path: '/membership', type: 'Page' },
      { title: 'Volunteer', path: '/volunteer', type: 'Page' },
    ];
    pages.forEach(page => {
      if (page.title.toLowerCase().includes(query)) {
        results.push(page);
      }
    });

    // Dynamic Data
    const exhibitions = getExhibitions();
    const artworks = getArtworks();
    const collectables = getCollectables();

    // Search Exhibitions
    exhibitions.forEach(ex => {
      if (ex.title.toLowerCase().includes(query) || ex.description.toLowerCase().includes(query)) {
        results.push({
          title: ex.title,
          path: '/exhibitions',
          type: 'Exhibition',
          meta: ex.dateRange
        });
      }
    });

    // Search Artworks
    artworks.forEach(art => {
      if (art.title.toLowerCase().includes(query) || art.artist.toLowerCase().includes(query)) {
        results.push({
          title: art.title,
          path: '/collection',
          type: 'Artwork',
          meta: art.artist
        });
      }
    });

    // Search Shop
    collectables.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
            results.push({
                title: item.name,
                path: '/shop',
                type: 'Shop',
                meta: `₹${item.price}`
            });
        }
    });

    return results.slice(0, 6); // Limit results
  }, [searchQuery]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link to="/" className={`flex items-center gap-3 z-50 group transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
          <LogoGeometric className="w-10 h-10 transition-transform duration-500 group-hover:rotate-90" />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tighter leading-none group-hover:opacity-70 transition-opacity">MOCA</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase leading-none mt-0.5 text-gray-500">Gandhinagar</span>
          </div>
        </Link>

        {/* SEARCH OVERLAY (Replaces Nav) */}
        <div className={`absolute inset-0 bg-white px-4 md:px-0 md:static md:bg-transparent flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible z-40' : 'opacity-0 invisible md:opacity-100 md:visible md:w-auto md:z-auto'}`}>
           {isSearchOpen ? (
             <div className="w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200">
               <input 
                  autoFocus
                  type="text" 
                  placeholder="Search exhibitions, artists, shop..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xl md:text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 text-center md:text-left"
               />
             </div>
           ) : (
             /* Desktop Nav - Only visible when search is closed */
             <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-semibold tracking-wide hover:underline decoration-2 underline-offset-4 ${
                      isActive(link.path) ? 'underline' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>
           )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 md:space-x-4 z-50 bg-white md:bg-transparent pl-4">
          <button 
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) setTimeout(() => setSearchQuery(''), 100);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle Search"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          
          <Link to="/donate" className={`hidden lg:flex items-center gap-2 border border-black px-4 py-2.5 text-sm font-bold rounded hover:bg-black hover:text-white transition-colors ${isSearchOpen ? 'hidden' : ''}`}>
             <Heart className="w-4 h-4" />
             <span>Donate</span>
          </Link>

          <Link to="/booking" className={`bg-black text-white px-5 py-2.5 text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Tickets</span>
          </Link>

          {/* Mobile Menu Button - Hide when search is open */}
          {!isSearchOpen && (
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isSearchOpen && searchQuery && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl z-40 max-h-[70vh] overflow-y-auto animate-in slide-in-from-top-2">
           <div className="max-w-[1000px] mx-auto py-8 px-6">
              {searchResults.length > 0 ? (
                <div className="grid gap-2">
                   {searchResults.map((result, idx) => (
                     <button 
                        key={idx}
                        onClick={() => handleResultClick(result.path)}
                        className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border-b border-gray-50 last:border-0"
                     >
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                               result.type === 'Exhibition' ? 'bg-blue-100 text-blue-800' :
                               result.type === 'Artwork' ? 'bg-purple-100 text-purple-800' :
                               result.type === 'Shop' ? 'bg-orange-100 text-orange-800' :
                               'bg-gray-200 text-gray-800'
                             }`}>
                               {result.type}
                             </span>
                           </div>
                           <h4 className="text-xl font-bold group-hover:underline underline-offset-4">{result.title}</h4>
                           {result.meta && <p className="text-sm text-gray-500">{result.meta}</p>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                     </button>
                   ))}
                   <button 
                      onClick={() => handleResultClick('/exhibitions')}
                      className="mt-4 text-center w-full py-4 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black"
                   >
                     View All Results
                   </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                   <p className="text-lg">No results found for "{searchQuery}"</p>
                   <p className="text-sm">Try searching for "Shop", "Van Gogh", or "Tickets"</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && !isSearchOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 flex flex-col space-y-8 md:hidden h-screen overflow-y-auto animate-in slide-in-from-right duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-bold tracking-tight hover:text-gray-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-bold tracking-tight text-gray-500"
          >
              Donate
          </Link>
          <div className="pt-8 border-t border-gray-200 space-y-4">
            <Link 
              to="/booking" 
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-black text-white text-center py-4 text-lg font-bold"
            >
              Get Tickets
            </Link>
             <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-500 text-center py-4 text-sm font-bold hover:text-black hover:border-black transition-colors"
            >
              <Lock className="w-4 h-4" /> Staff Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
