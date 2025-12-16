
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, X, Plus, Minus, Lock, Check, MessageCircle, Search } from 'lucide-react';
import { getCollectables, saveShopOrder } from '../services/data';
import { Collectable, CartItem } from '../types';

const CollectablesPage: React.FC = () => {
  const [items, setItems] = useState<Collectable[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Checkout Form
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    setItems(getCollectables());
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (item: Collectable) => {
    if (item.inStock === false) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    const orderId = `ORD-${Math.floor(Math.random() * 89999) + 10000}`;

    // 1. Create Order in 'Database' (LocalStorage) so Admin can see it
    const newOrder = {
        id: orderId,
        customerName: formData.name,
        email: formData.email,
        items: cart,
        totalAmount: cartTotal,
        timestamp: Date.now(),
        status: 'Pending' as const
    };
    saveShopOrder(newOrder);

    // 2. Construct WhatsApp Message
    const phoneNumber = "919999999999"; // Replace with real museum number
    let message = `*New Order Request: ${orderId}*\n\n`;
    message += `Name: ${formData.name}\n`;
    message += `Email: ${formData.email}\n\n`;
    message += `*Items:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} (₹${item.price})\n`;
    });
    
    message += `\n*Total To Pay: ₹${cartTotal.toLocaleString()}*\n`;
    message += `\nPlease share payment UPI link to confirm my order.`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
        // 3. Open WhatsApp
        window.open(waUrl, '_blank');
        
        // 4. Show success screen in app
        setCart([]);
        setIsCheckingOut(false);
        setOrderComplete(true);
    }, 1500);
  };

  const filteredItems = categoryFilter === 'All' 
    ? items 
    : items.filter(item => item.category === categoryFilter);

  return (
    <div className="pt-10 min-h-screen bg-white relative">
      <div className="max-w-[1600px] mx-auto px-6 mb-20">
         <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
                >
                     <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                     </div>
                     <span className="font-bold text-sm">Cart</span>
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-8">
                <div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-black">
                        Design Store
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        Curated objects, art books, and exclusive MOCA editions. All proceeds support the museum's exhibitions and public programs.
                    </p>
                </div>
                <div className="hidden md:block">
                     <div className="bg-gray-100 p-6 rounded-xl max-w-sm">
                         <h4 className="font-bold mb-2 flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Member Discount</h4>
                         <p className="text-xs text-gray-600">Members save 10% on all store purchases. Sign in or join today.</p>
                     </div>
                </div>
            </div>
            
            <div className="flex gap-2 mt-8 overflow-x-auto pb-2 border-b border-gray-100">
                {['All', 'Books', 'Home', 'Accessories', 'Prints'].map(filter => (
                    <button 
                        key={filter} 
                        onClick={() => setCategoryFilter(filter)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                            categoryFilter === filter 
                            ? 'border-black text-black' 
                            : 'border-transparent text-gray-400 hover:text-black'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredItems.map((item) => (
                <div key={item.id} className={`group flex flex-col ${item.inStock === false ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6 relative">
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 mix-blend-multiply ${item.inStock !== false ? 'group-hover:scale-105' : 'grayscale'}`} 
                        />
                        
                        {item.inStock === false ? (
                             <div className="absolute inset-0 flex items-center justify-center bg-gray-100/10">
                                <span className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Sold Out</span>
                             </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="absolute bottom-4 right-4 bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-black hover:text-white"
                                >
                                    Add to Cart
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-start">
                             <div className="text-xs font-bold uppercase text-gray-400 mb-1">{item.category}</div>
                             <div className="text-lg font-medium">₹{item.price.toLocaleString()}</div>
                        </div>
                        <h3 className={`text-xl font-bold leading-tight mb-2 ${item.inStock !== false ? 'group-hover:underline' : ''} decoration-2 underline-offset-4`}>{item.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
              <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  
                  {/* Cart Header */}
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                      <h2 className="text-2xl font-black">Your Cart ({cartCount})</h2>
                      <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>

                  {/* Cart Content */}
                  <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50">
                      {orderComplete ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6">
                              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                  <MessageCircle className="w-10 h-10" />
                              </div>
                              <h3 className="text-2xl font-bold mb-2">Order Started</h3>
                              <p className="text-gray-500 mb-8">
                                  We have opened WhatsApp for you to finalize the payment details. Your order ID is saved.
                              </p>
                              <button onClick={() => { setOrderComplete(false); setIsCartOpen(false); }} className="w-full bg-black text-white py-4 rounded-lg font-bold">Continue Shopping</button>
                          </div>
                      ) : cart.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                              <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
                              <p className="text-lg font-medium">Your cart is empty.</p>
                              <p className="text-sm mt-2">Discover design objects that inspire.</p>
                              <button onClick={() => setIsCartOpen(false)} className="mt-8 text-black font-bold border-b border-black pb-1 hover:text-orange-600 hover:border-orange-600 transition-colors">Start Shopping</button>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {cart.map(item => (
                                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                      </div>
                                      <div className="flex-grow">
                                          <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                                            <button onClick={() => updateQty(item.id, -item.quantity)} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                          </div>
                                          <p className="text-gray-500 text-xs mb-3">{item.category}</p>
                                          <div className="flex items-center justify-between">
                                              <div className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                                              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                                                  <button onClick={() => updateQty(item.id, -1)} className="hover:text-black text-gray-500"><Minus className="w-3 h-3" /></button>
                                                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                  <button onClick={() => updateQty(item.id, 1)} className="hover:text-black text-gray-500"><Plus className="w-3 h-3" /></button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

                  {/* Cart Footer / Checkout */}
                  {!orderComplete && cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Subtotal</span>
                            <span className="text-3xl font-black">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        
                        <form onSubmit={handleCheckout} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Name" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                                <input 
                                    required
                                    type="email" 
                                    placeholder="Email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isCheckingOut}
                                className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isCheckingOut ? (
                                    'Connecting...'
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" /> Checkout via WhatsApp
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default CollectablesPage;
