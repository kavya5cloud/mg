
import React, { useState, useEffect } from 'react';
import { Lock, Search, RefreshCw, LogOut, TrendingUp, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ revenue: 0, visitors: 0, count: 0 });

  useEffect(() => {
    // Load bookings from local storage
    const loadData = () => {
        const stored = localStorage.getItem('moca_bookings');
        if (stored) {
            const parsedBookings: Booking[] = JSON.parse(stored);
            setBookings(parsedBookings);
            
            // Calculate Stats
            const revenue = parsedBookings.reduce((acc, b) => acc + b.totalAmount, 0);
            const visitors = parsedBookings.reduce((acc, b) => acc + b.tickets.adult + b.tickets.student + b.tickets.child, 0);
            
            setStats({
                revenue,
                visitors,
                count: parsedBookings.length
            });
        } else {
             // Mock data if empty
             const mock: Booking[] = [
                 { id: 'MOCA-1234-XJ', customerName: 'Arjun Mehta', email: 'arjun@test.com', date: new Date().toISOString(), tickets: {adult: 2, student: 0, child: 0}, totalAmount: 1000, timestamp: Date.now() - 100000, status: 'Confirmed' },
                 { id: 'MOCA-5678-AB', customerName: 'Priya Patel', email: 'priya@test.com', date: new Date(Date.now() + 86400000).toISOString(), tickets: {adult: 1, student: 2, child: 0}, totalAmount: 900, timestamp: Date.now() - 200000, status: 'Confirmed' },
             ];
             setBookings(mock);
             localStorage.setItem('moca_bookings', JSON.stringify(mock));
        }
    };

    if (isAuthenticated) {
        loadData();
    }
  }, [isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
         <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl">
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
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
       <header className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
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

       <main className="flex-grow max-w-[1200px] w-full mx-auto p-6 md:p-10">
           
           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                   <div>
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Revenue</p>
                       <h3 className="text-3xl font-black">₹{stats.revenue.toLocaleString()}</h3>
                   </div>
                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                       <TrendingUp className="w-6 h-6 text-green-700" />
                   </div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                   <div>
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Visitors</p>
                       <h3 className="text-3xl font-black">{stats.visitors}</h3>
                   </div>
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                       <Users className="w-6 h-6 text-blue-700" />
                   </div>
               </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                   <div>
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bookings</p>
                       <h3 className="text-3xl font-black">{stats.count}</h3>
                   </div>
                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                       <Calendar className="w-6 h-6 text-purple-700" />
                   </div>
               </div>
           </div>

           {/* Bookings Table */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <h2 className="text-xl font-bold">Recent Bookings</h2>
                   <div className="flex gap-2">
                       <div className="relative">
                           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input type="text" placeholder="Search ID or Name" className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black" />
                       </div>
                       <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Refresh">
                           <RefreshCw className="w-4 h-4 text-gray-600" />
                       </button>
                   </div>
               </div>
               
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                           <tr>
                               <th className="px-6 py-4">Ref ID</th>
                               <th className="px-6 py-4">Customer</th>
                               <th className="px-6 py-4">Visit Date</th>
                               <th className="px-6 py-4">Tickets</th>
                               <th className="px-6 py-4">Amount</th>
                               <th className="px-6 py-4">Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {bookings.map((booking) => (
                               <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-6 py-4 font-mono font-medium">{booking.id}</td>
                                   <td className="px-6 py-4">
                                       <div className="font-bold">{booking.customerName}</div>
                                       <div className="text-xs text-gray-500">{booking.email}</div>
                                   </td>
                                   <td className="px-6 py-4">
                                       {new Date(booking.date).toLocaleDateString()}
                                   </td>
                                   <td className="px-6 py-4 text-gray-600">
                                       {booking.tickets.adult > 0 && <span>{booking.tickets.adult} Ad </span>}
                                       {booking.tickets.student > 0 && <span>{booking.tickets.student} Stu </span>}
                                       {booking.tickets.child > 0 && <span>{booking.tickets.child} Ch</span>}
                                   </td>
                                   <td className="px-6 py-4 font-bold">₹{booking.totalAmount}</td>
                                   <td className="px-6 py-4">
                                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                           {booking.status}
                                       </span>
                                   </td>
                               </tr>
                           ))}
                           {bookings.length === 0 && (
                               <tr>
                                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                       No bookings found.
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>

       </main>
    </div>
  );
};

export default AdminPage;
