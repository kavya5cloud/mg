
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Terms of Use</h1>
        </div>
        
        <div className="prose prose-lg text-gray-600 leading-relaxed">
            <p className="font-bold text-black">Last Updated: October 2024</p>
            <p>Welcome to MOCA Gandhinagar. By accessing our website and visiting our museum, you agree to be bound by these terms.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">1. Visitor Conduct</h3>
            <p>Visitors are expected to respect the artwork, the facilities, and other visitors. Touching artwork (unless specified as interactive) is strictly prohibited. MOCA reserves the right to ask any visitor to leave if their behavior is deemed inappropriate.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">2. Ticketing</h3>
            <p>Entry to MOCA Gandhinagar is free of charge. However, registration is required for capacity management. Tickets are non-transferable and valid only for the date and time specified.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">3. Intellectual Property</h3>
            <p>The content on this website, including text, graphics, logos, and images, is the property of MOCA Gandhinagar or its content suppliers and is protected by copyright laws.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">4. Photography</h3>
            <p>Non-commercial photography without flash is permitted in the galleries unless otherwise noted. Tripods and selfie sticks are not permitted.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
