
import React, { useEffect, useState, useRef } from 'react';
import { getHomepageGallery } from '../services/data';

interface Track {
  speed: number;
  direction: number;
  images: string[];
}

const MuseumGalleryScroll: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load dynamic data
    setTracks(getHomepageGallery());

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const offset = window.innerHeight - rect.top;
        if (offset > 0) {
            setScrollY(offset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (tracks.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-48 overflow-hidden" aria-label="Museum Gallery Showcase">
      <div className="max-w-[1600px] mx-auto px-6 mb-20 flex flex-col items-start">
         <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">The Choreography of Light & Void</span>
         <h2 className="text-5xl md:text-8xl font-black tracking-tighter max-w-4xl leading-[0.9]">
           Where silence speaks in the <span className="text-gray-300">language of form.</span>
         </h2>
      </div>

      <div className="space-y-8 md:space-y-12">
        {tracks.map((track, trackIdx) => (
          <div 
            key={trackIdx} 
            className="flex gap-8 md:gap-12 whitespace-nowrap will-change-transform"
            style={{ 
              transform: `translateX(${scrollY * track.speed * track.direction}px)` 
            }}
          >
            {/* Repeat images for overflow */}
            {[...track.images, ...track.images, ...track.images].map((src, imgIdx) => (
              <div 
                key={imgIdx} 
                className="inline-block shrink-0 relative group"
              >
                <img 
                  src={src} 
                  alt={`Perspective of MOCA Architecture ${imgIdx + 1}`} 
                  className="h-[300px] md:h-[500px] w-auto object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 ease-in-out cursor-crosshair border border-black/5"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white px-3 py-1.5">Curated Stillness</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto px-6 mt-20 flex justify-end">
          <div className="max-w-md text-right">
              <p className="text-sm text-gray-400 font-medium leading-relaxed italic mb-4">
                "Our galleries are a brutalist whisper in a world of noise. We believe that art doesn't just hang on a wall; it lives in the air between the viewer and the concrete."
              </p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black">— MOCA Design Philosophy</span>
          </div>
      </div>
    </section>
  );
};

export default MuseumGalleryScroll;
