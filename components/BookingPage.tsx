
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Check, CreditCard, QrCode, Lock, Mail } from 'lucide-react';

type Step = 'date' | 'tickets' | 'payment' | 'confirmation';

interface TicketCounts {
  adult: number;
  student: number;
  child: number;
}

const BookingPage: React.FC = () => {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState<TicketCounts>({ adult: 0, student: 0, child: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const totalPrice = (tickets.adult * 500) + (tickets.student * 200);
  const totalTickets = tickets.adult + tickets.student + tickets.child;

  const handleDateSelect = (date: Date) => {
    // Mondays are closed (1)
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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API processing
    setTimeout(() => {
        // Save booking to localStorage for Admin Demo
        const bookingId = `MOCA-${Math.floor(Math.random() * 8999) + 1000}-XJ`;
        const newBooking = {
            id: bookingId,
            customerName: customerName || 'Guest Visitor',
            email: customerEmail || 'guest@example.com',
            date: selectedDate?.toISOString(),
            tickets,
            totalAmount: totalPrice,
            timestamp: Date.now(),
            status: 'Confirmed'
        };

        const existingBookings = JSON.parse(localStorage.getItem('moca_bookings') || '[]');
        localStorage.setItem('moca_bookings', JSON.stringify([newBooking, ...existingBookings]));

        setIsLoading(false);
        setStep('confirmation');
    }, 3000); 
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  };

  const getProgress = () => {
      switch(step) {
          case 'date': return '25%';
          case 'tickets': return '50%';
          case 'payment': return '75%';
          case 'confirmation': return '100%';
      }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col relative">
      {/* Payment Processing Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
                <p className="text-gray-500 text-sm">Please do not close your browser...</p>
            </div>
        </div>
      )}

      <div className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-12">
        {/* Header / Progress */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Cancel Booking
            </Link>
            <div className="flex items-end justify-between mb-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                    {step === 'date' && 'Select Date'}
                    {step === 'tickets' && 'Select Tickets'}
                    {step === 'payment' && 'Payment Details'}
                    {step === 'confirmation' && 'You\'re All Set'}
                </h1>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">
                    Step {step === 'date' ? 1 : step === 'tickets' ? 2 : step === 'payment' ? 3 : 4} of 4
                </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-black transition-all duration-500 ease-out"
                    style={{ width: getProgress() }}
                />
            </div>
        </div>

        {/* Step 1: Date Selection */}
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
                            className={`
                                flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200
                                ${isSelected 
                                    ? 'bg-black text-white border-black ring-2 ring-black ring-offset-2' 
                                    : isMonday 
                                        ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' 
                                        : 'bg-white border-gray-200 hover:border-black hover:shadow-lg'
                                }
                            `}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest mb-1">
                                {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)}
                            </span>
                            <span className="text-3xl font-black">
                                {date.getDate()}
                            </span>
                            <span className="text-xs mt-1">
                                {isMonday ? 'Closed' : new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}
                            </span>
                        </button>
                    );
                })}
            </div>
        )}

        {/* Step 2: Tickets */}
        {step === 'tickets' && (
            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                    {/* Adult */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Adult</h3>
                            <p className="text-gray-500 text-sm">General Admission</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-bold">₹500</span>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                                <button onClick={() => updateTicket('adult', -1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">-</button>
                                <span className="w-4 text-center font-bold">{tickets.adult}</span>
                                <button onClick={() => updateTicket('adult', 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Student */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Student</h3>
                            <p className="text-gray-500 text-sm">ID Required</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-bold">₹200</span>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                                <button onClick={() => updateTicket('student', -1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">-</button>
                                <span className="w-4 text-center font-bold">{tickets.student}</span>
                                <button onClick={() => updateTicket('student', 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Child */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Child</h3>
                            <p className="text-gray-500 text-sm">Under 12 years</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-bold">Free</span>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                                <button onClick={() => updateTicket('child', -1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">-</button>
                                <span className="w-4 text-center font-bold">{tickets.child}</span>
                                <button onClick={() => updateTicket('child', 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 font-bold text-lg">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-900 text-white p-8 rounded-xl h-fit sticky top-24">
                    <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Booking Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{selectedDate ? formatDate(selectedDate) : ''}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{totalTickets} Guests</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <span className="text-gray-400 text-sm uppercase tracking-widest">Total</span>
                        <span className="text-4xl font-black">₹{totalPrice}</span>
                    </div>

                    <button 
                        onClick={() => setStep('payment')}
                        disabled={totalTickets === 0}
                        className="w-full bg-white text-black py-4 font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Continue to Payment
                    </button>
                    <button onClick={() => setStep('date')} className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white">
                        Change Date
                    </button>
                </div>
            </div>
        )}

        {/* Step 3: Payment Details */}
        {step === 'payment' && (
            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                    <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-5 h-5" />
                                <h3 className="text-lg font-bold">Contact Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                                        placeholder="Enter your full name" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            required 
                                            type="email" 
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                                            placeholder="you@example.com" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="text-lg font-bold">Payment Method</h3>
                                </div>
                                <div className="flex gap-2 opacity-50 grayscale">
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Card Number</label>
                                    <input required type="text" maxLength={19} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Expiry Date</label>
                                        <input required type="text" maxLength={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">CVV</label>
                                        <input required type="password" maxLength={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                 {/* Summary Box */}
                <div className="bg-gray-900 text-white p-8 rounded-xl h-fit sticky top-24">
                    <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h3>
                    
                    <div className="space-y-3 mb-8 text-sm">
                        <div className="flex justify-between items-center text-gray-300">
                             <span>Date</span>
                             <span className="font-medium text-white">{selectedDate ? formatDate(selectedDate) : ''}</span>
                        </div>
                         <div className="flex justify-between items-center text-gray-300">
                             <span>Entry Time</span>
                             <span className="font-medium text-white">10:30 AM - 6:00 PM</span>
                        </div>
                        <div className="border-t border-gray-800 my-4"></div>
                        
                        {tickets.adult > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">{tickets.adult}x Adult</span>
                                <span>₹{tickets.adult * 500}</span>
                            </div>
                        )}
                        {tickets.student > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">{tickets.student}x Student</span>
                                <span>₹{tickets.student * 200}</span>
                            </div>
                        )}
                        {tickets.child > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">{tickets.child}x Child</span>
                                <span>Free</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end mb-8 border-t border-gray-700 pt-6">
                        <span className="text-gray-400 text-sm uppercase tracking-widest">Total to Pay</span>
                        <span className="text-4xl font-black">₹{totalPrice}</span>
                    </div>

                    <button 
                        type="submit"
                        form="payment-form"
                        disabled={isLoading}
                        className="w-full bg-white text-black py-4 font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         <Lock className="w-4 h-4" />
                         Pay ₹{totalPrice}
                    </button>
                    <button onClick={() => setStep('tickets')} className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white">
                        Back to Tickets
                    </button>
                </div>
            </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && (
             <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                    <div className="bg-green-600 text-white p-8 text-center relative overflow-hidden">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce relative z-10">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-1 relative z-10">Booking Confirmed</h2>
                        <p className="text-green-100 text-sm relative z-10">Ref: MOCA-{Math.floor(Math.random() * 8999) + 1000}-XJ</p>
                        
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                             <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
                             <div className="absolute top-20 -right-10 w-20 h-20 rounded-full bg-white"></div>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                             <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                <p className="font-bold text-lg">{selectedDate ? formatDate(selectedDate) : ''}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Entry</p>
                                <p className="font-bold text-lg">10:30 AM - 6:00 PM</p>
                             </div>
                        </div>
                        
                        <div className="space-y-2 mb-8 bg-gray-50 p-4 rounded-lg">
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Details</p>
                            {tickets.adult > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{tickets.adult}x Adult</span>
                                    <span className="font-bold">₹{tickets.adult * 500}</span>
                                </div>
                            )}
                            {tickets.student > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{tickets.student}x Student</span>
                                    <span className="font-bold">₹{tickets.student * 200}</span>
                                </div>
                            )}
                            {tickets.child > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{tickets.child}x Child</span>
                                    <span className="font-bold">Free</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-black border-t border-gray-200 pt-2 mt-2">
                                <span>Paid</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 mb-6">
                            <QrCode className="w-32 h-32 opacity-90" />
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Scan at entrance</p>
                        </div>
                        
                        <p className="text-center text-sm text-gray-500 mb-6">A receipt has been sent to {customerEmail}.</p>

                        <Link to="/" className="block w-full bg-black text-white text-center py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
