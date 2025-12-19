
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
                <RefreshCw className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Refund Policy</h1>
        </div>
        
        <div className="prose prose-lg text-gray-600 leading-relaxed">
            <h3 className="text-xl font-bold text-black mt-8 mb-4">1. Museum Entry</h3>
            <p>Admission to MOCA Gandhinagar is free for all visitors. Therefore, no refunds are applicable for general entry tickets.</p>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">2. MOCA Collectables</h3>
            <p>If you are not entirely satisfied with your purchase from MOCA Collectables, we're here to help.</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Returns:</strong> You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</li>
                <li><strong>Refunds:</strong> Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</li>
            </ul>

            <h3 className="text-xl font-bold text-black mt-8 mb-4">3. Donations</h3>
            <p>Donations made to MOCA Gandhinagar are generally non-refundable. If you have made an error in making your donation or change your mind about contributing to MOCA, please contact us at mocagandhinagar@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
