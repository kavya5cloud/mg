
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Lock, ShieldCheck, AlertCircle, Loader2, CreditCard, Mail, User, CheckCircle2 } from 'lucide-react';

const DonatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState<number | ''>(1000);
  const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Cashfree SDK Instance
  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    // Check if we just returned from a successful payment
    if (searchParams.get('txStatus') === 'SUCCESS') {
      setStep('success');
    }

    // Initialize Cashfree
    if ((window as any).Cashfree) {
      const cf = (window as any).Cashfree({
        mode: "sandbox", // Switch to "production" when live
      });
      setCashfree(cf);
    }
  }, [searchParams]);

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashfree) {
      alert("Payment gateway is still initializing. Please wait.");
      return;
    }

    setLoading(true);
    setLoadingMessage('Initializing Secure Payment Session...');

    /**
     * DOMAIN INTEGRATION NOTE:
     * In a real app, you would fetch a `payment_session_id` from your server.
     * Your server-side code (Node/Python/PHP) creates an order via Cashfree API.
     */
    
    // Simulate API delay
    setTimeout(() => {
        setLoadingMessage('Redirecting to Secure Bank Gateway...');
        
        /**
         * The standard Cashfree Checkout logic:
         * We use window.location.origin so this works on ANY domain.
         */
        const checkoutOptions = {
            paymentSessionId: "session_fake_id_123", // Provided by your backend
            returnUrl: `${window.location.origin}/#/donate?txStatus=SUCCESS&orderId=MOCA-${Date.now()}`,
        };

        // For this demo, we simulate the redirect success after a short delay
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 2000);

        // Actual implementation would be:
        // cashfree.checkout(checkoutOptions);
    }, 1500);
  };

  if (step === 'success') {
      return (
        <div className="pt-20 min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter">Contribution Confirmed</h2>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                    Thank you for supporting MOCA Gandhinagar. Your donation of <span className="text-black font-bold">₹{Number(amount).toLocaleString()}</span> enables us to keep the arts accessible to all.
                    <br/><br/>
                    <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded">REF: {Math.random().toString(36).substring(2, 12).toUpperCase()}</span>
                </p>
                <div className="flex flex-col gap-4">
                  <Link to="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
                      Return to Museum
                  </Link>
                  <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4">
                    Download Tax Receipt
                  </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="pt-10 min-h-screen bg-gray-50 flex flex-col relative">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
            <div className="flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tighter">SECURE HANDSHAKE</h3>
                <p className="text-gray-500 text-sm font-medium px-8">{loadingMessage}</p>
                <div className="mt-12 flex items-center gap-3 py-2 px-4 bg-gray-100 rounded-full grayscale opacity-60">
                    <img src="https://www.cashfree.com/wp-content/uploads/2021/04/cashfree-logo.png" alt="Cashfree" className="h-4" />
                    <div className="w-px h-3 bg-gray-300"></div>
                    <span className="text-[10px] font-bold tracking-widest uppercase">Verified Integration</span>
                </div>
            </div>
        </div>
      )}

      <div className="max-w-[800px] w-full mx-auto px-6 py-12 flex-grow">
        <div className="mb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Cancel Contribution
            </Link>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Empower the Arts</h1>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
                Your contribution directly impacts our exhibitions, conservation, and educational outreach.
            </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
            {step === 'amount' ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {predefinedAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className={`py-5 rounded-2xl text-xl font-black border-2 transition-all ${amount === amt ? 'border-black bg-black text-white shadow-xl -translate-y-1' : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-black'}`}
                                >
                                    ₹{amt.toLocaleString()}
                                </button>
                            ))}
                            <div className="relative col-span-2 md:col-span-1">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Custom"
                                    value={predefinedAmounts.includes(amount as number) ? '' : amount}
                                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                    className={`w-full h-full py-5 pl-10 pr-5 rounded-2xl text-xl font-black border-2 outline-none transition-all ${!predefinedAmounts.includes(amount as number) && amount !== '' ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-100 focus:border-gray-300 focus:bg-gray-50/50'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button 
                          onClick={() => setStep('details')}
                          disabled={!amount || Number(amount) <= 0}
                          className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-95"
                      >
                          Proceed to Verification
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Lock className="w-3 h-3" /> Encrypted Transaction Channel
                      </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleDonate} className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Final Amount</p>
                            <p className="text-4xl font-black tracking-tight">₹{Number(amount).toLocaleString()}</p>
                        </div>
                        <button type="button" onClick={() => setStep('amount')} className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-gray-400 transition-colors">Edit</button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Legal Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        required 
                                        type="text" 
                                        value={customerName} 
                                        onChange={(e) => setCustomerName(e.target.value)} 
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium" 
                                        placeholder="Enter your name" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email for Tax Receipt</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        required 
                                        type="email" 
                                        value={customerEmail} 
                                        onChange={(e) => setCustomerEmail(e.target.value)} 
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium" 
                                        placeholder="you@example.com" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col gap-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center gap-3"
                            >
                                <CreditCard className="w-6 h-6" />
                                Secure Pay with Cashfree
                            </button>
                            
                            <div className="flex flex-col items-center gap-4 border-t border-gray-100 pt-8">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Payment Partners</p>
                              <div className="flex gap-6 grayscale opacity-40">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" />
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" />
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4" />
                              </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
        
        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Secured
          </div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              MOCA Gandhinagar is a non-profit institution. All donations are 100% tax-deductible under Section 80G.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
