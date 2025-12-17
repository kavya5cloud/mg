
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
                <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-lg text-gray-600 leading-relaxed">
            <p className="font-bold text-black">Last Updated: October 2024</p>
            <p>At MOCA Gandhinagar, we are committed to protecting your personal information and your right to privacy.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">1. Information We Collect</h3>
            <p>We collect personal information that you voluntarily provide to us when you register for tickets, sign up for our newsletter, or make a purchase from our shop. This includes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name and Contact Data (Email address, phone number).</li>
                <li>Booking details (Date of visit, number of guests).</li>
            </ul>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">2. How We Use Your Information</h3>
            <p>We use your personal information for these purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To facilitate ticket booking and entry management.</li>
                <li>To send administrative information (ticket confirmations, schedule changes).</li>
                <li>To protect our services and visitors.</li>
            </ul>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">3. Sharing Information</h3>
            <p>We do not sell your personal data. We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">4. Contact Us</h3>
            <p>If you have questions or comments about this policy, you may email us at info@mocagandhinagar.org.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
