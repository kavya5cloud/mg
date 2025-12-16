
import React, { useState, useEffect } from 'react';
import { Lock, Search, RefreshCw, LogOut, TrendingUp, Users, Calendar, Pen, Trash, Plus, ShoppingBag, Image as ImageIcon, Check, X, Package, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getExhibitions, saveExhibitions, getArtworks, saveArtworks, getCollectables, saveCollectables, getShopOrders, updateShopOrders } from '../services/data';
import { Exhibition, Artwork, Collectable, ShopOrder } from '../types';

interface Booking {
  id: string;
  customerName: string;
  email: string;
  date: string;
  tickets: { adult: number; student: number; child: number };
  totalAmount: number;
  timestamp: number;
  status: string;
}

type Tab = 'bookings' | 'orders' | 'exhibitions' | 'collection' | 'shop';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  
  // Dashboard Stats
  const [stats, setStats] = useState({ revenue: 0, visitors: 0, bookingCount: 0, salesRevenue: 0, orderCount: 0 });

  // Shop Filters
  const [shopSearch, setShopSearch] = useState('');
  const [shopCategoryFilter, setShopCategoryFilter] = useState('All');

  // Edit/Add State
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'exhibition' | 'artwork' | 'collectable' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
        loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = () => {
      // Bookings
      const storedBookings = localStorage.getItem('moca_bookings');
      let loadedBookings: Booking[] = [];
      if (storedBookings) {
          loadedBookings = JSON.parse(storedBookings);
          setBookings(loadedBookings);
      }

      // Shop Orders
      const loadedOrders = getShopOrders();
      setShopOrders(loadedOrders);

      // Content
      setExhibitions(getExhibitions());
      setArtworks(getArtworks());
      setCollectables(getCollectables());

      // Calc Stats
      const ticketRevenue = loadedBookings.reduce((acc, b) => acc + b.totalAmount, 0);
      const salesRevenue = loadedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
      const visitors = loadedBookings.reduce((acc, b) => acc + b.tickets.adult + b.tickets.student + b.tickets.child, 0);

      setStats({
          revenue: ticketRevenue,
          salesRevenue: salesRevenue,
          visitors,
          bookingCount: loadedBookings.length,
          orderCount: loadedOrders.length
      });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Try "admin"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const toggleOrderStatus = (orderId: string) => {
      const updatedOrders = shopOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: (order.status === 'Pending' ? 'Fulfilled' : 'Pending') as 'Pending' | 'Fulfilled' } 
            : order
      );
      setShopOrders(updatedOrders);
      updateShopOrders(updatedOrders);
  };

  const toggleStock = (itemId: string) => {
      const updatedCollectables = collectables.map(item => 
          item.id === itemId 
          ? { ...item, inStock: item.inStock === false ? true : false } // Toggle boolean, treating undefined as true
          : item
      );
      setCollectables(updatedCollectables);
      saveCollectables(updatedCollectables);
  };

  // --- CRUD Handlers ---

  const handleDelete = (id: string, type: 'exhibition' | 'artwork' | 'collectable') => {
      if (!window.confirm('Are you sure you want to delete this item?')) return;
      
      if (type === 'exhibition') {
          const newData = exhibitions.filter(e => e.id !== id);
          setExhibitions(newData);
          saveExhibitions(newData);
      } else if (type === 'artwork') {
          const newData = artworks.filter(a => a.id !== id);
          setArtworks(newData);
          saveArtworks(newData);
      } else if (type === 'collectable') {
          const newData = collectables.filter(c => c.id !== id);
          setCollectables(newData);
          saveCollectables(newData);
      }
  };

  const openEditor = (type: 'exhibition' | 'artwork' | 'collectable', item?: any) => {
      setEditType(type);
      setEditItem(item || {}); // Empty object for new item
      setIsEditing(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
      e.preventDefault();
      const id = editItem.id || Date.now().toString();
      const newItem = { ...editItem, id };

      if (editType === 'exhibition') {
          const updated = editItem.id 
            ? exhibitions.map(ex => ex.id === id ? newItem : ex)
            : [...exhibitions, newItem];
          setExhibitions(updated);
          saveExhibitions(updated);
      } else if (editType === 'artwork') {
          const updated = editItem.id 
            ? artworks.map(art => art.id === id ? newItem : art)
            : [...artworks, newItem];
          setArtworks(updated);
          saveArtworks(updated);
      } else if (editType === 'collectable') {
          const updated = editItem.id 
            ? collectables.map(c => c.id === id ? newItem : c)
            : [...collectables, newItem];
          setCollectables(updated);
          saveCollectables(updated);
      }

      setIsEditing(false);
      setEditItem(null);
  };

  // --- Filtering ---
  const filteredCollectables = collectables.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(shopSearch.toLowerCase());
      const matchesCategory = shopCategoryFilter === 'All' || item.category === shopCategoryFilter;
      return matchesSearch && matchesCategory;
  });

  // --- Render Editors ---
  const renderEditor = () => {
      if (!isEditing || !editType) return null;

      return (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                      <h3 className="text-2xl font-bold capitalize">{editItem.id ? 'Edit' : 'Add'} {editType}</h3>
                      <button onClick={() => setIsEditing(false)} className="hover:bg-gray-100 p-2 rounded-full"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <form onSubmit={handleSaveItem} className="space-y-4">
                      {editType === 'exhibition' && (
                          <>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Title</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Date Range</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.dateRange || ''} onChange={e => setEditItem({...editItem, dateRange: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Category</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.category || ''} onChange={e => setEditItem({...editItem, category: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Image URL</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.imageUrl || ''} onChange={e => setEditItem({...editItem, imageUrl: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Description</label><textarea required className="w-full border p-2 rounded bg-gray-50" rows={3} value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} /></div>
                          </>
                      )}

                      {editType === 'artwork' && (
                          <>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Title</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Artist</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.artist || ''} onChange={e => setEditItem({...editItem, artist: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Year</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.year || ''} onChange={e => setEditItem({...editItem, year: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Medium</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.medium || ''} onChange={e => setEditItem({...editItem, medium: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Image URL</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.imageUrl || ''} onChange={e => setEditItem({...editItem, imageUrl: e.target.value})} /></div>
                          </>
                      )}

                      {editType === 'collectable' && (
                          <>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Name</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="text-xs font-bold uppercase text-gray-500">Price (INR)</label><input type="number" required className="w-full border p-2 rounded bg-gray-50" value={editItem.price || ''} onChange={e => setEditItem({...editItem, price: parseInt(e.target.value)})} /></div>
                                <div className="flex-1"><label className="text-xs font-bold uppercase text-gray-500">Category</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.category || ''} onChange={e => setEditItem({...editItem, category: e.target.value})} /></div>
                            </div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Image URL</label><input required className="w-full border p-2 rounded bg-gray-50" value={editItem.imageUrl || ''} onChange={e => setEditItem({...editItem, imageUrl: e.target.value})} /></div>
                            <div><label className="text-xs font-bold uppercase text-gray-500">Description</label><textarea required className="w-full border p-2 rounded bg-gray-50" rows={3} value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} /></div>
                            <div className="flex items-center gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    id="inStock"
                                    checked={editItem.inStock !== false} 
                                    onChange={e => setEditItem({...editItem, inStock: e.target.checked})} 
                                    className="w-5 h-5 accent-black"
                                />
                                <label htmlFor="inStock" className="font-bold text-sm">Item is In Stock</label>
                            </div>
                          </>
                      )}

                      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors mt-4">Save Changes</button>
                  </form>
              </div>
          </div>
      );
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-300">
             <div className="text-center mb-8">
                 <h1 className="text-2xl font-black mb-2">MOCA Staff</h1>
                 <p className="text-gray-500 text-sm">Restricted Access Area</p>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                 <div>
                     <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                        placeholder="••••••••"
                     />
                 </div>
                 <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Login
                 </button>
                 <Link to="/" className="block text-center text-xs text-gray-400 hover:text-black mt-4">Return to Website</Link>
             </form>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Admin Header */}
       <header className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
           <div className="flex items-center gap-3">
               <div className="font-black tracking-tight text-xl">MOCA <span className="font-normal text-gray-400">ADMIN</span></div>
           </div>
           <div className="flex items-center gap-4">
               <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">Welcome, Admin</span>
               <button onClick={handleLogout} className="p-2 hover:bg-gray-800 rounded-full transition-colors" title="Logout">
                   <LogOut className="w-5 h-5" />
               </button>
           </div>
       </header>

       <main className="flex-grow max-w-[1400px] w-full mx-auto p-6 md:p-10">
           
           {/* Tab Navigation */}
           <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
               <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'bookings' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Bookings</button>
               <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Shop Orders</button>
               <button onClick={() => setActiveTab('shop')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'shop' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Inventory</button>
               <button onClick={() => setActiveTab('exhibitions')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'exhibitions' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Exhibitions</button>
               <button onClick={() => setActiveTab('collection')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'collection' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Collection</button>
           </div>

           {/* BOOKINGS TAB */}
           {activeTab === 'bookings' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Ticket Revenue</p><h3 className="text-3xl font-black">₹{stats.revenue.toLocaleString()}</h3></div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-700" /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Visitors</p><h3 className="text-3xl font-black">{stats.visitors}</h3></div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-blue-700" /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bookings</p><h3 className="text-3xl font-black">{stats.bookingCount}</h3></div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Calendar className="w-6 h-6 text-purple-700" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between"><h2 className="text-xl font-bold">Recent Ticket Bookings</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                <tr><th className="px-6 py-4">Ref ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Visit Date</th><th className="px-6 py-4">Tickets</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium">{booking.id}</td>
                                        <td className="px-6 py-4"><div className="font-bold">{booking.customerName}</div><div className="text-xs text-gray-500">{booking.email}</div></td>
                                        <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-600">{booking.tickets.adult > 0 && <span>{booking.tickets.adult} Ad </span>}{booking.tickets.student > 0 && <span>{booking.tickets.student} Stu </span>}{booking.tickets.child > 0 && <span>{booking.tickets.child} Ch</span>}</td>
                                        <td className="px-6 py-4 font-bold">₹{booking.totalAmount}</td>
                                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{booking.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
           )}

           {/* SHOP ORDERS TAB */}
           {activeTab === 'orders' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Shop Revenue</p><h3 className="text-3xl font-black">₹{stats.salesRevenue.toLocaleString()}</h3></div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><TrendingUp className="w-6 h-6 text-orange-700" /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Orders</p><h3 className="text-3xl font-black">{stats.orderCount}</h3></div>
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-pink-700" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between"><h2 className="text-xl font-bold">Recent Shop Orders</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                <tr><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Action</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {shopOrders.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet.</td></tr>
                                ) : (
                                    shopOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                                            <td className="px-6 py-4"><div className="font-bold">{order.customerName}</div><div className="text-xs text-gray-500">{order.email}</div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {order.items.map((item, idx) => (
                                                        <span key={idx} className="text-xs text-gray-600">{item.quantity}x {item.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold">₹{order.totalAmount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => toggleOrderStatus(order.id)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${order.status === 'Fulfilled' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                                                >
                                                    {order.status}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
           )}

           {/* EXHIBITIONS TAB */}
           {activeTab === 'exhibitions' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold">Manage Exhibitions</h2>
                       <button onClick={() => openEditor('exhibition')} className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add New</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {exhibitions.map(ex => (
                           <div key={ex.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                               <div className="h-48 w-full bg-gray-100 relative">
                                   <img src={ex.imageUrl} className="w-full h-full object-cover" alt="" />
                                   <div className="absolute top-2 right-2 flex gap-2">
                                       <button onClick={() => openEditor('exhibition', ex)} className="p-2 bg-white rounded-full hover:bg-black hover:text-white transition-colors"><Pen className="w-4 h-4" /></button>
                                       <button onClick={() => handleDelete(ex.id, 'exhibition')} className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition-colors"><Trash className="w-4 h-4" /></button>
                                   </div>
                               </div>
                               <div className="p-6 flex-grow">
                                   <div className="text-xs font-bold uppercase text-blue-600 mb-2">{ex.category}</div>
                                   <h3 className="text-xl font-bold mb-2">{ex.title}</h3>
                                   <p className="text-gray-500 text-sm mb-4">{ex.dateRange}</p>
                                   <p className="text-gray-600 text-sm line-clamp-2">{ex.description}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* COLLECTION TAB */}
           {activeTab === 'collection' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold">Manage Collection</h2>
                       <button onClick={() => openEditor('artwork')} className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add New</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {artworks.map(art => (
                           <div key={art.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
                               <div className="aspect-square bg-gray-100 relative">
                                   <img src={art.imageUrl} className="w-full h-full object-cover" alt="" />
                                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                       <button onClick={() => openEditor('artwork', art)} className="p-3 bg-white rounded-full hover:bg-gray-200"><Pen className="w-5 h-5" /></button>
                                       <button onClick={() => handleDelete(art.id, 'artwork')} className="p-3 bg-white text-red-600 rounded-full hover:bg-gray-200"><Trash className="w-5 h-5" /></button>
                                   </div>
                               </div>
                               <div className="p-4">
                                   <h3 className="font-bold truncate">{art.title}</h3>
                                   <p className="text-sm text-gray-500">{art.artist}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* SHOP ITEMS TAB */}
           {activeTab === 'shop' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                       <div>
                           <h2 className="text-2xl font-bold mb-2">Inventory Management</h2>
                           <p className="text-gray-500 text-sm">Manage products, stock status, and prices.</p>
                       </div>
                       <button onClick={() => openEditor('collectable')} className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Item</button>
                   </div>
                   
                   {/* Search & Filter Bar */}
                   <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                value={shopSearch}
                                onChange={e => setShopSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black transition-colors text-sm"
                            />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select 
                                value={shopCategoryFilter}
                                onChange={e => setShopCategoryFilter(e.target.value)}
                                className="w-full md:w-48 pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black appearance-none text-sm cursor-pointer"
                            >
                                <option value="All">All Categories</option>
                                <option value="Books">Books</option>
                                <option value="Home">Home</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Prints">Prints</option>
                            </select>
                        </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {filteredCollectables.map(item => (
                           <div key={item.id} className={`bg-white border rounded-xl overflow-hidden flex flex-row h-40 transition-all ${item.inStock === false ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-black hover:shadow-md'}`}>
                               <div className="w-40 h-full bg-gray-100 relative shrink-0">
                                   <img src={item.imageUrl} className={`w-full h-full object-cover ${item.inStock === false ? 'grayscale' : ''}`} alt="" />
                                   {item.inStock === false && (
                                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                           <span className="text-white text-xs font-bold uppercase tracking-wider border border-white px-2 py-1">Sold Out</span>
                                       </div>
                                   )}
                               </div>
                               <div className="p-4 flex-grow flex flex-col justify-between">
                                   <div>
                                       <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold uppercase text-orange-600 mb-1">{item.category}</div>
                                            <button 
                                                onClick={() => toggleStock(item.id)}
                                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${item.inStock !== false ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'}`}
                                            >
                                                {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                       </div>
                                       <h3 className="font-bold mb-1 line-clamp-1" title={item.name}>{item.name}</h3>
                                       <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                                   </div>
                                   <div className="flex justify-between items-end mt-2">
                                       <span className="font-black">₹{item.price.toLocaleString()}</span>
                                       <div className="flex gap-2">
                                            <button onClick={() => openEditor('collectable', item)} className="p-1.5 bg-gray-100 rounded hover:bg-black hover:text-white transition-colors"><Pen className="w-3 h-3" /></button>
                                            <button onClick={() => handleDelete(item.id, 'collectable')} className="p-1.5 bg-gray-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"><Trash className="w-3 h-3" /></button>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       ))}
                       {filteredCollectables.length === 0 && (
                           <div className="col-span-full py-12 text-center text-gray-400">
                               <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                               <p>No items found matching your filters.</p>
                           </div>
                       )}
                   </div>
               </div>
           )}

       </main>

       {/* Editor Modal */}
       {renderEditor()}
    </div>
  );
};

export default AdminPage;
