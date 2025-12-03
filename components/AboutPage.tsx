
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-10 min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
        
        {/* Navigation */}
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">Our Story</h1>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[21/9] bg-gray-200 mb-16 overflow-hidden rounded-sm">
             <img 
                src="https://picsum.photos/id/122/1600/600" 
                alt="MOCA Gandhinagar Architecture" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
             />
        </div>

        {/* Introduction */}
        <div className="grid md:grid-cols-12 gap-12 mb-24">
            <div className="md:col-span-4">
                <span className="block w-12 h-1 bg-black mb-6"></span>
                <h2 className="text-3xl font-bold leading-tight">A new cultural landmark in the heart of the Green City.</h2>
            </div>
            <div className="md:col-span-8">
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Established in 2024, the Museum of Contemporary Art Gandhinagar (MOCA) stands as a testament to the evolving cultural landscape of Gujarat. Located in Sector 10, amidst the disciplined grid and lush greenery of Gandhinagar, MOCA is not just a repository of objects, but a living, breathing space for dialogue, experimentation, and discovery.
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                    We believe that modern art is a mirror to society. Our institution is dedicated to presenting the most thought-provoking art of our time, bridging the gap between local heritage and global contemporary movements.
                </p>
            </div>
        </div>

        {/* Pillars / Values */}
        <div className="grid md:grid-cols-3 gap-12 mb-24 bg-gray-50 p-12 rounded-2xl">
            <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                    To inspire creativity and critical thinking through the presentation, collection, and preservation of modern and contemporary art. We aim to be a catalyst for cultural exchange in the region.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Global Perspective</h3>
                <p className="text-gray-600 leading-relaxed">
                    While deeply rooted in the Indian context, MOCA Gandhinagar fosters an international outlook, collaborating with artists and institutions worldwide to bring diverse narratives to our audience.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
                    <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Community First</h3>
                <p className="text-gray-600 leading-relaxed">
                    We are committed to accessibility and education. Through workshops, lectures, and free school programs, we strive to make contemporary art accessible to everyone in Gandhinagar and beyond.
                </p>
            </div>
        </div>

        {/* Architecture Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
                 <h2 className="text-4xl font-black tracking-tight mb-6">Architecture & Space</h2>
                 <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    The MOCA building itself is a work of art. Designed to reflect the modernist planning principles of Le Corbusier—who influenced the region's architecture—the museum features clean lines, raw concrete surfaces, and expansive light-filled galleries.
                 </p>
                 <p className="text-lg text-gray-600 leading-relaxed">
                    Spanning 40,000 square feet across three levels, the space includes flexible exhibition halls, a dedicated new media wing, a sculpture garden, and a research library. The architecture emphasizes transparency, inviting the surrounding parkland into the museum experience.
                 </p>
            </div>
             <div className="order-1 md:order-2 bg-gray-100 aspect-square overflow-hidden relative">
                <img 
                    src="https://picsum.photos/id/238/800/800" 
                    alt="Museum Interior" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                    The Main Atrium
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="border-t border-black pt-16 text-center">
            <h2 className="text-4xl font-bold mb-6">Be Part of Our Story</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Whether you are an artist, a student, or an art lover, MOCA Gandhinagar welcomes you. Join us in shaping the future of art in Gujarat.
            </p>
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
