
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, BookOpen, Check } from 'lucide-react';

const VolunteerPage: React.FC = () => {
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
          <h2 className="text-4xl font-black mb-4 tracking-tight">Thank You</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We have received your volunteer interest form. Our community coordinator will reach out to you within 3-5 business days.
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
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Volunteer</h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Become a vital part of MOCA Gandhinagar. Our volunteers share their passion for art, engage with visitors, and support our daily operations.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
            <div>
                <h3 className="text-2xl font-bold mb-8">Opportunities</h3>
                
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Visitor Services</h4>
                            <p className="text-gray-600">Welcome guests, provide wayfinding assistance, and help with ticket scanning. You are the face of the museum.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Docent Program</h4>
                            <p className="text-gray-600">Lead guided tours for schools and public groups. Training in modern art history and gallery teaching is provided.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Special Events</h4>
                            <p className="text-gray-600">Assist during exhibition openings, artist talks, and workshops. Perfect for those with flexible schedules.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
                    <h4 className="font-bold mb-4">Benefits</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full" /> Unlimited free admission</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full" /> 20% discount at the Museum Shop & Cafe</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full" /> Invitation to annual Volunteer Appreciation Party</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg h-fit">
                <h3 className="text-2xl font-bold mb-6">Interest Form</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">First Name</label>
                            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Last Name</label>
                            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                        <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Area of Interest</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black">
                            <option>Visitor Services</option>
                            <option>Docent Program</option>
                            <option>Special Events</option>
                            <option>Administrative Support</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Why do you want to volunteer?</label>
                        <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors">
                        Submit Application
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerPage;
