
import React from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisitInfo: React.FC = () => {
  return (
    <section className="py-24 bg-[#F5F5F5]">
       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Info Text Column */}
                <div className="flex flex-col gap-12">
                    {/* Hours */}
                    <div className="flex flex-col items-start border-b border-gray-300 pb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <Clock className="w-6 h-6 text-black" />
                            <h3 className="text-2xl font-bold">Opening Hours</h3>
                        </div>
                        <ul className="w-full space-y-4 text-gray-600">
                            <li className="flex justify-between w-full max-w-md border-b border-gray-200 pb-2"><span className="font-semibold text-black">Monday</span> <span>Closed</span></li>
                            <li className="flex justify-between w-full max-w-md border-b border-gray-200 pb-2"><span className="font-semibold text-black">Tuesday — Sunday</span> <span>10:30 — 18:00</span></li>
                            <li className="text-xs text-gray-400 mt-2 uppercase tracking-wide">Last entry at 17:15</li>
                        </ul>
                    </div>

                    {/* Planning */}
                    <div className="flex flex-col items-start">
                         <div className="flex items-center gap-4 mb-6">
                             <Calendar className="w-6 h-6 text-black" />
                             <h3 className="text-2xl font-bold">Plan Your Visit</h3>
                         </div>
                         <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                            Book tickets online to skip the line. Members enjoy free access all year round. We recommend allowing at least 2 hours for your visit.
                         </p>
                         <Link to="/booking" className="bg-black text-white px-8 py-4 font-bold text-sm hover:bg-gray-800 transition-colors uppercase tracking-wider w-full sm:w-auto text-center">
                            Get Tickets
                         </Link>
                    </div>
                </div>

                {/* Map Column */}
                <div className="flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-6">
                        <MapPin className="w-6 h-6 text-black" />
                        <h3 className="text-2xl font-bold">Getting Here</h3>
                     </div>
                     <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.237937416382!2d72.64686431496796!3d23.23441598484606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b9365555555%3A0x0!2sSector%2010%2C%20Gandhinagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1625634567890!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%)' }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="MOCA Gandhinagar Location Map"
                        ></iframe>
                     </div>
                </div>
            </div>
       </div>
    </section>
  );
};

export default VisitInfo;
