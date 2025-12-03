
import React, { useState, useRef, useEffect } from 'react';
import { Navigation, Info, Coffee, Trees, GalleryVerticalEnd, X } from 'lucide-react';

interface POI {
  id: string;
  x: number; // Percentage on map X
  y: number; // Percentage on map Y
  z: number; // Elevation off ground
  label: string;
  icon: React.ElementType;
  description: string;
  image: string;
}

const ThreeDMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 55, y: 0, z: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<POI | null>(null);
  const [scale, setScale] = useState(1);

  const pointsOfInterest: POI[] = [
    { 
      id: 'main', 
      x: 33, 
      y: 50, 
      z: 80, 
      label: 'Main Galleries', 
      icon: GalleryVerticalEnd, 
      description: 'Housing the permanent collection and major retrospective exhibitions across three floors.',
      image: 'https://picsum.photos/id/433/300/200'
    },
    { 
      id: 'garden', 
      x: 18, 
      y: 18, 
      z: 30, 
      label: 'Sculpture Garden', 
      icon: Trees, 
      description: 'An open-air sanctuary featuring large-scale installations amidst native flora.',
      image: 'https://picsum.photos/id/248/300/200'
    },
    { 
      id: 'cafe', 
      x: 75, 
      y: 70, 
      z: 40, 
      label: 'Museum Cafe', 
      icon: Coffee, 
      description: 'Artisanal refreshments and design objects in the East Annex.',
      image: 'https://picsum.photos/id/225/300/200'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current) {
            const { width } = containerRef.current.getBoundingClientRect();
            // Base logic: The map "world" is 800px wide. 
            // We scale it down if the container is smaller than ~850px.
            const targetBaseSize = 800;
            const padding = 32;
            const availableWidth = width - padding;
            
            let newScale = 1;
            if (availableWidth < targetBaseSize) {
                newScale = availableWidth / targetBaseSize;
            }
            // Clamp scale to keep it reasonable
            setScale(Math.max(0.4, Math.min(newScale, 1)));
        }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    
    // Initial call
    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  const calculateRotation = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const rotateX = 50 + (yPct * 15); // Tilt range
    const rotateZ = -10 + (xPct * 20); // Rotation range
    
    return { x: rotateX, y: 0, z: rotateZ };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || selectedLocation) return;
    const rect = containerRef.current.getBoundingClientRect();
    setRotation(calculateRotation(e.clientX, e.clientY, rect));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || selectedLocation) return;
    // Prevent default slightly to allow partial map nav, but be careful blocking scroll
    // e.preventDefault(); 
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setRotation(calculateRotation(touch.clientX, touch.clientY, rect));
  };

  const handleMouseLeave = () => {
    if (!selectedLocation) {
        setRotation({ x: 55, y: 0, z: 0 });
        setIsHovering(false);
    }
  };

  // Helper to render simple 3D trees
  const Tree = ({ top, left, delay }: { top: string, left: string, delay: string }) => (
    <div 
        className="absolute w-4 h-4 transform-style-3d flex items-end justify-center pointer-events-none"
        style={{ top, left, transform: 'translateZ(0px)' }}
    >
        {/* Trunk */}
        <div className="w-1 h-3 bg-amber-900 mx-auto"></div>
        {/* Foliage */}
        <div className="absolute bottom-3 w-6 h-6 bg-green-500 rounded-full shadow-lg transform-style-3d group-hover:scale-110 transition-transform duration-700 ease-in-out">
            <div className="absolute inset-0 bg-green-400 rounded-full translate-z-[2px] scale-90"></div>
            <div className="absolute inset-0 bg-green-300 rounded-full translate-z-[4px] scale-75"></div>
        </div>
    </div>
  );

  return (
    <div className="w-full h-full min-h-[450px] bg-[#f0f0f0] overflow-hidden relative group rounded-xl select-none" onMouseEnter={() => setIsHovering(true)}>
       {/* Overlay UI: Top Left Title */}
       <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: selectedLocation ? 0 : 1 }}>
          <h3 className="text-xl md:text-2xl font-black tracking-tighter mb-1">SECTOR 10</h3>
          <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">Gandhinagar, Gujarat</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] md:text-xs text-black font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-full w-fit">
            <Info className="w-3 h-3" /> Interact with pins
          </div>
       </div>

       {/* Open Maps Button */}
       <a 
         href="https://maps.app.goo.gl/qjfP58WXsD3QurcM7?g_st=ipc" 
         target="_blank" 
         rel="noreferrer"
         className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 bg-black text-white px-4 py-2 md:px-5 md:py-3 text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg rounded-full"
       >
         <Navigation className="w-3 h-3 md:w-4 md:h-4" />
         <span>Open Maps</span>
       </a>

       {/* Detail Card Overlay - Responsive Width */}
       <div className={`absolute top-4 left-4 md:top-6 md:left-6 z-30 w-[calc(100%-2rem)] md:w-80 max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-out transform ${selectedLocation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {selectedLocation && (
              <>
                <div className="h-28 md:h-32 overflow-hidden relative">
                    <img src={selectedLocation.image} alt={selectedLocation.label} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setSelectedLocation(null)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-1 rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <selectedLocation.icon className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Point of Interest</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">{selectedLocation.label}</h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">{selectedLocation.description}</p>
                    <button className="text-xs font-bold underline underline-offset-4 hover:text-gray-600">
                        View Events Here
                    </button>
                </div>
              </>
          )}
       </div>

      {/* 3D Scene Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center perspective-[1200px] touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedLocation(null)}
      >
        {/* World Plane - Scalable Wrapper */}
        <div 
          className="relative w-[800px] h-[800px] transition-transform duration-300 ease-out preserve-3d origin-center"
          style={{
            transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ground Grid (The Map) */}
          <div className="absolute inset-0 bg-[#f8f8f8] shadow-2xl border-[10px] border-white transform-style-3d overflow-hidden rounded-sm" onClick={(e) => e.stopPropagation()}>
             
             {/* Roads */}
             <div className="absolute top-0 left-1/3 w-16 h-full bg-gray-200 pointer-events-none"></div>
             <div className="absolute top-0 right-1/4 w-12 h-full bg-gray-200 pointer-events-none"></div>
             <div className="absolute top-1/2 left-0 w-full h-20 bg-gray-200 -translate-y-1/2 pointer-events-none"></div>
             <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gray-200 pointer-events-none"></div>

             {/* Green Zones (Parks) */}
             <div className="absolute top-10 left-10 w-48 h-64 bg-[#e6f5e6] border-2 border-[#d0e8d0] rounded-sm pointer-events-none"></div>
             <div className="absolute bottom-20 right-10 w-64 h-40 bg-[#e6f5e6] border-2 border-[#d0e8d0] rounded-sm pointer-events-none"></div>
             
             {/* Trees */}
             <Tree top="15%" left="15%" delay="0" />
             <Tree top="25%" left="18%" delay="100" />
             <Tree top="12%" left="22%" delay="200" />
             <Tree top="30%" left="10%" delay="300" />
             
             <Tree top="70%" left="75%" delay="0" />
             <Tree top="75%" left="80%" delay="100" />
             <Tree top="68%" left="85%" delay="200" />
             
             <Tree top="40%" left="40%" delay="150" />
             <Tree top="42%" left="60%" delay="250" />
             
             {/* Interactive Pins */}
             {pointsOfInterest.map((poi) => (
                 <button
                    key={poi.id}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent map click (reset)
                        setSelectedLocation(poi);
                    }}
                    className="absolute group transform-style-3d cursor-pointer z-50 focus:outline-none"
                    style={{
                        left: `${poi.x}%`,
                        top: `${poi.y}%`,
                        transform: `translateZ(${poi.z}px)`,
                    }}
                 >
                     {/* The Billboard Container: Counter-rotates to face camera */}
                     <div 
                        className="relative flex flex-col items-center transition-transform duration-100"
                        style={{
                            transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`
                        }}
                     >
                        <div className={`
                             flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full shadow-xl transition-all duration-300
                             ${selectedLocation?.id === poi.id ? 'scale-125 bg-gray-800' : 'hover:scale-110 hover:bg-gray-800'}
                        `}>
                            <poi.icon className="w-3 h-3" />
                            <span className="text-xs font-bold whitespace-nowrap">{poi.label}</span>
                        </div>
                        <div className={`w-0.5 h-8 bg-black transition-all duration-300 ${selectedLocation?.id === poi.id ? 'h-12' : ''}`}></div>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                     </div>
                 </button>
             ))}

          </div>

          {/* MOCA Building (3D Box) */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 transform-style-3d pointer-events-none transition-transform duration-500 z-10">
             {/* Shadow */}
             <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-black/20 blur-xl rounded-full -translate-x-1/2 -translate-y-1/2 rotate-x-90 translate-z-[-2px]"></div>
             
             {/* Main Building Structure */}
             <div className="relative w-32 h-24 transform-style-3d">
                {/* Front */}
                <div className="absolute inset-0 bg-white translate-z-[16px] flex items-center justify-center border border-gray-100 shadow-inner">
                   <div className="text-black font-black text-lg tracking-tighter border-2 border-black px-2">MOCA</div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gray-100 translate-z-[-16px]"></div>
                {/* Right */}
                <div className="absolute inset-0 bg-gray-200 rotate-y-90 translate-z-[16px] w-[32px] left-[calc(100%-16px)]"></div>
                {/* Left */}
                <div className="absolute inset-0 bg-gray-200 rotate-y-[-90] translate-z-[16px] w-[32px] left-[-16px]"></div>
                {/* Top */}
                <div className="absolute inset-0 bg-white rotate-x-90 translate-z-[16px] h-[32px] top-[-16px]"></div>
             </div>

             {/* Building Annex (Lower part) */}
             <div className="absolute -right-12 bottom-0 w-16 h-16 bg-gray-50 transform-style-3d translate-z-[8px]">
                <div className="absolute inset-0 bg-white translate-z-[8px] border border-gray-100"></div>
                <div className="absolute inset-0 bg-gray-50 rotate-x-90 translate-z-[8px] h-[16px] top-[-8px]"></div>
                <div className="absolute inset-0 bg-gray-100 rotate-y-90 translate-z-[8px] w-[16px] left-[calc(100%-8px)]"></div>
             </div>
          </div>
          
          {/* Nearby Buildings (Context) */}
          <div className="absolute top-[20%] right-[20%] w-24 h-24 bg-gray-100 translate-z-[10px] transform-style-3d opacity-80 pointer-events-none">
              <div className="absolute inset-0 bg-gray-200 translate-z-[20px] border border-white"></div>
              <div className="absolute inset-0 bg-gray-300 rotate-x-90 translate-z-[20px] h-[40px] top-[-20px]"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThreeDMap;
