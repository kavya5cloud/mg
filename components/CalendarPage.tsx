import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const events = [
    {
        id: 1,
        title: "Curator's Talk: Modernism in Gujarat",
        type: "Talk",
        date: "Today, 4:00 PM",
        location: "Auditorium",
        image: "https://picsum.photos/id/20/400/300"
    },
    {
        id: 2,
        title: "Clay & Form: Sculpting Workshop",
        type: "Workshop",
        date: "Sat, Oct 12, 11:00 AM",
        location: "Studio A",
        image: "https://picsum.photos/id/30/400/300"
    },
    {
        id: 3,
        title: "Film Screening: Kurosawa's Dreams",
        type: "Film",
        date: "Sun, Oct 13, 6:00 PM",
        location: "Cinema Hall",
        image: "https://picsum.photos/id/40/400/300"
    },
    {
        id: 4,
        title: "Gallery Walk: The Abstract Mind",
        type: "Tour",
        date: "Tue, Oct 15, 2:00 PM",
        location: "Gallery 3",
        image: "https://picsum.photos/id/50/400/300"
    }
];

const CalendarPage: React.FC = () => {
  return (
    <div className="pt-10 min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 mb-20">
         <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-6xl font-black mb-6 tracking-tighter">What's On</h1>
            <div className="flex gap-4 border-b border-gray-300 pb-4 overflow-x-auto">
                {['All', 'Today', 'This Week', 'Talks', 'Workshops', 'Films'].map(filter => (
                    <button key={filter} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-colors whitespace-nowrap">
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            {events.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group cursor-pointer">
                    <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">{event.type}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-700">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{event.date}</span>
                            </div>
                             <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                            Book Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;