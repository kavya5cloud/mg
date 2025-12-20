
import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Mail, Home, RotateCcw, UserPlus, IndianRupee, Database, Info, Zap, Calendar, MapPin, Car, MessageSquare, Save, Target, Globe, Heart, Building2, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
    getExhibitions, saveExhibitions, 
    getArtworks, saveArtworks, 
    getEvents, saveEvents,
    getCollectables, saveCollectables, 
    getShopOrders,
    getNewsletterEmails, 
    getBookings, 
    getHomepageGallery, saveHomepageGallery, 
    getPageAssets, savePageAssets,
    getStaffMode, setStaffMode,
    getStorageUsage, clearAllAppData 
} from '../services/data';
import { Exhibition, Artwork, Collectable, ShopOrder, Booking, PageAssets, TeamMember, Event } from '../types';

type Tab = 'bookings' | 'exhibitions' | 'events' | 'collection' | 'shop' | 'about' | 'visit' | 'homepage' | 'system';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [isStaffMode, setIsStaffMode] = useState(getStaffMode());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Local Data State
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [pageAssets, setPageAssets] = useState<PageAssets | null>(null);
  const [homepageGallery, setHomepageGallery] = useState<any[]>([]);

  // UI Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<string>('');
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
        setExhibitions(getExhibitions());
        setArtworks(getArtworks());
        setEvents(getEvents());
        setCollectables(getCollectables());
        setPageAssets(getPageAssets());
        setHomepageGallery(getHomepageGallery());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') setIsAuthenticated(true);
    else alert('Try "admin"');
  };

  const triggerSavePulse = () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const persistData = async () => {
      if (pageAssets) savePageAssets(pageAssets);
      saveExhibitions(exhibitions);
      saveArtworks(artworks);
      saveEvents(events);
      saveCollectables(collectables);
      saveHomepageGallery(homepageGallery);
      triggerSavePulse();
  };

  const openEditor = (type: string, item: any = {}) => {
      setEditType(type);
      setEditItem(item.id ? { ...item } : { ...item, id: Date.now().toString() });
      setIsEditing(true);
  };

  const handleEditorSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editType === 'exhibition') {
          const exists = exhibitions.find(x => x.id === editItem.id);
          setExhibitions(exists ? exhibitions.map(x => x.id === editItem.id ? editItem : x) : [...exhibitions, editItem]);
      } else if (editType === 'artwork') {
          const exists = artworks.find(x => x.id === editItem.id);
          setArtworks(exists ? artworks.map(x => x.id === editItem.id ? editItem : x) : [...artworks, editItem]);
      } else if (editType === 'event') {
          const exists = events.find(x => x.id === editItem.id);
          setEvents(exists ? events.map(x => x.id === editItem.id ? editItem : x) : [...events, editItem]);
      } else if (editType === 'collectable') {
          const exists = collectables.find(x => x.id === editItem.id);
          setCollectables(exists ? collectables.map(x => x.id === editItem.id ? editItem : x) : [...collectables, editItem]);
      } else if (editType === 'team') {
          if (pageAssets) {
              const team = pageAssets.about.team;
              const exists = team.find(x => x.id === editItem.id);
              const newTeam = exists ? team.map(x => x.id === editItem.id ? editItem : x) : [...team, editItem];
              setPageAssets({ ...pageAssets, about: { ...pageAssets.about, team: newTeam } });
          }
      }
      setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-10 rounded-[3rem] text-center shadow-2xl">
             <h1 className="text-4xl font-black mb-8 italic">MOCA STAFF</h1>
             <form onSubmit={handleLogin} className="space-y-4">
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-center font-bold outline-none focus:border-black" placeholder="Code" />
                 <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-2xl uppercase tracking-widest">Enter</button>
             </form>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
       <header className="bg-black text-white px-8 py-6 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-6">
               <div className="font-black text-2xl tracking-tighter">MOCA <span className="text-gray-500">CMS</span></div>
               <button onClick={persistData} className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-500 hover:text-white transition-all">
                   <Save className="w-3 h-3" /> Commit All Changes
               </button>
           </div>
           <div className="flex items-center gap-4">
               {saveStatus === 'saved' && <div className="text-green-400 text-[10px] font-black uppercase animate-pulse">✓ Saved to Local Mirror</div>}
               <button onClick={() => setIsAuthenticated(false)} className="p-2 bg-white/10 rounded-xl hover:bg-red-500"><LogOut className="w-5 h-5" /></button>
           </div>
       </header>

       <div className="flex-grow flex">
           {/* Sidebar */}
           <nav className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-2">
               {[
                   { id: 'bookings', label: 'Bookings', icon: Calendar },
                   { id: 'exhibitions', label: 'Exhibitions', icon: ImageIcon },
                   { id: 'events', label: 'Events', icon: MessageSquare },
                   { id: 'collection', label: 'Collection', icon: Database },
                   { id: 'shop', label: 'Shop', icon: ShoppingBag },
                   { id: 'about', label: 'About Page', icon: Users },
                   { id: 'visit', label: 'Visit Info', icon: MapPin },
                   { id: 'homepage', label: 'Homepage', icon: Home },
                   { id: 'system', label: 'System', icon: Zap },
               ].map(t => (
                   <button 
                       key={t.id} 
                       onClick={() => setActiveTab(t.id as Tab)}
                       className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-black text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-white hover:text-black'}`}
                   >
                       <t.icon className="w-4 h-4" /> {t.label}
                   </button>
               ))}
           </nav>

           {/* Main Area */}
           <main className="flex-grow p-10 max-w-6xl">
               {activeTab === 'bookings' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4">
                       <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Visitor Registry</h2>
                       <div className="bg-white border rounded-[2rem] overflow-hidden">
                           <table className="w-full text-left">
                               <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
                                   <tr><th className="p-6">Visitor</th><th className="p-6">Date</th><th className="p-6">Tickets</th></tr>
                               </thead>
                               <tbody className="divide-y">
                                   {getBookings().map(b => (
                                       <tr key={b.id}>
                                           <td className="p-6 font-bold">{b.customerName}<br/><span className="text-[10px] text-gray-400">{b.email}</span></td>
                                           <td className="p-6 text-sm">{new Date(b.date).toDateString()}</td>
                                           <td className="p-6 text-xs">{b.tickets.adult}A, {b.tickets.student}S, {b.tickets.child}C</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}

               {activeTab === 'exhibitions' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                       <button onClick={() => openEditor('exhibition', { category: 'New', imageUrl: 'https://picsum.photos/800/600' })} className="border-4 border-dashed border-gray-100 rounded-[2.5rem] h-64 flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition-all">
                           <Plus className="w-12 h-12 mb-2" /> <span className="font-black text-xs uppercase">New Exhibition</span>
                       </button>
                       {exhibitions.map(ex => (
                           <div key={ex.id} className="bg-white border rounded-[2.5rem] overflow-hidden group relative">
                               <img src={ex.imageUrl} className="w-full h-48 object-cover" />
                               <div className="p-6">
                                   <p className="text-[9px] font-black uppercase text-gray-400 mb-1">{ex.category}</p>
                                   <h3 className="font-bold text-xl">{ex.title}</h3>
                               </div>
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                                   <button onClick={() => openEditor('exhibition', ex)} className="p-4 bg-white rounded-full"><Pen className="w-6 h-6" /></button>
                                   <button onClick={() => setExhibitions(exhibitions.filter(x => x.id !== ex.id))} className="p-4 bg-white text-red-500 rounded-full"><Trash className="w-6 h-6" /></button>
                               </div>
                           </div>
                       ))}
                   </div>
               )}

               {activeTab === 'about' && pageAssets && (
                   <div className="space-y-12 animate-in fade-in">
                       <section className="bg-gray-50 p-10 rounded-[3rem]">
                           <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3"><Users className="w-6 h-6"/> About Page Content</h3>
                           <div className="grid gap-6">
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Page Title</label><input className="w-full p-4 border rounded-2xl font-bold" value={pageAssets.about.title} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, title: e.target.value}})} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Intro Headline</label><input className="w-full p-4 border rounded-2xl font-bold" value={pageAssets.about.introTitle} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, introTitle: e.target.value}})} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Story Paragraph 1</label><textarea rows={4} className="w-full p-4 border rounded-2xl text-sm" value={pageAssets.about.introPara1} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, introPara1: e.target.value}})} /></div>
                           </div>
                       </section>

                       <section className="bg-gray-50 p-10 rounded-[3rem]">
                           <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3"><Target className="w-6 h-6"/> Institutional Pillars</h3>
                           <div className="grid md:grid-cols-3 gap-6">
                               <div className="bg-white p-6 rounded-2xl border">
                                   <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Mission Title</label>
                                   <input className="w-full p-2 border rounded-lg font-bold mb-4" value={pageAssets.about.missionTitle} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, missionTitle: e.target.value}})} />
                                   <textarea rows={3} className="w-full p-2 border rounded-lg text-xs" value={pageAssets.about.missionDesc} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, missionDesc: e.target.value}})} />
                               </div>
                               <div className="bg-white p-6 rounded-2xl border">
                                   <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Global Title</label>
                                   <input className="w-full p-2 border rounded-lg font-bold mb-4" value={pageAssets.about.globalTitle} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, globalTitle: e.target.value}})} />
                                   <textarea rows={3} className="w-full p-2 border rounded-lg text-xs" value={pageAssets.about.globalDesc} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, globalDesc: e.target.value}})} />
                               </div>
                               <div className="bg-white p-6 rounded-2xl border">
                                   <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Community Title</label>
                                   <input className="w-full p-2 border rounded-lg font-bold mb-4" value={pageAssets.about.communityTitle} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, communityTitle: e.target.value}})} />
                                   <textarea rows={3} className="w-full p-2 border rounded-lg text-xs" value={pageAssets.about.communityDesc} onChange={e => setPageAssets({...pageAssets, about: {...pageAssets.about, communityDesc: e.target.value}})} />
                               </div>
                           </div>
                       </section>

                       <section className="bg-gray-50 p-10 rounded-[3rem]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black uppercase flex items-center gap-3"><Users className="w-6 h-6"/> Museum Team</h3>
                                <button onClick={() => openEditor('team', { imageUrl: 'https://picsum.photos/400/400' })} className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Add Staff</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {pageAssets.about.team.map(member => (
                                    <div key={member.id} className="bg-white p-4 rounded-2xl border flex flex-col items-center text-center group relative">
                                        <img src={member.imageUrl} className="w-20 h-20 rounded-full object-cover mb-4" />
                                        <h4 className="font-bold text-sm">{member.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{member.role}</p>
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-2">
                                            <button onClick={() => openEditor('team', member)} className="p-2 bg-white rounded-lg"><Pen className="w-4 h-4" /></button>
                                            <button onClick={() => setPageAssets({...pageAssets, about: {...pageAssets.about, team: pageAssets.about.team.filter(x => x.id !== member.id)}})} className="p-2 bg-red-500 text-white rounded-lg"><Trash className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                       </section>
                   </div>
               )}

               {activeTab === 'visit' && pageAssets && (
                   <div className="space-y-10 animate-in fade-in">
                        <section className="bg-gray-50 p-10 rounded-[3rem]">
                           <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3"><MapPin className="w-6 h-6"/> Visit Logistics</h3>
                           <div className="grid gap-6">
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Opening Hours</label><input className="w-full p-4 border rounded-2xl font-bold" value={pageAssets.visit.hours} onChange={e => setPageAssets({...pageAssets, visit: {...pageAssets.visit, hours: e.target.value}})} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Address Text</label><textarea rows={2} className="w-full p-4 border rounded-2xl font-bold" value={pageAssets.visit.locationText} onChange={e => setPageAssets({...pageAssets, visit: {...pageAssets.visit, locationText: e.target.value}})} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Admission Policy</label><textarea rows={3} className="w-full p-4 border rounded-2xl text-sm" value={pageAssets.visit.admissionInfo} onChange={e => setPageAssets({...pageAssets, visit: {...pageAssets.visit, admissionInfo: e.target.value}})} /></div>
                               <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 flex items-center gap-2"><Car className="w-3 h-3"/> Parking Info</label><textarea rows={2} className="w-full p-4 border rounded-2xl text-sm" value={pageAssets.visit.parkingInfo} onChange={e => setPageAssets({...pageAssets, visit: {...pageAssets.visit, parkingInfo: e.target.value}})} /></div>
                           </div>
                       </section>
                   </div>
               )}

               {activeTab === 'homepage' && (
                   <div className="space-y-12 animate-in fade-in">
                       <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Scrolling Gallery</h2>
                       {homepageGallery.map((track, idx) => (
                           <div key={idx} className="bg-gray-50 p-8 rounded-[2.5rem] border">
                               <div className="flex justify-between items-center mb-6">
                                   <h4 className="font-black uppercase text-xs tracking-widest">Track {idx + 1}</h4>
                                   <div className="flex items-center gap-4">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase">Speed: {track.speed}</span>
                                       <button onClick={() => {
                                           const newGal = [...homepageGallery];
                                           newGal[idx].images.push('https://picsum.photos/id/100/800/800');
                                           setHomepageGallery(newGal);
                                       }} className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Add Image</button>
                                   </div>
                               </div>
                               <div className="flex gap-4 overflow-x-auto pb-4">
                                   {track.images.map((img: string, imgIdx: number) => (
                                       <div key={imgIdx} className="w-32 h-32 rounded-xl overflow-hidden shrink-0 group relative">
                                           <img src={img} className="w-full h-full object-cover" />
                                           <button onClick={() => {
                                               const newGal = [...homepageGallery];
                                               newGal[idx].images.splice(imgIdx, 1);
                                               setHomepageGallery(newGal);
                                           }} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Trash className="w-5 h-5" /></button>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
               )}

               {activeTab === 'system' && (
                   <div className="animate-in fade-in max-w-md">
                       <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">System Health</h2>
                       <div className="bg-gray-50 p-8 rounded-[3rem] border space-y-6">
                           <div className="flex items-center gap-4">
                               <div className="p-4 bg-black text-white rounded-2xl"><Zap className="w-6 h-6"/></div>
                               <div>
                                   <p className="text-[10px] font-black uppercase text-gray-400">Memory Usage</p>
                                   <p className="text-xl font-bold">{getStorageUsage()} MB</p>
                               </div>
                           </div>
                           <button onClick={() => { if(confirm('Wipe everything?')) clearAllAppData(); }} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700">Factory Reset Database</button>
                       </div>
                   </div>
               )}
           </main>
       </div>

       {/* Floating Editor Modal */}
       {isEditing && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
               <div className="bg-white max-w-xl w-full rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto">
                   <div className="flex justify-between items-center mb-10">
                       <h3 className="text-3xl font-black tracking-tighter capitalize">{editType} Editor</h3>
                       <button onClick={() => setIsEditing(false)}><X className="w-8 h-8"/></button>
                   </div>
                   <form onSubmit={handleEditorSubmit} className="space-y-6">
                       {['exhibition', 'artwork', 'event', 'collectable'].includes(editType) && (
                           <>
                               <input required className="w-full border-2 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Title/Name" value={editItem.title || editItem.name || ''} onChange={e => setEditItem({...editItem, title: e.target.value, name: e.target.value})} />
                               <div className="grid grid-cols-2 gap-4">
                                   <input className="w-full border-2 p-4 rounded-xl font-bold outline-none focus:border-black" placeholder="Category/Artist" value={editItem.category || editItem.artist || ''} onChange={e => setEditItem({...editItem, category: e.target.value, artist: e.target.value})} />
                                   <input className="w-full border-2 p-4 rounded-xl font-bold outline-none focus:border-black" placeholder="Date/Price" value={editItem.dateRange || editItem.price || ''} onChange={e => setEditItem({...editItem, dateRange: e.target.value, price: Number(e.target.value)})} />
                               </div>
                           </>
                       )}
                       {editType === 'team' && (
                           <>
                               <input required className="w-full border-2 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Full Name" value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} />
                               <input required className="w-full border-2 p-5 rounded-2xl font-bold outline-none focus:border-black" placeholder="Role" value={editItem.role || ''} onChange={e => setEditItem({...editItem, role: e.target.value})} />
                           </>
                       )}
                       <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-400">Image URL</label>
                           <input className="w-full border-2 p-4 rounded-xl text-xs font-mono" value={editItem.imageUrl || ''} onChange={e => setEditItem({...editItem, imageUrl: e.target.value})} />
                           <img src={editItem.imageUrl} className="w-full h-32 object-cover rounded-xl mt-2" />
                       </div>
                       <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800">Apply Changes</button>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

export default AdminPage;
