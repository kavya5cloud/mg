
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, TrendingUp, Handshake, Check } from 'lucide-react';

const CorporateSupportPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Inquiry Sent</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Thank you for your interest in partnering with MOCA. Our Development Director will contact you shortly to discuss custom sponsorship packages.
          </p>
          <Link to="/" className="inline-block border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
        
        {/* Navigation */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Corporate Support</h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Align your brand with innovation and creativity. MOCA partners with leading companies to create meaningful cultural experiences.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
             {/* Info Column */}
            <div>
                 <h2 className="text-3xl font-bold mb-8">Partnership Tiers</h2>
                 
                 <div className="space-y-6 mb-12">
                    <div className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Exhibition Sponsor <span className="text-sm font-normal text-gray-500">₹5 Lakhs+</span>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">Prominent branding on exhibition walls, catalogs, and marketing materials. Private after-hours viewing for clients.</p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                            <TrendingUp className="w-4 h-4" /> High Visibility
                        </div>
                    </div>

                    <div className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Education Partner <span className="text-sm font-normal text-gray-500">₹2 Lakhs+</span>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">Support our free school tours and workshops. Recognition in all educational materials and press releases.</p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                            <Handshake className="w-4 h-4" /> Community Impact
                        </div>
                    </div>

                    <div className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Corporate Member <span className="text-sm font-normal text-gray-500">₹50,000 / yr</span>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">Free admission for employees, discount on venue rentals for corporate events, and invitations to galas.</p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                            <Building2 className="w-4 h-4" /> Employee Perks
                        </div>
                    </div>
                 </div>
            </div>

            {/* Form Column */}
            <div className="bg-gray-50 p-8 rounded-2xl h-fit">
                <h3 className="text-2xl font-bold mb-2">Partner With Us</h3>
                <p className="text-gray-500 mb-8">Fill out the form below to request a sponsorship deck.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Company Name</label>
                        <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Contact Name</label>
                            <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Job Title</label>
                            <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                        <input required type="email" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Interested In</label>
                        <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black">
                            <option>Exhibition Sponsorship</option>
                            <option>Education Programs</option>
                            <option>Corporate Membership</option>
                            <option>Event Hosting</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors">
                        Send Inquiry
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CorporateSupportPage;
