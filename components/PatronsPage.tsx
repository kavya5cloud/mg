
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Handshake, Building2 } from 'lucide-react';

const PatronsPage: React.FC = () => {
  return (
    <div className="pt-10 min-h-screen bg-white text-black">
      <div className="max-w-[1400px] mx-auto px-6 mb-20">
        
        {/* Navigation */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Patrons</h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                MOCA Gandhinagar relies on the generosity of individuals, foundations, and corporations to present our exhibitions and serve our community.
            </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 border-y border-black py-12">
            <div className="text-center">
                <div className="text-5xl font-black mb-2">15k+</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Students Served Free</div>
            </div>
            <div className="text-center border-l-0 md:border-l border-r-0 md:border-r border-gray-200">
                <div className="text-5xl font-black mb-2">40+</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500">New Commissions</div>
            </div>
            <div className="text-center">
                <div className="text-5xl font-black mb-2">₹20Cr</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Endowment Goal</div>
            </div>
        </div>

        {/* Donor Wall */}
        <div className="mb-24">
            <h2 className="text-center text-sm font-bold uppercase tracking-[0.2em] mb-12 text-gray-400">We Gratefully Acknowledge</h2>
            
            <div className="max-w-4xl mx-auto text-center space-y-16">
                
                {/* Founding Benefactors */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">Founding Benefactors</h3>
                    <div className="text-3xl md:text-4xl font-serif italic leading-relaxed space-y-2 text-gray-900">
                        <p>The Sarabhai Foundation</p>
                        <p>J.S. & K.L. Mehta Trust</p>
                        <p>Government of Gujarat</p>
                        <p>The Adani Cultural Initiative</p>
                    </div>
                </div>

                {/* Major Donors */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Major Donors</h3>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-lg text-gray-600">
                        <p>Arvind Ltd. & The Lalbhai Family</p>
                        <p>Torrent Group</p>
                        <p>Zydus Foundation</p>
                        <p>Raj & Dipti Parekh</p>
                        <p>The Ahmedabad Art Society</p>
                        <p>Reliance Foundation</p>
                    </div>
                </div>

                {/* Patron Circle */}
                <div>
                    <h3 className="text-lg font-bold mb-6">Patron Circle</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 text-left">
                        <p>Aarav Patel</p>
                        <p>Meera Shah</p>
                        <p>Vikram Sethi</p>
                        <p>Ananya Gupta</p>
                        <p>Rohan & Priya Desai</p>
                        <p>Kiran Bedi</p>
                        <p>Sanjay Dutt</p>
                        <p>Ishaan Khatter</p>
                        <p>Neha Dhupia</p>
                        <p>Manish Malhotra</p>
                        <p>Farhan Akhtar</p>
                        <p>Gauri Khan</p>
                        <p>Rahul Khanna</p>
                        <p>Twinkle Khanna</p>
                        <p>Vikas Khanna</p>
                        <p>Masaba Gupta</p>
                    </div>
                    <p className="mt-8 text-xs text-gray-400 italic">List updated as of October 1, 2024</p>
                </div>

            </div>
        </div>

        {/* Ways to Give */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-20">
            <h2 className="text-3xl font-black tracking-tighter mb-12 text-center">Ways to Support</h2>
            <div className="grid md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Individual Giving</h3>
                    <p className="text-gray-600 mb-6 text-sm">Join our Patron Circle or make a one-time donation to support specific exhibitions.</p>
                    <Link to="/donate" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600">
                        Make a Donation
                    </Link>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Handshake className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Corporate Sponsorship</h3>
                    <p className="text-gray-600 mb-6 text-sm">Align your brand with creativity and innovation. Sponsor an exhibition or event.</p>
                    <Link to="/corporate" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600">
                        Contact Development
                    </Link>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Planned Giving</h3>
                    <p className="text-gray-600 mb-6 text-sm">Include MOCA Gandhinagar in your estate plans to leave a lasting legacy for the arts.</p>
                    <button className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600">
                        Learn More
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PatronsPage;
