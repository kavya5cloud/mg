
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Globe } from 'lucide-react';
import { getPageAssets } from '../services/data';
import { PageAssets } from '../types';

const AboutPage: React.FC = () => {
  const [assets, setAssets] = useState<PageAssets | null>(null);

  useEffect(() => {
    setAssets(getPageAssets());
  }, []);

  if (!assets) return null;
  const { about } = assets;

  return (
    <div className="pt-10 min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
        
        {/* Navigation */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">{about.title}</h1>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[21/9] bg-gray-200 mb-16 overflow-hidden rounded-sm">
             <img 
                src={about.hero} 
                alt="MOCA Gandhinagar Architecture" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
             />
        </div>

        {/* Introduction */}
        <div className="grid md:grid-cols-12 gap-12 mb-24">
            <div className="md:col-span-4">
                <span className="block w-12 h-1 bg-black mb-6"></span>
                <h2 className="text-3xl font-bold leading-tight">{about.introTitle}</h2>
            </div>
            <div className="md:col-span-8">
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {about.introPara1}
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                    {about.introPara2}
                </p>
            </div>
        </div>

        {/* Pillars / Values */}
        <div className="grid md:grid-cols-3 gap-12 mb-24 bg-gray-50 p-12 rounded-2xl">
            <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{about.missionTitle}</h3>
                <p className="text-gray-600 leading-relaxed">
                    {about.missionDesc}
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{about.globalTitle}</h3>
                <p className="text-gray-600 leading-relaxed">
                    {about.globalDesc}
                </p>
            </div>
            <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{about.communityTitle}</h3>
                <p className="text-gray-600 leading-relaxed">
                    {about.communityDesc}
                </p>
            </div>
        </div>

        {/* Architecture Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 md:order-1">
                 <h2 className="text-4xl font-black tracking-tight mb-6">{about.archTitle}</h2>
                 <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {about.archPara1}
                 </p>
                 <p className="text-lg text-gray-600 leading-relaxed">
                    {about.archPara2}
                 </p>
            </div>
             <div className="order-1 md:order-2 bg-gray-100 aspect-square overflow-hidden relative">
                <img 
                    src={about.atrium} 
                    alt="Museum Interior" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                    The Main Atrium
                </div>
            </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
            <div className="text-center mb-20">
                 <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Our Team</h2>
                 <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
                 <p className="text-gray-500 max-w-xl mx-auto font-medium">The visionaries behind MOCA's cultural programming and institutional excellence.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                {about.team.map((member) => (
                    <div key={member.id} className="group flex flex-col items-center text-center">
                        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8">
                             {/* Decorative ring */}
                             <div className="absolute inset-0 border-2 border-black/5 rounded-full group-hover:border-black group-hover:scale-105 transition-all duration-500"></div>
                             
                             <div className="absolute inset-2 overflow-hidden rounded-full grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-100">
                                  <img 
                                    src={member.imageUrl} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                  />
                             </div>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* CTA */}
        <div className="border-t border-black pt-16 text-center">
            <h2 className="text-4xl font-bold mb-6">Be Part of Our Story</h2>
            <div className="flex justify-center gap-4">
                <Link to="/visit" className="bg-black text-white px-8 py-4 font-bold hover:bg-gray-800 transition-colors">
                    Plan Your Visit
                </Link>
                <Link to="/collection" className="border-2 border-black px-8 py-4 font-bold hover:bg-black hover:text-white transition-colors">
                    Explore Collection
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
