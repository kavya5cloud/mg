
import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Search, RefreshCw, LogOut, TrendingUp, Users, Calendar, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Package, Filter, Upload, Mail, BarChart3, PieChart, Home, RotateCcw, Layout, UserPlus, Eye, EyeOff, Tag, IndianRupee, Trash2, Database, AlertTriangle, Link as LinkIcon, Info, ExternalLink, Zap } from 'lucide-react';
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
  const [driveMode, setDriveMode] = useState<'thumbnail' | 'direct'>('thumbnail');

  useEffect(() => {
    if (isAuthenticated) {
        loadData();
        setStorageMB(getStorageUsage());
        
        // Handle deep links
        const tabParam = searchParams.get('tab') as Tab;
        const editExhibitionId = searchParams.get('editExhibition');
        
        if (tabParam) setActiveTab(tabParam);
        if (editExhibitionId) {
            const allExhibitions = getExhibitions();
            const ex = allExhibitions.find(e => e.id === editExhibitionId);
            if (ex) {
                setActiveTab('exhibitions');
                openEditor('exhibition', ex);
            }
        }
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

  // Edit/Add State
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
      if (!window.confirm('Are you sure you want to delete this?')) return;
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
      setDriveMode('thumbnail');
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

  const handleImageUpload = (file: File) => {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
          alert("This image is too large (>2MB). Please resize it before uploading to avoid browser storage limits.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          setEditItem((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
          setPreviewError(false);
      };
      reader.readAsDataURL(file);
  };

  /**
   * Helper to convert Google Drive Sharing links to Direct Image URLs
   * Handles more cases and specific share_link formats.
   */
  const transformImageUrl = (url: string, mode: 'thumbnail' | 'direct' = 'thumbnail') => {
    if (!url) return '';
    const cleanUrl = url.trim();
    
    // Extract ID from any Google Drive URL format
    const driveMatch = cleanUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=|uc\?export=view&id=)|https?:\/\/[\w\d.-]+\.google\.com\/.*?id=)([a-zA-Z0-9_-]{28,})/);
    
    if (driveMatch && driveMatch[1]) {
        const id = driveMatch[1];
        // thumbnail?id is the most reliable way to display Drive images in browsers
        if (mode === 'thumbnail') {
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
        } else {
            return `https://drive.google.com/uc?id=${id}`;
        }
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

    const handleSwitchMode = () => {
        const newMode = driveMode === 'thumbnail' ? 'direct' : 'thumbnail';
        setDriveMode(newMode);
        const transformed = transformImageUrl(editItem.imageUrl, newMode);
        setEditItem((prev: any) => ({...prev, imageUrl: transformed}));
        setPreviewError(false);
        setIsPreviewLoading(true);
    };

    return (
      <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Image Asset</label>
                <div className="group relative">
                    <Info className="w-3 h-3 text-gray-300 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-56 bg-black text-white text-[10px] p-3 rounded-xl leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                        <p className="font-black mb-1 text-blue-400">Fixing [?] Icons:</p>
                        Set Google Drive sharing to "Anyone with the link". If it still fails, use the "Fallback Engine" button in the preview.
                    </div>
                </div>
            </div>
            {editItem.imageUrl && (
              <button 
                type="button" 
                onClick={() => { setEditItem((prev: any) => ({ ...prev, imageUrl: '' })); setPreviewError(false); }}
                className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          
          <div 
              className={`border-2 border-dashed rounded-xl p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative overflow-hidden bg-gray-50/50 h-56 ${previewError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-black'}`}
              onClick={() => !editItem.imageUrl && document.getElementById('hidden-file-input')?.click()}
          >
              <input type="file" id="hidden-file-input" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
              }} />
              
              {editItem.imageUrl ? (
                  <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
                      {isPreviewLoading && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/50">
                              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                          </div>
                      )}
                      {previewError ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-red-50">
                              <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                              <p className="text-xs font-bold text-red-700 leading-tight italic">Google Access Denied</p>
                              <p className="text-[10px] text-red-500 mt-2 max-w-[220px]">
                                {isDriveUrl 
                                    ? "This file is Restricted. You must set sharing to 'Anyone with the link' inside Google Drive." 
                                    : "This image link is broken or expired."}
                              </p>
                              <div className="flex flex-col gap-2 mt-4 w-full px-6">
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSwitchMode(); }}
                                  className="w-full bg-black text-white px-3 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-3 h-3 text-yellow-400" /> Use Fallback Engine
                                </button>
                                {isDriveUrl && (
                                    <a 
                                      href={editItem.imageUrl.replace('/thumbnail?id=', '/file/d/').replace('/uc?id=', '/file/d/').split('&')[0]} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="w-full bg-white border border-gray-200 text-black px-3 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                        Open Drive & Fix Sharing <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                              </div>
                          </div>
                      ) : (
                        <>
                          <img 
                            src={editItem.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                            onError={() => { setPreviewError(true); setIsPreviewLoading(false); }}
                            onLoad={() => { setPreviewError(false); setIsPreviewLoading(false); }}
                          />
                          <div 
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200"
                            onClick={(e) => { e.stopPropagation(); document.getElementById('hidden-file-input')?.click(); }}
                          >
                              <Upload className="w-8 h-8 mb-2" />
                              <span className="font-bold text-sm">Replace Photo</span>
                          </div>
                        </>
                      )}
                  </div>
              ) : (
                  <div className="py-4">
                      <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Upload from Device</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest leading-none">Max: 2MB</p>
                  </div>
              )}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <LinkIcon className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Paste Google Drive 'Share' link here..." 
              className={`w-full border border-gray-200 pl-11 pr-16 py-4 rounded-xl bg-white text-sm focus:border-black outline-none transition-all ${isDriveUrl ? 'border-blue-200 bg-blue-50/10' : ''}`}
              value={isDataUrl ? 'Local File (Encrypted)' : (editItem.imageUrl || '')} 
              onChange={e => {
                  const transformed = transformImageUrl(e.target.value, driveMode);
                  setEditItem((prev: any) => ({...prev, imageUrl: transformed}));
                  setPreviewError(false);
                  setIsPreviewLoading(true);
              }} 
              readOnly={!!isDataUrl} 
            />
            {isDataUrl && <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-0.5 rounded text-[8px] font-bold">LOCAL</div>}
            {isDriveUrl && <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold">DRIVE</div>}
          </div>
          
          {isDriveUrl && !previewError && !isPreviewLoading && (
              <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest px-2 italic flex items-center gap-1">
                 <Check className="w-3 h-3" /> Connection Established ({driveMode === 'thumbnail' ? 'Optimized' : 'Raw'})
              </p>
          )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl">
             <div className="text-center mb-8"><h1 className="text-2xl font-black mb-2">MOCA Staff</h1></div>
             <form onSubmit={handleLogin} className="space-y-4">
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-3 outline-none focus:border-black" placeholder="Password" />
                 <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">Login</button>
             </form>
         </div>
      </div>
    );
  }

  const usagePercent = Math.min(100, (Number(storageMB) / 5) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-6">
               <div className="font-black tracking-tight text-xl">MOCA <span className="font-normal text-gray-400">ADMIN</span></div>
               <div className="h-6 w-px bg-white/20"></div>
               <button 
                onClick={toggleStaffMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isStaffModeEnabled ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
               >
                 {isStaffModeEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                 Staff Mode {isStaffModeEnabled ? 'ON' : 'OFF'}
               </button>
           </div>
           
           <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end mr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Database className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-bold uppercase text-gray-400">Usage: {storageMB} / 5.0MB</span>
                    </div>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${usagePercent > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${usagePercent}%` }} />
                    </div>
               </div>
               <button onClick={handleLogout} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><LogOut className="w-5 h-5" /></button>
           </div>
       </header>

       <main className="flex-grow max-w-[1400px] w-full mx-auto p-6 md:p-10">
           <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
               {['bookings', 'orders', 'shop', 'exhibitions', 'collection', 'homepage', 'pages', 'newsletter', 'settings'].map(t => (
                   <button key={t} onClick={() => setActiveTab(t as Tab)} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === t ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                       {t === 'pages' ? 'Page Content' : t}
                   </button>
               ))}
           </div>

           {activeTab === 'settings' && (
               <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                   <h2 className="text-3xl font-black mb-8">System Settings</h2>
                   <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Database />
                            </h3>
                            <div className="text-sm text-gray-500 mb-6 leading-relaxed bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2 uppercase text-xs tracking-widest"><LinkIcon className="w-4 h-4" /> Best Practice: Direct Linking</h4>
                                <p className="mb-4">Browsers limit museum data to 5MB. For best performance, use Google Drive links for all photos.</p>
                                <ol className="list-decimal pl-5 space-y-2 font-medium">
                                    <li>Upload high-res photo to Google Drive.</li>
                                    <li>Right-click → Share → General Access.</li>
                                    <li>Set to <span className="text-blue-700 font-bold underline">"Anyone with the link"</span>.</li>
                                    <li>Paste the link in the museum editor.</li>
                                </ol>
                            </div>
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase text-gray-400">Total Browser Storage Load</span>
                                    <span className="text-xs font-bold">{storageMB} MB / 5.0MB</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all ${usagePercent > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${usagePercent}%` }} />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => { if(window.confirm('WARNING: This will delete ALL custom content and reset MOCA to its factory state. Proceed?')) clearAllAppData(); }}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                                >
                                    <RotateCcw className="w-4 h-4" /> Hard Reset App
                                </button>
                                <button 
                                    onClick={() => loadData()}
                                    className="flex-1 border-2 border-black text-black py-3 rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-gray-50"
                                >
                                    <RefreshCw className="w-4 h-4" /> Sync Stats
                                </button>
                            </div>
                        </div>
                   </div>
               </div>
           )}

           {activeTab === 'shop' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black">Manage MOCA Shop</h2>
                        <button onClick={() => openEditor('collectable')} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm uppercase">
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {collectables.map(item => (
                            <div key={item.id} className="bg-white border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 w-full bg-gray-50 relative overflow-hidden">
                                    <img src={item.imageUrl} className="w-full h-full object-cover mix-blend-multiply" />
                                    {!item.inStock && <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 text-[8px] font-black uppercase rounded">Out of Stock</div>}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={() => openEditor('collectable', item)} className="p-2 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(item.id, 'collectable')} className="p-2 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-sm truncate pr-2">{item.name}</h3>
                                        <span className="text-sm font-black">₹{item.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
           )}

           {activeTab === 'collection' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black">Archive Collection</h2>
                        <button onClick={() => openEditor('artwork')} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm uppercase">
                            <Plus className="w-4 h-4" /> Add Artwork
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {artworks.map(art => (
                            <div key={art.id} className="bg-white border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                                    <img src={art.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={() => openEditor('artwork', art)} className="p-2 bg-white rounded-full hover:scale-110 transition-transform"><Pen className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(art.id, 'artwork')} className="p-2 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"><Trash className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm truncate italic">{art.title}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{art.artist} ({art.year})</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
           )}

           {activeTab === 'pages' && pageAssets && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-2xl font-black mb-6 border-b pb-4">Page Content Editor</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Main Title</label>
                                    <input className="w-full border p-3 rounded-lg font-bold" value={pageAssets.about.title} onChange={e => {
                                        const updated = {...pageAssets}; updated.about.title = e.target.value; setPageAssets(updated); savePageAssets(updated);
                                    }} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Intro Heading</label>
                                    <input className="w-full border p-3 rounded-lg font-bold" value={pageAssets.about.introTitle} onChange={e => {
                                        const updated = {...pageAssets}; updated.about.introTitle = e.target.value; setPageAssets(updated); savePageAssets(updated);
                                    }} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Description Paragraph</label>
                                    <textarea className="w-full border p-3 rounded-lg text-sm" rows={4} value={pageAssets.about.introPara1} onChange={e => {
                                        const updated = {...pageAssets}; updated.about.introPara1 = e.target.value; setPageAssets(updated); savePageAssets(updated);
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <h4 className="font-bold text-xs uppercase mb-3 text-gray-400">Hero Section Image</h4>
                                    <img src={pageAssets.about.hero} className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm" />
                                    <button onClick={() => openEditor('page-asset', { imageUrl: pageAssets.about.hero }, 'about.hero')} className="w-full bg-black text-white py-2 rounded font-bold text-xs uppercase">Edit Hero Photo</button>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <h4 className="font-bold text-xs uppercase mb-3 text-gray-400">Main Atrium Photo</h4>
                                    <img src={pageAssets.about.atrium} className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" />
                                    <button onClick={() => openEditor('page-asset', { imageUrl: pageAssets.about.atrium }, 'about.atrium')} className="w-full bg-black text-white py-2 rounded font-bold text-xs uppercase">Edit Atrium Photo</button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 border-t pt-10">
                            <div className="flex justify-between items-center mb-8">
                                <div><h3 className="text-xl font-bold">Museum Leadership</h3><p className="text-sm text-gray-400">Manage names, roles, and staff photos.</p></div>
                                <button onClick={() => openEditor('team-member')} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" /> Add Team Member
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {pageAssets.about.team.map((member) => (
                                    <div key={member.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center group relative">
                                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md relative">
                                            <img src={member.imageUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditor('team-member', member)} className="p-2 bg-white/20 rounded-full hover:bg-white/40"><Pen className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(member.id, 'team-member')} className="p-2 bg-red-500/80 rounded-full hover:bg-red-500"><Trash className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-center text-sm">{member.name}</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 text-center mt-1">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </div>
               </div>
           )}

           {activeTab === 'exhibitions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => openEditor('exhibition')} className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all">
                        <Plus className="w-8 h-8 mb-2" /> <span className="font-bold text-xs uppercase">New Exhibition</span>
                    </button>
                    {exhibitions.map(ex => (
                       <div key={ex.id} className="bg-white border rounded-xl overflow-hidden flex flex-col group">
                           <div className="h-40 w-full bg-gray-100 relative">
                               <img src={ex.imageUrl} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                   <button onClick={() => openEditor('exhibition', ex)} className="p-2 bg-white rounded-full"><Pen className="w-4 h-4" /></button>
                                   <button onClick={() => handleDelete(ex.id, 'exhibition')} className="p-2 bg-white text-red-600 rounded-full"><Trash className="w-4 h-4" /></button>
                               </div>
                           </div>
                           <div className="p-4"><h3 className="font-bold">{ex.title}</h3><p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{ex.category}</p></div>
                       </div>
                    ))}
                </div>
           )}

           {activeTab === 'homepage' && (
               <div className="space-y-8">
                   {homepageGallery.map((track, trackIdx) => (
                       <div key={trackIdx} className="bg-white p-6 rounded-2xl border">
                           <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold">Scrolling Track {trackIdx + 1}</h3><button onClick={() => openEditor('gallery-image', null, trackIdx)} className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Add Photo</button></div>
                           <div className="flex gap-4 overflow-x-auto pb-4">
                               {track.images.map((img: string, i: number) => (
                                   <div key={i} className="w-32 h-32 shrink-0 relative rounded-lg overflow-hidden group border">
                                       <img src={img} className="w-full h-full object-cover" />
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button onClick={() => openEditor('gallery-image', { imageUrl: img, oldUrl: img }, trackIdx)} className="p-1.5 bg-white rounded-full"><Pen className="w-3 h-3" /></button>
                                            <button onClick={() => handleDelete(img, 'gallery-image')} className="p-1.5 bg-white text-red-600 rounded-full"><Trash className="w-3 h-3" /></button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   ))}
               </div>
           )}
       </main>

       {isEditing && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
                  <h3 className="text-2xl font-black mb-6 border-b pb-4 capitalize">Edit {editType?.replace('-', ' ')}</h3>
                  <form onSubmit={handleSaveItem} className="space-y-6">
                      {editType === 'exhibition' && (
                          <div className="space-y-4">
                              <input required className="w-full border p-3 rounded-lg" placeholder="Title" value={editItem.title || ''} onChange={e => setEditItem((prev: any) => ({...prev, title: e.target.value}))} />
                              <input required className="w-full border p-3 rounded-lg" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev: any) => ({...prev, category: e.target.value}))} />
                              <textarea required className="w-full border p-3 rounded-lg" placeholder="Description" value={editItem.description || ''} onChange={e => setEditItem((prev: any) => ({...prev, description: e.target.value}))} />
                              {renderImageInput()}
                          </div>
                      )}
                      {editType === 'collectable' && (
                          <div className="space-y-4">
                              <input required className="w-full border p-3 rounded-lg" placeholder="Product Name" value={editItem.name || ''} onChange={e => setEditItem((prev: any) => ({...prev, name: e.target.value}))} />
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="relative">
                                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input required type="number" className="w-full border p-3 pl-10 rounded-lg" placeholder="Price" value={editItem.price || ''} onChange={e => setEditItem((prev: any) => ({...prev, price: Number(e.target.value)}))} />
                                  </div>
                                  <input required className="w-full border p-3 rounded-lg" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem((prev: any) => ({...prev, category: e.target.value}))} />
                              </div>
                              <textarea required className="w-full border p-3 rounded-lg" placeholder="Description" value={editItem.description || ''} onChange={e => setEditItem((prev: any) => ({...prev, description: e.target.value}))} />
                              <div className="flex items-center gap-2">
                                  <input type="checkbox" id="inStock" checked={editItem.inStock} onChange={e => setEditItem((prev: any) => ({...prev, inStock: e.target.checked}))} />
                                  <label htmlFor="inStock" className="text-sm font-bold">In Stock</label>
                              </div>
                              {renderImageInput()}
                          </div>
                      )}
                      {editType === 'artwork' && (
                          <div className="space-y-4">
                              <input required className="w-full border p-3 rounded-lg" placeholder="Artwork Title" value={editItem.title || ''} onChange={e => setEditItem((prev: any) => ({...prev, title: e.target.value}))} />
                              <div className="grid grid-cols-2 gap-4">
                                  <input required className="w-full border p-3 rounded-lg" placeholder="Artist" value={editItem.artist || ''} onChange={e => setEditItem((prev: any) => ({...prev, artist: e.target.value}))} />
                                  <input required className="w-full border p-3 rounded-lg" placeholder="Year" value={editItem.year || ''} onChange={e => setEditItem((prev: any) => ({...prev, year: e.target.value}))} />
                              </div>
                              <input required className="w-full border p-3 rounded-lg" placeholder="Medium" value={editItem.medium || ''} onChange={e => setEditItem((prev: any) => ({...prev, medium: e.target.value}))} />
                              {renderImageInput()}
                          </div>
                      )}
                      {editType === 'team-member' && (
                          <div className="space-y-4">
                              <input required className="w-full border p-3 rounded-lg" placeholder="Full Name" value={editItem.name || ''} onChange={e => setEditItem((prev: any) => ({...prev, name: e.target.value}))} />
                              <input required className="w-full border p-3 rounded-lg" placeholder="Role / Designation" value={editItem.role || ''} onChange={e => setEditItem((prev: any) => ({...prev, role: e.target.value}))} />
                              {renderImageInput()}
                          </div>
                      )}
                      {(editType === 'page-asset' || editType === 'gallery-image') && renderImageInput()}
                      <div className="flex gap-4 pt-4">
                          <button type="submit" className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">Save Changes</button>
                          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-gray-200 rounded-lg font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                      </div>
                  </form>
              </div>
          </div>
       )}
    </div>
  );
};

export default AdminPage;
