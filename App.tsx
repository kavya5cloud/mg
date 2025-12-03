
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ExhibitionGrid from './components/ExhibitionGrid';
import CollectionHighlights from './components/CollectionHighlights';
import VisitInfo from './components/VisitInfo';
import Footer from './components/Footer';
import CuratorChat from './components/CuratorChat';
import ExhibitionsPage from './components/ExhibitionsPage';
import CollectionPage from './components/CollectionPage';
import CalendarPage from './components/CalendarPage';
import LoadingScreen from './components/LoadingScreen';
import BookingPage from './components/BookingPage';
import AdminPage from './components/AdminPage';
import AboutPage from './components/AboutPage';
import MembershipPage from './components/MembershipPage';
import PatronsPage from './components/PatronsPage';
import VolunteerPage from './components/VolunteerPage';
import CorporateSupportPage from './components/CorporateSupportPage';
import DonatePage from './components/DonatePage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <ExhibitionGrid />
    <CollectionHighlights />
    <VisitInfo />
  </>
);

const VisitPage = () => (
    <div className="pt-10">
        <div className="max-w-[1200px] mx-auto px-6 mb-20">
            <h1 className="text-6xl font-black mb-8 tracking-tighter">Plan Your Visit</h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-12">
                Tickets are released every Tuesday at 10:00 a.m. Member tickets are available at any time.
            </p>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-gray-100 p-8 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4">General Admission</h2>
                    <p className="mb-6">Access to all galleries and special exhibitions.</p>
                    <div className="flex justify-between items-center border-b border-gray-300 py-3">
                        <span>Adults</span>
                        <span className="font-bold">₹500</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-300 py-3">
                        <span>Students</span>
                        <span className="font-bold">₹200</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-gray-300 py-3">
                        <span>Children (under 12)</span>
                        <span className="font-bold">Free</span>
                    </div>
                    <Link to="/booking" className="block w-full text-center bg-black text-white py-4 mt-8 font-bold hover:bg-gray-800 transition-colors">Select Date</Link>
                </div>
                 <div className="border border-black p-8 rounded-xl flex flex-col justify-center text-center">
                    <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
                    <p className="mb-6 text-gray-600">Join today for free unlimited admission, exclusive previews, and more.</p>
                    <Link to="/membership" className="block w-full border-2 border-black text-black py-4 font-bold hover:bg-black hover:text-white transition-colors">Join Now</Link>
                </div>
            </div>
        </div>
        <VisitInfo />
    </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
        {loading && <LoadingScreen />}
        <ScrollToTop />
        <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={
                <>
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/visit" element={<VisitPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/exhibitions" element={<ExhibitionsPage />} />
                            <Route path="/collection" element={<CollectionPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/booking" element={<BookingPage />} />
                            <Route path="/membership" element={<MembershipPage />} />
                            <Route path="/patrons" element={<PatronsPage />} />
                            <Route path="/volunteer" element={<VolunteerPage />} />
                            <Route path="/corporate" element={<CorporateSupportPage />} />
                            <Route path="/donate" element={<DonatePage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <CuratorChat />
                </>
            } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
