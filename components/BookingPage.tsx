
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Check, Mail, Download, Printer, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import LogoGeometric from './Logo';
import html2canvas from 'html2canvas';
import { saveBooking } from '../services/data';
import { Booking } from '../types';

type Step = 'date' | 'tickets' | 'details' | 'confirmation';

interface TicketCounts {
  adult: number;
  student: number;
  child: number;
}

const PRICING = {
  adult: 0,
  student: 0,
  child: 0
};

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState<TicketCounts>({ adult: 0, student: 0, child: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Cashfree SDK
  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get('txStatus') === 'SUCCESS') {
        setStep('confirmation');
    }

    if ((window as any).Cashfree) {
      setCashfree((window as any).Cashfree({ mode: "sandbox" }));
    }
  }, [searchParams]);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const totalTickets = tickets.adult + tickets.student + tickets.child;
  const totalAmount = (tickets.adult * PRICING.adult) + (tickets.student * PRICING.student) + (tickets.child * PRICING.child);
  const isActuallyFree = totalAmount === 0;
  
  const [bookingId] = useState(`MOCA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 8999) + 1000}`);

  const handleDateSelect = (date: Date) => {
    if (date.getDay() === 1) return;
    setSelectedDate(date);
    setStep('tickets');
  };

  const updateTicket = (type: keyof TicketCounts, delta: number) => {
    setTickets(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const handleFinalizeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage(isActuallyFree ? 'Processing Museum Registration...' : 'Connecting to Secure Checkout...');

    // DOMAIN INTEGRATION: returnUrl dynamically uses the current domain
    const returnUrl = `${window.location.origin}/#/booking?txStatus=SUCCESS&orderId=${bookingId}`;

    setTimeout(() => {
        if (!isActuallyFree && cashfree) {
            setLoadingMessage('Opening Cashfree Gateway...');
            // cashfree.checkout({ paymentSessionId: "YOUR_SESSION_ID", returnUrl });
        }
        
        const newBooking: Booking = {
            id: bookingId,
            customerName: customerName || 'Guest Visitor',
            email: customerEmail || 'guest@example.com',
            date: selectedDate?.toISOString() || new Date().toISOString(),
            tickets,
            totalAmount,
            timestamp: Date.now(),
            status: 'Confirmed'
        };
        saveBooking(newBooking);
        setIsLoading(false);
        setStep('confirmation');
    }, 1500);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = async () => {
    const element = document.getElementById('printable-ticket');
    if (!element) return;
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `MOCA-Ticket-${bookingId}.png`;
        link.click();
    } catch (error) {
        console.error("Error downloading ticket:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getProgress = () => {
      switch(step) {
          case 'date': return '25%';
          case 'tickets': return '50%';
          case 'details': return '75%';
          case 'confirmation': return '100%';
      }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col relative">
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-black mb-2 tracking-tighter">SECURE TRANSACTION</h3>
                <p className="text-gray-500 text-sm">{loadingMessage}</p>
                {!isActuallyFree && (
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> Powered by Cashfree
                  </div>
                )}
            </div>
        </div>
      )}

      <div className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-12">
        {step !== 'confirmation' && (
            <div className="mb-12 no-print">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancel Booking
                </Link>
                <div className="flex items-end justify-between mb-4">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter">
                        {step === 'date' && 'Select Date'}
                        {step === 'tickets' && 'Select Guests'}
                        {step === 'details' && 'Visitor Details'}
                    </h1>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-black transition-all duration-700 ease-out"
                        style={{ width: getProgress() }}
                    />
                </div>
            </div>
        )}

        {step === 'date' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {dates.map((date) => {
                    const isMonday = date.getDay() === 1;
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => handleDateSelect(date)}
                            disabled={isMonday}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-black text-white border-black shadow-xl -translate-y-1' : isMonday ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' : 'bg-white border-gray-200 hover:border-black hover:shadow-lg'}`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}</span>
                            <span className="text-3xl font-black">{date.getDate()}</span>
                            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{isMonday ? 'Closed' : new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}</span>
                        </button>
                    );
                })}
            </div>
        )}

        {step === 'tickets' && (
            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="text-xl font-black">Adult</h3>
                            <p className="text-gray-400 text-sm">General Access</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className={`font-black text-lg ${isActuallyFree ? 'text-green-600' : ''}`}>{isActuallyFree ? 'Free' : `₹${PRICING.adult}`}</span>
                            <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1.5">
                                <button onClick={() => updateTicket('adult', -1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">-</button>
                                <span className="w-6 text-center font-black">{tickets.adult}</span>
                                <button onClick={() => updateTicket('adult', 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="text-xl font-black">Student</h3>
                            <p className="text-gray-400 text-sm">Valid ID Required</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className={`font-black text-lg ${isActuallyFree ? 'text-green-600' : ''}`}>{isActuallyFree ? 'Free' : `₹${PRICING.student}`}</span>
                            <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1.5">
                                <button onClick={() => updateTicket('student', -1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">-</button>
                                <span className="w-6 text-center font-black">{tickets.student}</span>
                                <button onClick={() => updateTicket('student', 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="text-xl font-black">Child</h3>
                            <p className="text-gray-400 text-sm">Under 12 years</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-black text-lg text-green-600">Free</span>
                            <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1.5">
                                <button onClick={() => updateTicket('child', -1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">-</button>
                                <span className="w-6 text-center font-black">{tickets.child}</span>
                                <button onClick={() => updateTicket('child', 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-black text-xl">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-10 rounded-[2.5rem] h-fit sticky top-24 shadow-2xl">
                    <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 tracking-tight">Booking Overview</h3>
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center gap-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            <Calendar className="w-4 h-4" />
                            <span>{selectedDate ? formatDate(selectedDate) : ''}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            <User className="w-4 h-4" />
                            <span>{totalTickets} Visitors Recorded</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-10">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Total</span>
                        <span className="text-5xl font-black tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={() => setStep('details')}
                        disabled={totalTickets === 0}
                        className="w-full bg-white text-black py-5 font-bold rounded-2xl hover:bg-gray-100 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        Continue to Registry
                    </button>
                </div>
            </div>
        )}

        {step === 'details' && (
            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                    <form id="payment-form" onSubmit={handleFinalizeBooking} className="space-y-6">
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <User className="w-6 h-6" />
                                <h3 className="text-2xl font-black tracking-tight">Identity Verification</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                    <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold" placeholder="Enter name" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email for Digital Receipt</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input required type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-bold" placeholder="Email address" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-black text-white p-10 rounded-[2.5rem] h-fit sticky top-24 shadow-2xl">
                    <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 tracking-tight">{isActuallyFree ? 'Registration' : 'Checkout'}</h3>
                    <div className="space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-gray-400">
                        {tickets.adult > 0 && <div className="flex justify-between"><span>{tickets.adult}x Adult Admission</span><span className="text-white">{isActuallyFree ? 'Free' : `₹${(tickets.adult * PRICING.adult).toLocaleString()}`}</span></div>}
                        {tickets.student > 0 && <div className="flex justify-between"><span>{tickets.student}x Student Access</span><span className="text-white">{isActuallyFree ? 'Free' : `₹${(tickets.student * PRICING.student).toLocaleString()}`}</span></div>}
                        {tickets.child > 0 && <div className="flex justify-between"><span>{tickets.child}x Child Pass</span><span className="text-white">Free</span></div>}
                    </div>
                    <div className="flex justify-between items-end mb-10 border-t border-white/10 pt-8">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Payable</span>
                        <span className="text-5xl font-black tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <button 
                        type="submit"
                        form="payment-form"
                        disabled={isLoading}
                        className="w-full bg-white text-black py-5 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                         {isActuallyFree ? (
                             <>Confirm Free Registry</>
                         ) : (
                             <>
                                <CreditCard className="w-5 h-5" />
                                Secure Pay with Cashfree
                             </>
                         )}
                    </button>
                    {!isActuallyFree && (
                      <div className="mt-8 flex flex-col items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
                          <img src="https://www.cashfree.com/wp-content/uploads/2021/04/cashfree-logo.png" alt="Cashfree" className="h-4 invert" />
                          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-white">
                              <ShieldCheck className="w-3 h-3" /> PCI-DSS Compliant Channel
                          </div>
                      </div>
                    )}
                </div>
            </div>
        )}

        {step === 'confirmation' && (
             <div className="max-w-xl mx-auto animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-12 no-print">
                    <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <Check className="w-12 h-12" />
                    </div>
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">Access Granted</h2>
                    <p className="text-gray-500 font-medium">Digital passes for <span className="text-black font-bold">{customerName}</span> have been issued to <span className="text-black font-bold">{customerEmail}</span>.</p>
                </div>

                <div id="printable-ticket" className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 relative">
                    <div className="bg-black text-white p-8 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <LogoGeometric className="w-12 h-12 text-white" />
                            <div>
                                <h3 className="font-black text-2xl tracking-tighter leading-none">MOCA PASS</h3>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Gandhinagar</p>
                            </div>
                        </div>
                        <div className="relative z-10 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 text-xs font-bold uppercase rounded-full">
                            {isActuallyFree ? 'Museum Guest' : `Paid: ₹${totalAmount}`}
                        </div>
                    </div>
                    <div className="p-10">
                        <div className="flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex flex-col items-center shrink-0">
                                <div className="bg-white p-3 border-2 border-black rounded-2xl mb-3 shadow-lg">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`} 
                                        alt="Ticket QR" 
                                        crossOrigin="anonymous"
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                                <p className="text-[10px] font-mono text-gray-400 tracking-[0.2em]">{bookingId}</p>
                            </div>
                            <div className="flex-grow space-y-6 w-full text-left">
                                <div><p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Holder</p><p className="font-black text-2xl">{customerName}</p></div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div><p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Date</p><p className="font-bold text-lg">{selectedDate ? formatDate(selectedDate) : ''}</p></div>
                                    <div><p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Entry</p><p className="font-bold text-lg">10:30 AM</p></div>
                                </div>
                                <div><p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Admits</p><p className="font-bold text-lg">
                                    {tickets.adult > 0 && `${tickets.adult} Adult${tickets.adult > 1 ? 's' : ''}`}
                                    {tickets.student > 0 && `${tickets.adult > 0 ? ', ' : ''}${tickets.student} Student${tickets.student > 1 ? 's' : ''}`}
                                    {tickets.child > 0 && `${(tickets.adult > 0 || tickets.student > 0) ? ', ' : ''}${tickets.child} Child${tickets.child > 1 ? 'ren' : ''}`}
                                </p></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-8 border-t-4 border-dashed border-gray-200">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span>TRANS REF: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-black" /> Secure Digital Artifact</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center no-print">
                    <button onClick={handleDownloadTicket} disabled={isDownloading} className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50">
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download Image
                    </button>
                    <button onClick={handlePrintTicket} className="flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"><Printer className="w-4 h-4" /> Print Pass</button>
                    <Link to="/" className="flex items-center justify-center gap-3 border-2 border-gray-200 bg-white px-8 py-4 rounded-2xl font-bold text-sm hover:border-black transition-all">Home</Link>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
