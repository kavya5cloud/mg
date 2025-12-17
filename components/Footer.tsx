
import React, { useState } from 'react';
import { Facebook, Instagram, Lock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveNewsletterEmail } from '../services/data';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      saveNewsletterEmail(email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-black pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="text-4xl font-black tracking-tighter mb-6">MOCA</div>
             <p className="text-sm text-gray-600 leading-relaxed max-w-xs mb-8">
               The Museum of Contemporary Art Gandhinagar is dedicated to being the foremost museum of modern art in the region.
             </p>
             <div className="space-y-2 text-sm text-gray-500 font-medium">
                <p>MOCA Gandhinagar<br/>Inside Veer Residency, Gandhinagar Mahudi<br/>Gujarat, India</p>
                <p>+91 79 2322 0000</p>
                <p>info@mocagandhinagar.org</p>
             </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">About</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-black">Our Story</Link></li>
              <li><Link to="/visit" className="hover:text-black">Plan Your Visit</Link></li>
              <li><Link to="/exhibitions" className="hover:text-black">Exhibitions</Link></li>
            </ul>
          </div>

           <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/membership" className="hover:text-black">Membership</Link></li>
              <li><Link to="/patrons" className="hover:text-black">Patrons</Link></li>
              <li><Link to="/corporate" className="hover:text-black">Corporate Support</Link></li>
              <li><Link to="/volunteer" className="hover:text-black">Volunteer</Link></li>
              <li><Link to="/donate" className="hover:text-black font-bold">Donate</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Follow Us</h4>
             <div className="flex space-x-4 mb-6">
                <a href="https://www.instagram.com/mocagandhinagar?igsh=NWg4Zm5mcXRkZw==" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="https://www.facebook.com/share/1ZP14kakpn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
             </div>
             <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xs font-bold mb-2">Subscribe to our newsletter</p>
                {isSubscribed ? (
                    <div className="flex items-center gap-2 text-green-700 text-sm font-bold animate-in fade-in">
                        <Check className="w-4 h-4" /> Subscribed!
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                       <input 
                          type="email" 
                          placeholder="Email address" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white px-2 py-1 text-sm w-full outline-none border border-transparent focus:border-black" 
                       />
                       <button type="submit" className="bg-black text-white px-3 py-1 text-xs font-bold uppercase">Go</button>
                    </form>
                )}
             </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black">Terms of Use</Link>
            <Link to="/refund" className="hover:text-black">Refund Policy</Link>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2024 Museum of Contemporary Art Gandhinagar. All rights reserved.</span>
            <Link to="/admin" className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Lock className="w-3 h-3" /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
