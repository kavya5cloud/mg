
import React, { useState, useEffect } from 'react';
import { Lock, Search, RefreshCw, LogOut, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Package, Filter, Upload, Mail, Home, RotateCcw, UserPlus, Eye, EyeOff, IndianRupee, Trash2, Database, AlertTriangle, Link as LinkIcon, Info, ExternalLink, Zap, ShieldCheck, Ticket } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
    getExhibitions, saveExhibitions, 
    getArtworks, saveArtworks, 
    getCollectables, saveCollectables, 
    getShopOrders, updateShopOrders, 
    getNewsletterEmails, 
    getBookings, 
    getHomepageGallery, saveHomepageGallery, resetHomepageGallery,
    getPageAssets, savePageAssets,
    getStaffMode, setStaffMode,
    getStorageUsage, clearAllAppData 
} from '../services/data';
import { Exhibition, Artwork, Collectable, ShopOrder, Booking, PageAssets, TeamMember } from '../types';

type Tab = 'bookings' | 'orders' | 'shop' | 'exhibitions' | 'collection' | 'homepage' | 'content' | 'newsletter' | 'settings';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'exhibition' | 'artwork' | 'collectable' | 'gallery-image' | 'page-asset' | 'team-member' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [activeTrackIdx, setActiveTrackIdx] = useState<number | null>(null);
  const [activeAssetKey, setActiveAssetKey] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

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

  const handleDelete = (id: string, type: string) => {
      if (!window.confirm('Confirm Deletion?')) return;
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

  const openEditor = (type: any, item?: any, meta?: any) => {
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
          if (editItem.oldUrl) {
              updatedGallery[activeTrackIdx].images = updatedGallery[activeTrackIdx].images.map((img: string) => img === editItem.oldUrl ? editItem.imageUrl : img);
          } else {
              updatedGallery[activeTrackIdx].images = [...updatedGallery[activeTrackIdx].images, editItem.imageUrl];
          }
          success = saveHomepageGallery(updatedGallery);
      } else if (editType === 'team-member' && pageAssets) {
          const updatedAssets = { ...pageAssets };
          const id = editItem.id || Date.now().toString();
          if (editItem.id) {
              updatedAssets.about.team = updatedAssets.about.team.map(m => m.id === id ? editItem : m);
          } else {
              updatedAssets.about.team = [...updatedAssets.about.team, { ...editItem, id }];
          }
          success = savePageAssets(updatedAssets);
      } else if (editType === 'page-asset' && activeAssetKey && pageAssets) {
          const [page, key] = activeAssetKey.split('.');
          const updatedAssets = { ...pageAssets };
          (updatedAssets as any)[page][key] = editItem.imageUrl || editItem.text;
          success = savePageAssets(updatedAssets);
      } else {
          const id = editItem.id || Date.now().toString();
          const newItem = { ...editItem, id };
          if (editType === 'exhibition') {
              const updated = editItem.id ? exhibitions.map(ex => ex.id === id ? newItem : ex) : [...exhibitions, newItem];
              success = saveExhibitions(updated);
          } else if (editType === 'artwork') {
              const updated = editItem.id ? artworks.map(art => art.id === id ? newItem : art) : [...artworks, newItem];
              success = saveArtworks(updated);
          } else if (editType === 'collectable') {
              const updated = editItem.id ? collectables.map(c => c.id === id ? newItem : c) : [...collectables, newItem];
              success = saveCollectables(updated);
          }
      }

      if (success) {
        setIsEditing(false);
        loadData();
      }
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

  const usagePercent = Math.min(100, (Number(storageMB) / 5) * 100);

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
                    <span className="text-[9px] font-black text-gray-500 uppercase">Memory: {storageMB}MB</span>
                    <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500" style={{width: `${usagePercent}%`}} /></div>
                </div>
                <button onClick={handleLogout} className="p-3 bg-white/10 hover:bg-red-500 rounded-2xl transition-all"><LogOut className="w-5 h-5" /></button>
           </div>
       </header>

       <main className="flex-grow max-w-[1600px] w-full mx-auto p-10">
           <div className="flex flex-wrap gap-4 mb-12 border-b-2 border-gray-100">
               {['bookings', 'shop', 'exhibitions', 'collection', 'homepage', 'content', 'newsletter', 'settings'].map(t => (
                   <button key={t} onClick={() => setActiveTab(t as Tab)} className={`px-4 py-6 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === t ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-black'}`}>
                       {t}
                   </button>
               ))}
           </div>

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

           {activeTab === 'homepage' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                   {homepageGallery.map((track, idx) => (
                       <div key={idx} className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                           <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black uppercase tracking-widest">Scrolling Track {idx+1}</h3><button onClick={() => openEditor('gallery-image', null, idx)} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase">Add Photo</button></div>
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
               <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                       <h3 className="text-2xl font-black mb-10 border-b pb-6 uppercase tracking-widest">General Content</h3>
                       <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-6">
                               <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Hero Intro Title</label><input className="w-full border-2 p-4 rounded-2xl font-bold" value={pageAssets.about.introTitle} onChange={e => { const u = {...pageAssets}; u.about.introTitle = e.target.value; setPageAssets(u); savePageAssets(u); }} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Description Para</label><textarea rows={6} className="w-full border-2 p-4 rounded-2xl text-sm" value={pageAssets.about.introPara1} onChange={e => { const u = {...pageAssets}; u.about.introPara1 = e.target.value; setPageAssets(u); savePageAssets(u); }} /></div>
                           </div>
                           <div className="space-y-8">
                                <div className="p-6 bg-white rounded-[2rem] border-2 border-gray-100"><h4 className="text-[10px] font-black uppercase mb-4">About Hero Image</h4><img src={pageAssets.about.hero} className="w-full h-32 object-cover rounded-xl mb-4" /><button onClick={() => openEditor('page-asset', {imageUrl: pageAssets.about.hero}, 'about.hero')} className="w-full bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase">Edit Photo</button></div>
                                <div className="p-6 bg-white rounded-[2rem] border-2 border-gray-100"><h4 className="text-[10px] font-black uppercase mb-4">Atrium Gallery Image</h4><img src={pageAssets.about.atrium} className="w-full h-32 object-cover rounded-xl mb-4" /><button onClick={() => openEditor('page-asset', {imageUrl: pageAssets.about.atrium}, 'about.atrium')} className="w-full bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase">Edit Photo</button></div>
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

           {activeTab === 'collection' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in fade-in">
                    <button onClick={() => openEditor('artwork')} className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center text-gray-300 hover:border-black transition-all"><Plus /></button>
                    {artworks.map(art => (
                        <div key={art.id} className="bg-white border-2 border-gray-50 rounded-[2.5rem] overflow-hidden relative group aspect-square shadow-sm">
                            <img src={art.imageUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4"><button onClick={() => openEditor('artwork', art)} className="p-3 bg-white rounded-full"><Pen className="w-4 h-4" /></button><button onClick={() => handleDelete(art.id, 'artwork')} className="p-3 bg-white text-red-600 rounded-full"><Trash className="w-4 h-4" /></button></div>
                        </div>
                    ))}
                </div>
           )}

           {activeTab === 'settings' && (
               <div className="max-w-2xl bg-gray-50 p-12 rounded-[3rem] border-2 border-gray-100 animate-in fade-in">
                   <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase">System Management</h2>
                   <p className="text-gray-500 mb-10 leading-relaxed font-medium">Notice: Your museum data is stored in your local browser. If you clear your history or switch devices, your edits will vanish unless you export them.</p>
                   <div className="space-y-4">
                       <button onClick={() => { if(confirm('Factory Reset?')) clearAllAppData(); }} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100">Reset Museum To Factory State</button>
                       <button onClick={() => loadData()} className="w-full border-2 border-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">Re-Sync System Data</button>
                   </div>
               </div>
           )}
       </main>

       {isEditing && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-10 border-b pb-6"><h3 className="text-3xl font-black tracking-tighter capitalize">{editType} Editor</h3><button onClick={() => setIsEditing(false)}><X className="w-8 h-8" /></button></div>
                    <form onSubmit={handleSaveItem} className="space-y-8">
                        {['exhibition', 'artwork', 'collectable'].includes(editType!) && (
                            <div className="space-y-6">
                                <input required className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Main Title / Name" value={editItem.title || editItem.name || ''} onChange={e => setEditItem((prev:any)=>({...prev, [editItem.title !== undefined ? 'title' : 'name']: e.target.value}))} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev:any)=>({...prev, category: e.target.value}))} />
                                    {editType === 'collectable' && <input className="w-full border-2 border-gray-100 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Price" type="number" value={editItem.price || ''} onChange={e => setEditItem((prev:any)=>({...prev, price: Number(e.target.value)}))} />}
                                </div>
                            </div>
                        )}
                        {renderImageInput()}
                        <div className="flex gap-4 pt-6"><button type="submit" disabled={isCompressing} className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">Save To System</button><button type="button" onClick={() => setIsEditing(false)} className="px-10 py-5 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest">Cancel</button></div>
                    </form>
                </div>
           </div>
       )}
    </div>
  );
};

export default AdminPage;
