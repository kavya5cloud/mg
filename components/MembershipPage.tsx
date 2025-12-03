
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Star, Users, Heart, Mail } from 'lucide-react';

type Tier = 'individual' | 'dual' | 'patron';

const MembershipPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<Tier>('individual');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tiers = [
    {
      id: 'individual',
      name: 'Individual',
      price: '₹2,000',
      period: '/ year',
      icon: Star,
      benefits: ['Unlimited free admission', 'Member-only exhibition previews', '10% discount at Museum Cafe']
    },
    {
      id: 'dual',
      name: 'Dual',
      price: '₹3,500',
      period: '/ year',
      icon: Users,
      benefits: ['All Individual benefits for two adults', '2 Guest passes per visit', 'Priority booking for workshops']
    },
    {
      id: 'patron',
      name: 'Patron',
      price: '₹10,000',
      period: '/ year',
      icon: Heart,
      benefits: ['All Dual benefits', 'Private curator-led tours', 'Invitation to Annual Gala', 'Name on Donor Wall']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API/Email delay
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
      return (
        <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-md w-full px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Mail className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">Application Received</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Thank you, <span className="font-bold text-black">{formData.name}</span>. 
                    <br/><br/>
                    Our membership team has received your request for the <span className="font-bold text-black capitalize">{selectedTier}</span> tier.
                    We will email you at <span className="font-bold text-black">{formData.email}</span> shortly with payment details and your digital welcome kit.
                </p>
                <Link to="/" className="inline-block border-b-2 border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-600 hover:border-gray-600 transition-colors">
                    Return to Home
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="pt-10 min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
        
        {/* Header */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Membership</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
                Support MOCA Gandhinagar and enjoy a year of art, inspiration, and exclusive access.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Tiers Column */}
            <div className="lg:col-span-7 space-y-6">
                {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = selectedTier === tier.id;
                    return (
                        <div 
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id as Tier)}
                            className={`
                                relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                ${isSelected 
                                    ? 'bg-black text-white border-black shadow-2xl scale-[1.02]' 
                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-lg text-gray-400'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-black'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{tier.name}</h3>
                                        <p className="text-sm opacity-70">Membership</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-black'}`}>{tier.price}</div>
                                    <div className="text-xs uppercase tracking-wider opacity-60">{tier.period}</div>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {tier.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className={`w-4 h-4 ${isSelected ? 'text-green-400' : 'text-green-600'}`} />
                                        <span className={isSelected ? 'text-gray-200' : 'text-gray-600'}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* Selection Ring */}
                            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white' : 'border-gray-200'}`}>
                                {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Application Form Column */}
            <div className="lg:col-span-5">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                    <h3 className="text-2xl font-bold mb-6">Join Today</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Selected Tier</label>
                            <div className="w-full bg-gray-50 border border-gray-200 text-black font-bold px-4 py-3 rounded-lg capitalize">
                                {selectedTier} Membership
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                            <input 
                                required
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder="you@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>

                         <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Phone Number</label>
                            <input 
                                required
                                type="tel" 
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="+91"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <>Submit Application</>
                            )}
                        </button>
                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                            By submitting this form, you agree to receive communications from MOCA Gandhinagar regarding your membership application.
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
