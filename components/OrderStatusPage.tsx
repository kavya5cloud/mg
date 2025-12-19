
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, Calendar, Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { getShopOrders } from '../services/data';
import { ShopOrder } from '../types';

const OrderStatusPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [foundOrder, setFoundOrder] = useState<ShopOrder | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setFoundOrder(null);

    // Simulate short network delay for feel
    setTimeout(() => {
      const allOrders = getShopOrders();
      const order = allOrders.find(o => 
        o.id.toLowerCase() === orderId.trim().toLowerCase() && 
        o.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (order) {
        setFoundOrder(order);
      } else {
        setError('No order found with those credentials. Please check your Order ID and Email.');
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="pt-20 min-h-screen bg-white text-black">
      <div className="max-w-[800px] mx-auto px-6 mb-20">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Track Order</h1>
          <p className="text-lg text-gray-500">Check the progress of your MOCA Collectables order.</p>
        </div>

        {/* Search Form */}
        {!foundOrder && (
          <form onSubmit={handleSearch} className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order Identification (e.g. ORD-12345)</label>
                <input 
                  required
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold"
                  placeholder="Enter Order ID"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address used for purchase</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium animate-in shake">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSearching ? (
                  <>Searching Archives...</>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Lookup Order
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Results */}
        {foundOrder && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="bg-black text-white p-8 rounded-t-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Fulfillment Status</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${foundOrder.status === 'Fulfilled' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{foundOrder.status}</h2>
                  </div>
               </div>
               <button 
                onClick={() => setFoundOrder(null)} 
                className="text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
               >
                New Search
               </button>
            </div>

            <div className="bg-white border-x border-b border-gray-100 rounded-b-[2.5rem] shadow-2xl p-8 md:p-12">
               <div className="grid md:grid-cols-2 gap-12 mb-12">
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order Details</p>
                        <p className="text-xl font-black font-mono">{foundOrder.id}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg"><Calendar className="w-5 h-5" /></div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Ordered</p>
                           <p className="font-bold">{new Date(foundOrder.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg"><Clock className="w-5 h-5" /></div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Estimated Delivery</p>
                           <p className="font-bold">5-7 Business Days</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Items Summary</p>
                    <div className="space-y-4 mb-6">
                      {foundOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-600">
                            <span className="font-black text-black mr-2">{item.quantity}x</span>
                            {item.name}
                          </span>
                          <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                       <span className="text-xs font-bold uppercase text-gray-400">Total Charged</span>
                       <span className="text-2xl font-black">₹{foundOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Tracking Timeline</h3>
                  <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                     <div className="relative">
                        <div className="absolute -left-10 w-6 h-6 rounded-full bg-black flex items-center justify-center ring-4 ring-white">
                           <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <p className="font-bold text-sm">Order Placed</p>
                        <p className="text-xs text-gray-400">We have received your request and curated items.</p>
                     </div>
                     <div className="relative">
                        <div className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${foundOrder.status === 'Fulfilled' ? 'bg-black' : 'bg-gray-100'}`}>
                           {foundOrder.status === 'Fulfilled' ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                        </div>
                        <p className={`font-bold text-sm ${foundOrder.status !== 'Fulfilled' && 'text-gray-300'}`}>Dispatched from MOCA</p>
                        <p className="text-xs text-gray-400">Package has been handed over to our logistical partners.</p>
                     </div>
                     <div className="relative opacity-30">
                        <div className="absolute -left-10 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-white">
                           <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        </div>
                        <p className="font-bold text-sm text-gray-300">Delivered</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;
