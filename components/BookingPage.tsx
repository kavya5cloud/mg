
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Check, CreditCard, QrCode, Lock, Mail, MessageCircle, Download, Share2, Printer, Loader2 } from 'lucide-react';
import LogoGeometric from './Logo';
import html2canvas from 'html2canvas';

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
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
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
  
  // Generate a unique Booking ID based on timestamp and random string
  const [bookingId] = useState(`MOCA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 8999) + 1000}`);

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
    setLoadingMessage('Processing Payment...');
    setIsLoading(true);
    
    // Save booking to localStorage for Admin Demo
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

    // Simulate Payment and Email Sending Delays
    setTimeout(() => {
        setLoadingMessage('Generating Ticket...');
        
        setTimeout(() => {
             setLoadingMessage(`Sending confirmation to ${customerEmail}...`);
             
             setTimeout(() => {
                setIsLoading(false);
                setStep('confirmation');
             }, 1500);
        }, 1000);
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
        // Use html2canvas to capture the element
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // High resolution
            useCORS: true, // Needed for QR code image
            logging: false
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `MOCA-Ticket-${bookingId}.png`;
        link.click();
    } catch (error) {
        console.error("Error downloading ticket:", error);
        alert("There was an issue generating the image. Please try the Print option.");
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
          case 'payment': return '75%';
          case 'confirmation': return '100%';
      }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col relative">
      {/* Processing Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2">Please Wait</h3>
                <p className="text-gray-500 text-sm animate-pulse">{loadingMessage}</p>
            </div>
        </div>
      )}

      <div className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-12">
        {/* Header / Progress - Hide on confirmation step for clean look */}
        {step !== 'confirmation' && (
            <div className="mb-12 no-print">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancel Booking
                </Link>
                <div className="flex items-end justify-between mb-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                        {step === 'date' && 'Select Date'}
                        {step === 'tickets' && 'Select Tickets'}
                        {step === 'payment' && 'Confirm & Pay'}
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
        )}

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

        {/* Step 3: Payment / Contact Form */}
        {step === 'payment' && (
            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                    <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-5 h-5" />
                                <h3 className="text-lg font-bold">Visitor Details</h3>
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
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email for Ticket Delivery</label>
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
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        We will send the QR code ticket to this email address.
                                    </p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                             <h3 className="font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Payment Method
                             </h3>
                             {/* Mock Payment Options */}
                             <div className="space-y-3">
                                 <label className="flex items-center gap-3 p-4 border border-black bg-white rounded-lg cursor-pointer">
                                     <div className="w-4 h-4 rounded-full border-4 border-black"></div>
                                     <span className="font-bold">Credit / Debit Card</span>
                                 </label>
                                 <label className="flex items-center gap-3 p-4 border border-gray-200 bg-white rounded-lg cursor-pointer opacity-60">
                                     <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                     <span className="font-bold">UPI / Netbanking</span>
                                 </label>
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
                        className="w-full bg-black border border-white/20 text-white py-4 font-bold rounded-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         <Check className="w-4 h-4" />
                         Confirm & Pay
                    </button>
                    <button onClick={() => setStep('tickets')} className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white">
                        Back to Tickets
                    </button>
                </div>
            </div>
        )}

        {/* Step 4: Confirmation & Digital Ticket */}
        {step === 'confirmation' && (
             <div className="max-w-xl mx-auto animate-in fade-in zoom-in duration-500">
                
                <div className="text-center mb-8 no-print">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Booking Confirmed!</h2>
                    <p className="text-gray-600">
                        We have simulated sending the ticket to <span className="font-bold text-black">{customerEmail}</span>.
                    </p>
                </div>

                {/* THE TICKET - With ID for printing */}
                <div id="printable-ticket" className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative transform transition-transform hover:scale-[1.01]">
                    {/* Ticket Header */}
                    <div className="bg-black text-white p-6 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-3">
                            <LogoGeometric className="w-10 h-10 text-white" />
                            <div>
                                <h3 className="font-black text-xl tracking-tighter">MOCA TICKET</h3>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Gandhinagar</p>
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-800 rounded-full opacity-50"></div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* QR Code Section */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="bg-white p-2 border-2 border-black rounded-lg mb-2">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`} 
                                        alt="Ticket QR Code" 
                                        crossOrigin="anonymous"
                                        className="w-32 h-32 object-contain shrink-0 bg-white"
                                    />
                                </div>
                                <p className="text-[10px] font-mono text-gray-500 tracking-wider">{bookingId}</p>
                            </div>

                            {/* Details Section */}
                            <div className="flex-grow space-y-4 w-full">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Visitor</p>
                                    <p className="font-bold text-lg">{customerName}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
                                        <p className="font-bold">{selectedDate ? formatDate(selectedDate) : ''}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Entry</p>
                                        <p className="font-bold">10:30 AM</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Admit</p>
                                    <p className="font-bold">
                                        {tickets.adult > 0 && `${tickets.adult} Adult${tickets.adult > 1 ? 's' : ''}`}
                                        {tickets.student > 0 && `, ${tickets.student} Student${tickets.student > 1 ? 's' : ''}`}
                                        {tickets.child > 0 && `, ${tickets.child} Child${tickets.child > 1 ? 'ren' : ''}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Footer / Tear-off line */}
                    <div className="relative bg-gray-50 p-6 border-t-2 border-dashed border-gray-300">
                        {/* Cutouts for tear-off effect */}
                        <div className="absolute -left-3 top-0 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
                        <div className="absolute -right-3 top-0 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Non-transferable</span>
                            <span>Valid for one entry</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center no-print">
                    <button 
                        onClick={handleDownloadTicket}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download Ticket
                    </button>
                    
                    <button 
                        onClick={handlePrintTicket}
                        className="flex items-center justify-center gap-2 border border-black text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>

                    <Link to="/" className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-6 py-3 rounded-full font-bold text-sm hover:border-black transition-colors">
                        Return Home
                    </Link>
                </div>

             </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
