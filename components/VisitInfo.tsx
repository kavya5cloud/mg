
import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Calendar, ExternalLink, Ticket, Car, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPageAssets } from '../services/data';
import { PageAssets } from '../types';

const VisitInfo: React.FC = () => {
  const [assets, setAssets] = useState<PageAssets | null>(null);

  useEffect(() => {
    setAssets(getPageAssets());
  }, []);

  if (!assets) return null;

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
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Opening Hours</h3>
                        </div>
                        <ul className="w-full space-y-4 text-gray-600">
                            <li className="flex justify-between w-full max-w-md border-b border-gray-200 pb-2">
                                <span className="font-semibold text-black">Operating Schedule</span> 
                                <span className="text-right font-medium">{assets.visit.hours}</span>
                            </li>
                            <li className="flex justify-between w-full max-w-md border-b border-gray-200 pb-2">
                                <span className="font-semibold text-black">Mondays</span> 
                                <span className="uppercase text-[10px] font-black tracking-widest bg-gray-200 px-2 py-0.5 rounded">Closed</span>
                            </li>
                            <li className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-black text-left">Last entry 45 mins before closing</li>
                        </ul>
                    </div>

                    {/* Admission */}
                    <div className="flex flex-col items-start border-b border-gray-300 pb-12">
                         <div className="flex items-center gap-4 mb-6">
                             <Ticket className="w-6 h-6 text-black" />
                             <h3 className="text-2xl font-bold uppercase tracking-tight">Admission</h3>
                         </div>
                         <p className="text-gray-600 mb-8 max-w-md leading-relaxed font-medium">
                            {assets.visit.admissionInfo}
                         </p>
                         <Link to="/booking" className="bg-black text-white px-10 py-5 font-black text-xs hover:bg-gray-800 transition-all uppercase tracking-widest w-full sm:w-auto text-center shadow-xl active:scale-95">
                            Get Free Tickets
                         </Link>
                    </div>

                    {/* Logistics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Parking */}
                        <div className="flex flex-col items-start">
                             <div className="flex items-center gap-4 mb-4">
                                 <Car className="w-5 h-5 text-black" />
                                 <h4 className="text-sm font-black uppercase tracking-widest">Parking</h4>
                             </div>
                             <p className="text-gray-500 text-sm leading-relaxed">{assets.visit.parkingInfo}</p>
                        </div>
                        {/* Accessibility */}
                        <div className="flex flex-col items-start">
                             <div className="flex items-center gap-4 mb-4">
                                 <Accessibility className="w-5 h-5 text-black" />
                                 <h4 className="text-sm font-black uppercase tracking-widest">Accessibility</h4>
                             </div>
                             <p className="text-gray-500 text-sm leading-relaxed">{assets.visit.accessibilityInfo}</p>
                        </div>
                    </div>
                </div>

                {/* Map Column */}
                <div className="flex flex-col h-full">
                     <div className="flex flex-col items-start mb-6">
                        <div className="flex items-center gap-4 mb-2">
                             <MapPin className="w-6 h-6 text-black" />
                             <h3 className="text-2xl font-bold uppercase tracking-tight">Getting Here</h3>
                        </div>
                        <p className="text-gray-600 pl-10 text-lg mb-4 font-medium">{assets.visit.locationText}</p>
                        <a 
                            href={assets.visit.googleMapsLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                        >
                            Open in Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                     </div>
                     <div className="relative w-full h-full min-h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-100">
                        <iframe 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(assets.visit.locationText)}&z=17&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) invert(5%)' }}
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
