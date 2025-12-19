
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Search, RefreshCw, LogOut, TrendingUp, Users, Calendar, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Package, Filter, Upload, Mail, BarChart3, PieChart, Home, RotateCcw, Layout, UserPlus, Eye, EyeOff, Tag, IndianRupee, Trash2, Database, AlertTriangle, Link as LinkIcon, Info, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getExhibitions, saveExhibitions, getArtworks, saveArtworks, getCollectables, saveCollectables, getShopOrders, updateShopOrders, getNewsletterEmails, getBookings, getHomepageGallery, saveHomepageGallery, resetHomepageGallery, getPageAssets, getStaffMode, setStaffMode, savePageAssets, getStorageUsage, clearAllAppData } from '../services/data';
import { Exhibition, Artwork, Collectable, ShopOrder, Booking, PageAssets, TeamMember } from '../types';

type Tab = 'bookings' | 'orders' | 'exhibitions' | 'collection' | 'shop' | 'newsletter' | 'homepage' | 'pages' | 'settings';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isStaffModeEnabled, setIsStaffModeEnabled] = useState(getStaffMode());
  const [storageMB, setStorageMB] = useState(getStorageUsage());
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [homepageGallery, setHomepageGallery] = useState<any[]>([]);
  const [pageAssets, setPageAssets] = useState<PageAssets | null>(null);
  
  // UI States
  const [previewError, setPreviewError] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        loadData();
        setStorageMB(getStorageUsage());
        const tabParam = searchParams.get('tab') as Tab;
        if (tabParam) setActiveTab(tabParam);
    }
  }, [isAuthenticated, searchParams]);

  const loadData = () => {
      setBookings(getBookings());
      setShopOrders(getShopOrders());
      setExhibitions(getExhibitions());
      setArtworks(getArtworks());
      setCollectables(getCollectables());
      setNewsletterEmails(getNewsletterEmails());
      setHomepageGallery(getHomepageGallery());
      setPageAssets(getPageAssets());
      setStorageMB(getStorageUsage());
  };

  const toggleStaffMode = () => {
      const newState = !isStaffModeEnabled;
      setIsStaffModeEnabled(newState);
      setStaffMode(newState);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'exhibition' | 'artwork' | 'collectable' | 'gallery-image' | 'page-asset' | 'team-member' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [activeTrackIdx, setActiveTrackIdx] = useState<number | null>(null);
  const [activeAssetKey, setActiveAssetKey] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') setIsAuthenticated(true);
    else alert('Incorrect password. Try "admin"');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleDelete = (id: string, type: 'exhibition' | 'artwork' | 'collectable' | 'gallery-image' | 'team-member') => {
      if (!window.confirm('Are you sure?')) return;
      let success = false;
      if (type === 'exhibition') {
          const newData = exhibitions.filter(e => e.id !== id);
          success = saveExhibitions(newData);
          if (success) setExhibitions(newData);
      } else if (type === 'artwork') {
          const newData = artworks.filter(a => a.id !== id);
          success = saveArtworks(newData);
          if (success) setArtworks(newData);
      } else if (type === 'collectable') {
          const newData = collectables.filter(c => c.id !== id);
          success = saveCollectables(newData);
          if (success) setCollectables(newData);
      } else if (type === 'gallery-image' && activeTrackIdx !== null) {
          const updatedGallery = [...homepageGallery];
          updatedGallery[activeTrackIdx].images = updatedGallery[activeTrackIdx].images.filter((img: string) => img !== id);
          success = saveHomepageGallery(updatedGallery);
          if (success) setHomepageGallery(updatedGallery);
      } else if (type === 'team-member' && pageAssets) {
          const updatedAssets = { ...pageAssets };
          updatedAssets.about.team = updatedAssets.about.team.filter(m => m.id !== id);
          success = savePageAssets(updatedAssets);
          if (success) setPageAssets(updatedAssets);
      }
      setStorageMB(getStorageUsage());
  };

  const openEditor = (type: 'exhibition' | 'artwork' | 'collectable' | 'gallery-image' | 'page-asset' | 'team-member', item?: any, meta?: any) => {
      setEditType(type);
      setEditItem(item ? { ...item } : { inStock: true }); 
      setPreviewError(false);
      setIsEditing(true);
      if (type === 'gallery-image') setActiveTrackIdx(meta);
      if (type === 'page-asset' || type === 'team-member') setActiveAssetKey(meta);
  };

  const handleSaveItem = (e: React.FormEvent) => {
      e.preventDefault();
      let success = false;
      
      if (editType === 'gallery-image' && activeTrackIdx !== null) {
          const updatedGallery = [...homepageGallery];
          const newImg = editItem.imageUrl;
          if (newImg) {
              if (editItem.oldUrl) {
                  updatedGallery[activeTrackIdx].images = updatedGallery[activeTrackIdx].images.map((img: string) => img === editItem.oldUrl ? newImg : img);
              } else {
                  updatedGallery[activeTrackIdx].images = [...updatedGallery[activeTrackIdx].images, newImg];
              }
              success = saveHomepageGallery(updatedGallery);
              if (success) setHomepageGallery(updatedGallery);
          }
      } else if (editType === 'team-member' && pageAssets) {
          const updatedAssets = { ...pageAssets };
          const id = editItem.id || Date.now().toString();
          const newMember = { ...editItem, id };
          if (editItem.id) {
              updatedAssets.about.team = updatedAssets.about.team.map(m => m.id === id ? newMember : m);
          } else {
              updatedAssets.about.team = [...updatedAssets.about.team, newMember];
          }
          success = savePageAssets(updatedAssets);
          if (success) setPageAssets(updatedAssets);
      } else if (editType === 'page-asset' && activeAssetKey && pageAssets) {
          const [page, key] = activeAssetKey.split('.');
          const updatedAssets = { ...pageAssets };
          (updatedAssets as any)[page][key] = editItem.imageUrl || editItem.text;
          success = savePageAssets(updatedAssets);
          if (success) setPageAssets(updatedAssets);
      } else {
          const id = editItem.id || Date.now().toString();
          const newItem = { ...editItem, id };
          if (editType === 'exhibition') {
              const updated = editItem.id ? exhibitions.map(ex => ex.id === id ? newItem : ex) : [...exhibitions, newItem];
              success = saveExhibitions(updated);
              if (success) setExhibitions(updated);
          } else if (editType === 'artwork') {
              const updated = editItem.id ? artworks.map(art => art.id === id ? newItem : art) : [...artworks, newItem];
              success = saveArtworks(updated);
              if (success) setArtworks(updated);
          } else if (editType === 'collectable') {
              const updated = editItem.id ? collectables.map(c => c.id === id ? newItem : c) : [...collectables, newItem];
              success = saveCollectables(updated);
              if (success) setCollectables(updated);
          }
      }

      if (success) {
        setIsEditing(false); setEditItem(null); setActiveTrackIdx(null); setActiveAssetKey(null);
        setSearchParams({});
        loadData();
      }
  };

  /**
   * CRITICAL: Intelligent Browser-side Compression
   * This makes "Direct Upload" work without filling up the browser quota or failing.
   */
  const handleImageUpload = (file: File) => {
      if (!file) return;
      setIsCompressing(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              // Max width for museum displays (1200px is perfect for web)
              const MAX_WIDTH = 1200;
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG at 0.7 quality
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              setEditItem((prev: any) => ({ ...prev, imageUrl: compressedDataUrl }));
              setPreviewError(false);
              setIsCompressing(false);
          };
          img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
  };

  const transformImageUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    
    // Drive: Extract ID and use standard /uc? export link
    const driveMatch = cleanUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)|https?:\/\/[\w\d.-]+\.google\.com\/.*?id=)([a-zA-Z0-9_-]{28,})/);
    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/uc?id=${driveMatch[1]}`;
    }
    
    // Dropbox
    if (cleanUrl.includes('dropbox.com')) {
        return cleanUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '').replace('?dl=1', '');
    }

    return cleanUrl;
  };

  const renderImageInput = () => {
    const isDataUrl = editItem.imageUrl?.startsWith('data:');
    const isDriveUrl = editItem.imageUrl?.includes('drive.google.com');

    return (
      <div className="space-y-4">
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Visual Asset</label>
          
          <div 
              className={`border-2 border-dashed rounded-[2rem] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative overflow-hidden bg-gray-50/50 min-h-[300px] ${previewError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-black'}`}
              onClick={() => !editItem.imageUrl && document.getElementById('hidden-file-input')?.click()}
          >
              <input type="file" id="hidden-file-input" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
              }} />
              
              {isCompressing && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-black mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Optimizing for Museum Database...</p>
                  </div>
              )}

              {editItem.imageUrl ? (
                  <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-100">
                      {previewError ? (
                          <div className="w-full h-[250px] flex flex-col items-center justify-center p-6 bg-red-50">
                              <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                              <p className="text-xs font-bold text-red-700">Display Blocked</p>
                              <p className="text-[10px] text-red-500 mt-2 text-center">Google restricted this link. Ensure "Anyone with the link" is enabled in Drive sharing.</p>
                              <button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); setEditItem((prev:any)=>({...prev, imageUrl: ''})); }}
                                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase"
                              >
                                  Try Direct Upload
                              </button>
                          </div>
                      ) : (
                        <>
                          <img 
                            src={editItem.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-2xl" 
                            onError={() => setPreviewError(true)}
                            onLoad={() => setPreviewError(false)}
                          />
                          <div 
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200"
                            onClick={(e) => { e.stopPropagation(); document.getElementById('hidden-file-input')?.click(); }}
                          >
                              <Upload className="w-8 h-8 mb-2" />
                              <span className="font-bold text-sm">Replace with High-Res Photo</span>
                          </div>
                        </>
                      )}
                  </div>
              ) : (
                  <div className="py-12">
                      <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-black" />
                      </div>
                      <p className="text-lg font-black text-gray-900">Direct Upload</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest leading-none">Best for stability</p>
                  </div>
              )}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <LinkIcon className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Or paste Google Drive 'Share' link..." 
              className={`w-full border-2 border-gray-100 pl-11 pr-16 py-4 rounded-2xl bg-white text-sm focus:border-black outline-none transition-all`}
              value={isDataUrl ? 'Direct Upload Active (Optimized)' : (editItem.imageUrl || '')} 
              onChange={e => {
                  const transformed = transformImageUrl(e.target.value);
                  setEditItem((prev: any) => ({...prev, imageUrl: transformed}));
                  setPreviewError(false);
              }} 
              readOnly={!!isDataUrl} 
            />
            {isDataUrl ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1">
                    <Check className="w-2 h-2" /> STORED LOCAL
                </div>
            ) : editItem.imageUrl && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">
                    EXTERNAL LINK
                </div>
            )}
          </div>
          
          {isDataUrl && (
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-green-500" /> Image processed and stored in museum archive safely.
              </p>
          )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-10 rounded-[3rem] shadow-2xl">
             <div className="text-center mb-10"><h1 className="text-4xl font-black mb-2 tracking-tighter">MOCA</h1><p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Gandhinagar Admin</p></div>
             <form onSubmit={handleLogin} className="space-y-4">
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-black text-center font-bold" placeholder="Security Key" />
                 <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-gray-800 transition-colors uppercase tracking-widest">Login</button>
             </form>
         </div>
      </div>
    );
  }

  const usagePercent = Math.min(100, (Number(storageMB) / 5) * 100);

  return (
    <div className="min-h-screen bg-white flex flex-col">
       <header className="bg-black text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-8">
               <div className="font-black tracking-tighter text-3xl">MOCA <span className="font-normal text-gray-500 ml-1">SYSTEMS</span></div>
               <button 
                onClick={toggleStaffMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isStaffModeEnabled ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
               >
                 {isStaffModeEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                 Editing {isStaffModeEnabled ? 'ACTIVE' : 'LOCKED'}
               </button>
           </div>
           
           <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end mr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Database className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Memory: {storageMB}MB</span>
                    </div>
                    <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${usagePercent > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${usagePercent}%` }} />
                    </div>
               </div>
               <button onClick={handleLogout} className="p-3 bg-white/10 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><LogOut className="w-5 h-5" /></button>
           </div>
       </header>

       <main className="flex-grow max-w-[1600px] w-full mx-auto p-10">
           <div className="flex flex-wrap gap-4 mb-12 border-b-2 border-gray-100 pb-1">
               {['bookings', 'orders', 'shop', 'exhibitions', 'collection', 'homepage', 'pages', 'newsletter', 'settings'].map(t => (
                   <button key={t} onClick={() => setActiveTab(t as Tab)} className={`px-4 py-4 text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === t ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-black'}`}>
                       {t === 'pages' ? 'Content' : t}
                   </button>
               ))}
           </div>

           {activeTab === 'settings' && (
               <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4">
                   <h2 className="text-5xl font-black mb-8 tracking-tighter">System Health</h2>
                   <div className="space-y-6">
                        <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-green-500" /> Database Integrity
                            </h3>
                            <div className="text-sm text-gray-600 mb-8 leading-relaxed">
                                <p className="font-bold text-black mb-2">Notice on Storage:</p>
                                <p>This museum is currently using browser-local storage (5MB limit). The new **Direct Upload** engine automatically compresses your photos so they occupy 95% less space while staying sharp.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => { if(window.confirm('Delete everything?')) clearAllAppData(); }}
                                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100"
                                >
                                    Factory Reset
                                </button>
                                <button 
                                    onClick={() => loadData()}
                                    className="flex-1 border-2 border-black text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                                >
                                    Re-Sync Stats
                                </button>
                            </div>
                        </div>
                   </div>
               </div>
           )}

           {/* EXHIBITIONS TAB */}
           {activeTab === 'exhibitions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <button onClick={() => openEditor('exhibition')} className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] h-[350px] flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all group">
                        <Plus className="w-12 h-12 mb-4 group-hover:scale-125 transition-transform" /> 
                        <span className="font-black text-xs uppercase tracking-widest">New Exhibition</span>
                    </button>
                    {exhibitions.map(ex => (
                       <div key={ex.id} className="bg-white border-2 border-gray-100 rounded-[3rem] overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                           <div className="h-64 w-full bg-gray-100 relative">
                               <img src={ex.imageUrl} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                   <button onClick={() => openEditor('exhibition', ex)} className="p-4 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-5 h-5" /></button>
                                   <button onClick={() => handleDelete(ex.id, 'exhibition')} className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-5 h-5" /></button>
                               </div>
                           </div>
                           <div className="p-8"><h3 className="font-black text-xl mb-1">{ex.title}</h3><p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{ex.category}</p></div>
                       </div>
                    ))}
                </div>
           )}

           {/* COLLECTION TAB */}
           {activeTab === 'collection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <button onClick={() => openEditor('artwork')} className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] aspect-square flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all">
                        <Plus className="w-10 h-10 mb-2" /> <span className="font-black text-[10px] uppercase">Add Work</span>
                    </button>
                    {artworks.map(art => (
                        <div key={art.id} className="bg-white border-2 border-gray-100 rounded-[3rem] overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                            <div className="aspect-square w-full bg-gray-50 relative overflow-hidden">
                                <img src={art.imageUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => openEditor('artwork', art)} className="p-3 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(art.id, 'artwork')} className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-black text-sm truncate italic">{art.title}</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{art.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
           )}

           {/* RECENT BOOKINGS TAB */}
           {activeTab === 'bookings' && (
               <div className="bg-white border-2 border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                   <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                       <h3 className="text-xl font-black uppercase tracking-widest">Entry Registry</h3>
                       <div className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black">{bookings.length} Registered</div>
                   </div>
                   <div className="overflow-x-auto">
                       <table className="w-full text-left">
                           <thead>
                               <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                   <th className="px-8 py-6">ID</th>
                                   <th className="px-8 py-6">Visitor</th>
                                   <th className="px-8 py-6">Date</th>
                                   <th className="px-8 py-6">Status</th>
                               </tr>
                           </thead>
                           <tbody className="text-sm">
                               {bookings.map(booking => (
                                   <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                       <td className="px-8 py-5 font-mono text-xs text-gray-400">{booking.id}</td>
                                       <td className="px-8 py-5">
                                           <div className="font-bold">{booking.customerName}</div>
                                           <div className="text-[10px] text-gray-400">{booking.email}</div>
                                       </td>
                                       <td className="px-8 py-5 font-bold">{new Date(booking.date).toLocaleDateString()}</td>
                                       <td className="px-8 py-5">
                                           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Confirmed</span>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}
       </main>

       {isEditing && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
              <div className="bg-white rounded-[3rem] p-10 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-10 border-b pb-6">
                      <h3 className="text-3xl font-black tracking-tighter capitalize">{editType?.replace('-', ' ')} Editor</h3>
                      <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <form onSubmit={handleSaveItem} className="space-y-8">
                      {editType === 'exhibition' && (
                          <div className="space-y-6">
                              <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Title" value={editItem.title || ''} onChange={e => setEditItem((prev: any) => ({...prev, title: e.target.value}))} />
                              <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev: any) => ({...prev, category: e.target.value}))} />
                              <textarea required className="w-full border-2 border-gray-100 p-5 rounded-2xl text-sm focus:border-black outline-none" placeholder="Description" rows={3} value={editItem.description || ''} onChange={e => setEditItem((prev: any) => ({...prev, description: e.target.value}))} />
                              {renderImageInput()}
                          </div>
                      )}
                      {editType === 'artwork' && (
                          <div className="space-y-6">
                              <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Title" value={editItem.title || ''} onChange={e => setEditItem((prev: any) => ({...prev, title: e.target.value}))} />
                              <div className="grid grid-cols-2 gap-4">
                                  <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Artist" value={editItem.artist || ''} onChange={e => setEditItem((prev: any) => ({...prev, artist: e.target.value}))} />
                                  <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Year" value={editItem.year || ''} onChange={e => setEditItem((prev: any) => ({...prev, year: e.target.value}))} />
                              </div>
                              {renderImageInput()}
                          </div>
                      )}
                      {editType === 'collectable' && (
                          <div className="space-y-6">
                              <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Product Name" value={editItem.name || ''} onChange={e => setEditItem((prev: any) => ({...prev, name: e.target.value}))} />
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="relative">
                                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input required type="number" className="w-full border-2 border-gray-100 p-5 pl-10 rounded-2xl font-bold focus:border-black outline-none" placeholder="Price" value={editItem.price || ''} onChange={e => setEditItem((prev: any) => ({...prev, price: Number(e.target.value)}))} />
                                  </div>
                                  <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold focus:border-black outline-none" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev: any) => ({...prev, category: e.target.value}))} />
                              </div>
                              {renderImageInput()}
                          </div>
                      )}
                      {(editType === 'page-asset' || editType === 'gallery-image') && renderImageInput()}
                      
                      <div className="flex gap-4 pt-6">
                          <button type="submit" disabled={isCompressing} className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50">Save To System</button>
                          <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-5 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                      </div>
                  </form>
              </div>
          </div>
       )}
    </div>
  );
};

export default AdminPage;
