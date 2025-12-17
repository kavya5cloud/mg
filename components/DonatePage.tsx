
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Lock, Check } from 'lucide-react';

const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>(1000);
  const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API processing
    setTimeout(() => {
        setLoading(false);
        setStep('success');
    }, 2000);
  };

  if (step === 'success') {
      return (
        <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-md w-full px-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
                    <Heart className="w-10 h-10 fill-current" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">Thank You!</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Your generous donation of <strong>₹{amount}</strong> helps keep MOCA accessible to everyone. A receipt has been sent to your email.
                </p>
                <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Return to Home
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="pt-10 min-h-screen bg-gray-50">
      <div className="max-w-[800px] mx-auto px-6 mb-20">
        
        {/* Navigation */}
        <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Cancel Donation
            </Link>
            <h1 className="text-5xl font-black mb-4 tracking-tighter">Make a Donation</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
                Support the arts in Gandhinagar. Your contribution directly funds exhibitions, conservation, and education programs.
            </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            {step === 'amount' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Select Amount (INR)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {predefinedAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className={`py-4 rounded-xl text-lg font-bold border-2 transition-all ${amount === amt ? 'border-black bg-black text-white shadow-lg scale-105' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}
                                >
                                    ₹{amt.toLocaleString()}
                                </button>
                            ))}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Custom"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className={`w-full h-full py-4 pl-8 pr-4 rounded-xl text-lg font-bold border-2 outline-none transition-all ${!predefinedAmounts.includes(amount as number) && amount !== '' ? 'border-black ring-1 ring-black' : 'border-gray-100 focus:border-gray-300'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep('details')}
                        disabled={!amount}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        Continue
                    </button>
                </div>
            ) : (
                <form onSubmit={handleDonate} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Donation Amount</p>
                            <p className="text-3xl font-black">₹{Number(amount).toLocaleString()}</p>
                        </div>
                        <button type="button" onClick={() => setStep('amount')} className="text-sm font-bold underline">Change</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                            <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Card Information</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" placeholder="Card number" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <input required type="text" placeholder="MM / YY" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                         <div>
                            <input required type="text" placeholder="CVC" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : `Donate ₹${Number(amount).toLocaleString()}`}
                    </button>
                </form>
            )}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8 max-w-md mx-auto">
            MOCA Gandhinagar is a registered non-profit organization. All donations are tax-deductible to the extent allowed by law.
        </p>
      </div>
    </div>
  );
};

export default DonatePage;
