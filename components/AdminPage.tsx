
import React, { useState, useEffect } from 'react';
import { Lock, Search, RefreshCw, LogOut, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Package, Filter, Upload, Mail, Home, RotateCcw, UserPlus, Eye, EyeOff, IndianRupee, Trash2, Database, AlertTriangle, Link as LinkIcon, Info, ExternalLink, Zap, ShieldCheck, Ticket, Users, Tag, Box, HardDrive, Calendar, MapPin, Car, Accessibility, MessageSquare, Save } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
    getExhibitions, saveExhibitions, 
    getArtworks, saveArtworks, 
    getEvents, saveEvents,
    getCollectables, saveCollectables, 
    getShopOrders, updateShopOrders, 
    getNewsletterEmails, 
    getBookings, 
    getHomepageGallery, saveHomepageGallery, 
    getPageAssets, savePageAssets,
    getStaffMode, setStaffMode,
    getStorageUsage, clearAllAppData 
} from '../services/data';
import { Exhibition, Artwork, Collectable, ShopOrder, Booking, PageAssets, TeamMember, Event } from '../types';

type Tab = 'bookings' | 'shop' | 'exhibitions' | 'whatson' | 'collection' | 'visit' | 'homepage' | 'content' | 'newsletter' | 'settings';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [homepageGallery, setHomepageGallery] = useState<any[]>([]);
  const [pageAssets, setPageAssets] = useState<PageAssets | null>(null);
  
  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'exhibition' | 'artwork' | 'event' | 'collectable' | 'gallery-image' | 'page-asset' | 'team-member' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [activeTrackIdx, setActiveTrackIdx] = useState<number | null>(null);
  const [activeAssetKey, setActiveAssetKey] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (isAuthenticated) {
        loadData();
        const tabParam = searchParams.get('tab') as Tab;
        if (tabParam) setActiveTab(tabParam);
    }
  }, [isAuthenticated, searchParams]);

  const loadData = () => {
      setBookings(getBookings());
      setShopOrders(getShopOrders());
      setExhibitions(getExhibitions());
      setArtworks(getArtworks());
      setEvents(getEvents());
      setCollectables(getCollectables());
      setNewsletterEmails(getNewsletterEmails());
      setHomepageGallery(getHomepageGallery());
      setPageAssets(getPageAssets());
      setStorageMB(getStorageUsage());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') setIsAuthenticated(true);
    else alert('Incorrect password. Try "admin"');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const toggleStaffMode = () => {
      const newState = !isStaffModeEnabled;
      setIsStaffModeEnabled(newState);
      setStaffMode(newState);
  };

  const handleDelete = async (id: string, type: string) => {
      if (!window.confirm('Are you sure you want to delete this permanent record?')) return;
      
      setSaveStatus('saving');
      try {
        if (type === 'exhibition') {
            const newData = exhibitions.filter(e => e.id !== id);
            await saveExhibitions(newData);
            setExhibitions(newData);
        } else if (type === 'artwork') {
            const newData = artworks.filter(a => a.id !== id);
            await saveArtworks(newData);
            setArtworks(newData);
        } else if (type === 'event') {
            const newData = events.filter(ev => ev.id !== id);
            await saveEvents(newData);
            setEvents(newData);
        } else if (type === 'collectable') {
            const newData = collectables.filter(c => c.id !== id);
            await saveCollectables(newData);
            setCollectables(newData);
        } else if (type === 'gallery-image' && activeTrackIdx !== null) {
            const updatedGallery = [...homepageGallery];
            updatedGallery[activeTrackIdx].images = updatedGallery[activeTrackIdx].images.filter((img: string) => img !== id);
            await saveHomepageGallery(updatedGallery);
            setHomepageGallery(updatedGallery);
        } else if (type === 'team-member' && pageAssets) {
            const updatedAssets = { ...pageAssets };
            updatedAssets.about.team = updatedAssets.about.team.filter(m => m.id !== id);
            await savePageAssets(updatedAssets);
            setPageAssets(updatedAssets);
        }
        setSaveStatus('saved');
      } catch (e) {
        alert("Persistence Error: Could not save deletion.");
        setSaveStatus('idle');
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
      setStorageMB(getStorageUsage());
  };

  const openEditor = (type: any, item?: any, meta?: any) => {
      setEditType(type);
      setEditItem(item ? { ...item } : { inStock: true, price: 0 }); 
      setPreviewError(false);
      setIsEditing(true);
      if (type === 'gallery-image') setActiveTrackIdx(meta);
      if (type === 'page-asset' || type === 'team-member') setActiveAssetKey(meta);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveStatus('saving');
      
      try {
        if (editType === 'gallery-image' && activeTrackIdx !== null) {
            const updatedGallery = [...homepageGallery];
            if (editItem.oldUrl) {
                updatedGallery[activeTrackIdx].images = updatedGallery[activeTrackIdx].images.map((img: string) => img === editItem.oldUrl ? editItem.imageUrl : img);
            } else {
                updatedGallery[activeTrackIdx].images = [...updatedGallery[activeTrackIdx].images, editItem.imageUrl];
            }
            await saveHomepageGallery(updatedGallery);
        } else if (editType === 'team-member' && pageAssets) {
            const updatedAssets = { ...pageAssets };
            const id = editItem.id || Date.now().toString();
            const teamMemberData = { 
                id, 
                name: editItem.name || 'Anonymous Staff', 
                role: editItem.role || 'Contributor', 
                imageUrl: editItem.imageUrl || 'https://picsum.photos/400/400' 
            };
            if (editItem.id) {
                updatedAssets.about.team = updatedAssets.about.team.map(m => m.id === id ? teamMemberData : m);
            } else {
                updatedAssets.about.team = [...updatedAssets.about.team, teamMemberData];
            }
            await savePageAssets(updatedAssets);
        } else if (editType === 'page-asset' && activeAssetKey && pageAssets) {
            const [page, key] = activeAssetKey.split('.');
            const updatedAssets = { ...pageAssets };
            (updatedAssets as any)[page][key] = editItem.imageUrl || editItem.text;
            await savePageAssets(updatedAssets);
        } else {
            const id = editItem.id || Date.now().toString();
            const newItem = { ...editItem, id };
            if (editType === 'exhibition') {
                const updated = editItem.id ? exhibitions.map(ex => ex.id === id ? newItem : ex) : [...exhibitions, newItem];
                await saveExhibitions(updated);
            } else if (editType === 'artwork') {
                const updated = editItem.id ? artworks.map(art => art.id === id ? newItem : art) : [...artworks, newItem];
                await saveArtworks(updated);
            } else if (editType === 'event') {
                const updated = editItem.id ? events.map(ev => ev.id === id ? newItem : ev) : [...events, newItem];
                await saveEvents(updated);
            } else if (editType === 'collectable') {
                const updated = editItem.id ? collectables.map(c => c.id === id ? newItem : c) : [...collectables, newItem];
                await saveCollectables(updated);
            }
        }
        setSaveStatus('saved');
      } catch (e) {
        alert("Storage error: Refresh and try again.");
        setSaveStatus('idle');
      }

      setTimeout(() => setSaveStatus('idle'), 2000);
      setIsEditing(false);
      loadData();
  };

  const persistPageAssets = async () => {
    if (!pageAssets) return;
    setSaveStatus('saving');
    try {
        await savePageAssets(pageAssets);
        setSaveStatus('saved');
    } catch (e) {
        alert("Failed to sync database.");
        setSaveStatus('idle');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

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
              const MAX_WIDTH = 1200;
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.75);
              setEditItem((prev: any) => ({ ...prev, imageUrl: compressed }));
              setPreviewError(false);
              setIsCompressing(false);
          };
          img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
  };

  const transformDriveUrl = (url: string) => {
      if (!url) return '';
      const driveMatch = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{28,})/);
      if (driveMatch) return `https://drive.google.com/uc?id=${driveMatch[1]}`;
      return url;
  };

  const renderImageInput = () => {
      const isDataUrl = editItem.imageUrl?.startsWith('data:');
      return (
          <div className="space-y-4">
              <div 
                  className={`border-4 border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center min-h-[250px] transition-all bg-gray-50/50 relative overflow-hidden ${previewError ? 'border-red-300' : 'hover:border-black border-gray-200'}`}
                  onClick={() => document.getElementById('file-up')?.click()}
              >
                  <input type="file" id="file-up" className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files![0])} />
                  {isCompressing && <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center"><RefreshCw className="animate-spin mb-2" /> <span className="text-[10px] font-black uppercase">Optimizing...</span></div>}
                  {editItem.imageUrl ? (
                      <img src={editItem.imageUrl} className="w-full h-full object-cover absolute inset-0" onError={() => setPreviewError(true)} onLoad={() => setPreviewError(false)} />
                  ) : (
                      <div className="flex flex-col items-center"><Upload className="w-10 h-10 mb-4" /><span className="font-black text-xs uppercase tracking-widest">Click to Direct Upload</span></div>
                  )}
              </div>
              <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    className="w-full border-2 border-gray-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-black"
                    placeholder="Or paste Google Drive link..."
                    value={isDataUrl ? 'Direct Upload Active' : (editItem.imageUrl || '')}
                    onChange={e => setEditItem((prev:any)=>({...prev, imageUrl: transformDriveUrl(e.target.value)}))}
                    readOnly={isDataUrl}
                  />
                  {isDataUrl && <button onClick={() => setEditItem((prev:any)=>({...prev, imageUrl: ''}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xs uppercase">Clear</button>}
              </div>
          </div>
      );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-10 rounded-[3rem] shadow-2xl text-center">
             <h1 className="text-4xl font-black mb-8 tracking-tighter italic">MOCA STAFF</h1>
             <form onSubmit={handleLogin} className="space-y-4">
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-black text-center font-bold" placeholder="Access Code" />
                 <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-gray-800 transition-colors uppercase tracking-widest">Enter Dashboard</button>
             </form>
         </div>
      </div>
    );
  }

  const usagePercent = Math.min(100, (Number(storageMB) / 500) * 100);

  const primaryTabs: Tab[] = ['bookings', 'shop', 'exhibitions', 'whatson', 'collection', 'visit'];
  const secondaryTabs: Tab[] = ['homepage', 'content', 'newsletter', 'settings'];

  const renderTabButton = (t: Tab) => {
    const label = t === 'whatson' ? "What's On" : t;
    const isActive = activeTab === t;
    return (
        <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            className={`px-4 py-8 text-sm font-black uppercase tracking-widest border-b-4 transition-all duration-300 relative group ${isActive ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-black'}`}
        >
            {label}
        </button>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       <header className="bg-black text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-8">
               <div className="font-black tracking-tighter text-3xl">MOCA <span className="text-gray-500">SYSTEMS</span></div>
               <button onClick={toggleStaffMode} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isStaffModeEnabled ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/10 text-gray-500'}`}>
                 Editing {isStaffModeEnabled ? 'ACTIVE' : 'LOCKED'}
               </button>
           </div>
           <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-gray-500 uppercase">Local Storage: {storageMB}MB</span>
                    <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500" style={{width: `${usagePercent}%`}} /></div>
                </div>
                <button onClick={handleLogout} className="p-3 bg-white/10 hover:bg-red-500 rounded-2xl transition-all"><LogOut className="w-5 h-5" /></button>
           </div>
       </header>

       <main className="flex-grow max-w-[1600px] w-full mx-auto p-10">
           <div className="border-b border-[#F1F5F9] mb-12">
               <div className="flex flex-wrap gap-x-12">
                   {primaryTabs.map(renderTabButton)}
               </div>
               <div className="flex flex-wrap gap-x-12">
                   {secondaryTabs.map(renderTabButton)}
               </div>
           </div>

           {saveStatus !== 'idle' && (
             <div className={`fixed top-24 right-10 z-[70] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 ${saveStatus === 'saving' ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
                {saveStatus === 'saving' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest">{saveStatus === 'saving' ? 'Writing Changes...' : 'System Synchronized'}</span>
                  <span className="text-[10px] opacity-70">{saveStatus === 'saving' ? 'Committing to persistent storage' : 'All data successfully mirrored'}</span>
                </div>
             </div>
           )}

           {activeTab === 'bookings' && (
               <div className="bg-white border-2 border-gray-100 rounded-[3rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4">
                   <div className="p-10 border-b bg-gray-50 flex justify-between items-center"><h2 className="text-2xl font-black uppercase tracking-widest">Entry Registry</h2><span className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold">{bookings.length} Registered</span></div>
                   <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-[10px] font-black uppercase tracking-widest text-gray-400 border-b"><th className="p-8">Visitor</th><th className="p-8">Date</th><th className="p-8">Status</th></thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50/50">
                                        <td className="p-8"><div className="font-bold">{b.customerName}</div><div className="text-xs text-gray-400">{b.email}</div></td>
                                        <td className="p-8 font-bold">{new Date(b.date).toLocaleDateString()}</td>
                                        <td className="p-8"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Confirmed</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
               </div>
           )}

           {activeTab === 'shop' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in">
                    <button onClick={() => openEditor('collectable')} className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] h-[450px] flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition-all group">
                        <Plus className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" /> <span className="font-black text-xs uppercase tracking-widest">New Product</span>
                    </button>
                    {collectables.map(item => (
                        <div key={item.id} className="bg-white border-2 border-gray-50 rounded-[3rem] overflow-hidden flex flex-col group hover:shadow-2xl transition-all relative">
                            {item.inStock === false && <div className="absolute top-6 left-6 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">Out of Stock</div>}
                            <div className="h-64 relative overflow-hidden bg-gray-50">
                                <img src={item.imageUrl} className={`w-full h-full object-cover mix-blend-multiply p-4 ${item.inStock === false ? 'grayscale' : ''}`} />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                                    <button onClick={() => openEditor('collectable', item)} className="p-4 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-6 h-6" /></button>
                                    <button onClick={() => handleDelete(item.id, 'collectable')} className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-6 h-6" /></button>
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.category}</p>
                                    <p className="font-black text-lg">₹{item.price.toLocaleString()}</p>
                                </div>
                                <h3 className="font-black text-xl tracking-tighter mb-2">{item.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
               </div>
           )}

           {activeTab === 'visit' && pageAssets && (
               <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                       <div className="flex justify-between items-center mb-10 border-b pb-6">
                           <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4"><MapPin className="w-6 h-6" /> Visit Page Content</h3>
                           <button 
                                onClick={persistPageAssets}
                                disabled={saveStatus === 'saving'}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                            >
                               {saveStatus === 'saving' ? <RefreshCw className="w-3 h-3 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                               {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Saved to DB' : 'Save Changes'}
                           </button>
                       </div>
                       <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                               <div>
                                   <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Opening Hours</label>
                                   <input className="w-full border-2 p-4 rounded-2xl font-bold" value={pageAssets.visit.hours} onChange={e => { const u = {...pageAssets}; u.visit.hours = e.target.value; setPageAssets(u); }} />
                               </div>
                               <div>
                                   <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Admission Info</label>
                                   <textarea rows={3} className="w-full border-2 p-4 rounded-2xl text-sm font-bold" value={pageAssets.visit.admissionInfo} onChange={e => { const u = {...pageAssets}; u.visit.admissionInfo = e.target.value; setPageAssets(u); }} />
                               </div>
                               <div>
                                   <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block flex items-center gap-2"><Car className="w-3 h-3"/> Parking Info</label>
                                   <textarea rows={3} className="w-full border-2 p-4 rounded-2xl text-sm font-bold" value={pageAssets.visit.parkingInfo} onChange={e => { const u = {...pageAssets}; u.visit.parkingInfo = e.target.value; setPageAssets(u); }} />
                               </div>
                               <div>
                                   <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Location Address</label>
                                   <textarea rows={2} className="w-full border-2 p-4 rounded-2xl text-sm font-bold" value={pageAssets.visit.locationText} onChange={e => { const u = {...pageAssets}; u.visit.locationText = e.target.value; setPageAssets(u); }} />
                               </div>
                           </div>
                           <div className="space-y-8">
                               <div className="p-6 bg-white rounded-[2rem] border-2 border-gray-100">
                                   <h4 className="text-[10px] font-black uppercase mb-4">Visit Page Hero Photo</h4>
                                   <img src={pageAssets.visit.hero} className="w-full h-48 object-cover rounded-xl mb-4" />
                                   <button onClick={() => openEditor('page-asset', {imageUrl: pageAssets.visit.hero}, 'visit.hero')} className="w-full bg-black text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest">Update Image</button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'homepage' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                   {homepageGallery.map((track, idx) => (
                       <div key={idx} className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                           <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black uppercase tracking-widest">Gallery Track {idx+1}</h3><button onClick={() => openEditor('gallery-image', null, idx)} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase">Add Image</button></div>
                           <div className="flex gap-6 overflow-x-auto pb-6">
                               {track.images.map((img: string) => (
                                   <div key={img} className="w-48 h-48 bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden relative group shrink-0">
                                       <img src={img} className="w-full h-full object-cover" />
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                           <button onClick={() => openEditor('gallery-image', { imageUrl: img, oldUrl: img }, idx)} className="p-2 bg-white rounded-full"><Pen className="w-4 h-4" /></button>
                                           <button onClick={() => handleDelete(img, 'gallery-image')} className="p-2 bg-red-500 text-white rounded-full"><Trash className="w-4 h-4" /></button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   ))}
               </div>
           )}

           {activeTab === 'content' && pageAssets && (
               <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                       <div className="flex justify-between items-center mb-10 border-b pb-6">
                           <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4"><Info className="w-6 h-6" /> About Page Content</h3>
                           <button 
                                onClick={persistPageAssets}
                                disabled={saveStatus === 'saving'}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                            >
                               {saveStatus === 'saving' ? <RefreshCw className="w-3 h-3 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                               {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Saved to DB' : 'Save Changes'}
                           </button>
                       </div>
                       <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                               <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Hero Title</label><input className="w-full border-2 p-4 rounded-2xl font-bold" value={pageAssets.about.introTitle} onChange={e => { const u = {...pageAssets}; u.about.introTitle = e.target.value; setPageAssets(u); }} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Story Para</label><textarea rows={6} className="w-full border-2 p-4 rounded-2xl text-sm" value={pageAssets.about.introPara1} onChange={e => { const u = {...pageAssets}; u.about.introPara1 = e.target.value; setPageAssets(u); }} /></div>
                           </div>
                           <div className="space-y-8">
                                <div className="p-6 bg-white rounded-[2rem] border-2 border-gray-100">
                                   <h4 className="text-[10px] font-black uppercase mb-4">About Hero</h4>
                                   <img src={pageAssets.about.hero} className="w-full h-32 object-cover rounded-xl mb-4" />
                                   <button onClick={() => openEditor('page-asset', {imageUrl: pageAssets.about.hero}, 'about.hero')} className="w-full bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase">Edit Image</button>
                                </div>
                                <div className="p-6 bg-white rounded-[2rem] border-2 border-gray-100">
                                   <h4 className="text-[10px] font-black uppercase mb-4">Main Atrium</h4>
                                   <img src={pageAssets.about.atrium} className="w-full h-32 object-cover rounded-xl mb-4" />
                                   <button onClick={() => openEditor('page-asset', {imageUrl: pageAssets.about.atrium}, 'about.atrium')} className="w-full bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase">Edit Image</button>
                                </div>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'exhibitions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in">
                    <button onClick={() => openEditor('exhibition')} className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] h-[400px] flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition-all group">
                        <Plus className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" /> <span className="font-black text-xs uppercase tracking-widest">New Exhibition</span>
                    </button>
                    {exhibitions.map(ex => (
                        <div key={ex.id} className="bg-white border-2 border-gray-50 rounded-[3rem] overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                            <div className="h-64 relative overflow-hidden"><img src={ex.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4"><button onClick={() => openEditor('exhibition', ex)} className="p-4 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-6 h-6" /></button><button onClick={() => handleDelete(ex.id, 'exhibition')} className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-6 h-6" /></button></div></div>
                            <div className="p-10"><h3 className="font-black text-2xl tracking-tighter mb-1">{ex.title}</h3><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{ex.category}</p></div>
                        </div>
                    ))}
                </div>
           )}

           {activeTab === 'whatson' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in">
                    <button onClick={() => openEditor('event')} className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] h-[400px] flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition-all group">
                        <Plus className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" /> <span className="font-black text-xs uppercase tracking-widest">New Event</span>
                    </button>
                    {events.map(ev => (
                        <div key={ev.id} className="bg-white border-2 border-gray-50 rounded-[3rem] overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                            <div className="h-64 relative overflow-hidden"><img src={ev.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4"><button onClick={() => openEditor('event', ev)} className="p-4 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-6 h-6" /></button><button onClick={() => handleDelete(ev.id, 'event')} className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-6 h-6" /></button></div></div>
                            <div className="p-10">
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-100 text-green-800 rounded mb-2 inline-block">{ev.type}</span>
                                <h3 className="font-black text-xl tracking-tighter mb-1 line-clamp-1">{ev.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold">{ev.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
           )}

           {activeTab === 'settings' && (
               <div className="max-w-3xl space-y-10 animate-in fade-in">
                   <div className="bg-gray-50 p-12 rounded-[3rem] border-2 border-gray-100">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-5 bg-black text-white rounded-[2rem] shadow-xl"><Database className="w-8 h-8" /></div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase">Storage Core</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">IndexedDB Persistence</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 mb-10">
                            <h4 className="font-bold flex items-center gap-2 mb-4"><Info className="w-4 h-4" /> Persistence Note</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Your edits are stored permanently in your browser's IndexedDB. We have removed the mirror-based localStorage to prevent silent corruption when uploading high-resolution imagery (like the Atrium). If you clear your browser cache/site-data, your edits will be lost.</p>
                        </div>

                        <div className="space-y-4">
                            <button onClick={() => { if(confirm('Factory Reset? This will wipe all your custom edits.')) clearAllAppData(); }} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100">Hard Wipe Database</button>
                            <button onClick={() => window.location.reload()} className="w-full border-2 border-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">Reload From Storage</button>
                        </div>
                   </div>
               </div>
           )}
       </main>

       {isEditing && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-10 border-b pb-6"><h3 className="text-3xl font-black tracking-tighter capitalize">{editType} Editor</h3><button onClick={() => setIsEditing(false)}><X className="w-8 h-8" /></button></div>
                    <form onSubmit={handleSaveItem} className="space-y-8">
                        {editType === 'collectable' && (
                            <div className="space-y-6">
                                <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Product Name" value={editItem.name || ''} onChange={e => setEditItem((prev:any)=>({...prev, name: e.target.value}))} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev:any)=>({...prev, category: e.target.value}))} />
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input className="w-full border-2 border-gray-100 p-5 pl-10 rounded-2xl font-bold outline-none focus:border-black" placeholder="Price" type="number" value={editItem.price || ''} onChange={e => setEditItem((prev:any)=>({...prev, price: Number(e.target.value)}))} />
                                    </div>
                                </div>
                                <textarea className="w-full border-2 border-gray-100 p-5 rounded-2xl text-sm outline-none focus:border-black" rows={3} placeholder="Product Description" value={editItem.description || ''} onChange={e => setEditItem((prev:any)=>({...prev, description: e.target.value}))} />
                            </div>
                        )}
                        {['exhibition', 'artwork', 'event'].includes(editType!) && (
                            <div className="space-y-6">
                                <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Title / Name" value={editItem.title || ''} onChange={e => setEditItem((prev:any)=>({...prev, title: e.target.value}))} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Category" value={editItem.type || editItem.category || ''} onChange={e => setEditItem((prev:any)=>({...prev, type: e.target.value, category: e.target.value}))} />
                                    <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Date/Range" value={editItem.date || editItem.dateRange || ''} onChange={e => setEditItem((prev:any)=>({...prev, date: e.target.value, dateRange: e.target.value}))} />
                                </div>
                            </div>
                        )}
                        {renderImageInput()}
                        <div className="flex gap-4 pt-6"><button type="submit" disabled={isCompressing || saveStatus === 'saving'} className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">Save To System</button><button type="button" onClick={() => setIsEditing(false)} className="px-10 py-5 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest">Cancel</button></div>
                    </form>
                </div>
           </div>
       )}
    </div>
  );
};

export default AdminPage;
