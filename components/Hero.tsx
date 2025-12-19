
import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80, 
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] bg-white flex flex-col justify-center overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-start leading-[0.85] select-none py-10 relative z-10">
        
        <div className={`transition-all duration-1000 ease-out delay-0 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
            <div style={{ transform: `translateY(${scrollY * 0.15}px)` }} className="will-change-transform">
                <h1 className="text-[17vw] font-semibold tracking-tighter text-black m-0 z-10 transition-all duration-700 ease-out hover:tracking-wide cursor-default">
                MOCA
                </h1>
            </div>
        </div>

        <div className={`transition-all duration-1000 ease-out delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
             <div style={{ transform: `translateY(${scrollY * 0.08}px)` }} className="will-change-transform">
                <h1 className="text-[17vw] font-semibold tracking-tighter text-gray-300 m-0 z-0 transition-all duration-700 ease-out hover:tracking-wide cursor-default">
                GANDHI
                </h1>
            </div>
        </div>

        <div className={`transition-all duration-1000 ease-out delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
             <div style={{ transform: `translateY(${scrollY * 0.2}px)` }} className="will-change-transform">
                <h1 className="text-[17vw] font-semibold tracking-tighter text-black m-0 z-10 transition-all duration-700 ease-out hover:tracking-wide cursor-default">
                NAGAR
                </h1>
            </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToContent}
        className={`absolute bottom-10 left-6 md:left-12 lg:left-16 flex items-center gap-3 group cursor-pointer transition-all duration-1000 delay-700 z-20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        aria-label="Scroll down to view museum gallery"
      >
         <div className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center group-hover:border-black transition-colors">
            <ArrowDown className="w-4 h-4 text-black" strokeWidth={1} />
         </div>
         <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">
           SCROLL
         </span>
      </button>
    </section>
  );
};

export default Hero;
