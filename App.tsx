
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import MuseumGalleryScroll from './components/MuseumGalleryScroll';
import CollectionHighlights from './components/CollectionHighlights';
import ShopHighlights from './components/ShopHighlights';
import VisitInfo from './components/VisitInfo';
import Footer from './components/Footer';
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
import CollectablesPage from './components/CollectablesPage';
import OrderStatusPage from './components/OrderStatusPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import RefundPolicy from './components/RefundPolicy';
import CuratorChat from './components/CuratorChat';
import { getPageAssets } from './services/data';
import { PageAssets } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <div className="relative z-10 bg-white">
      <MuseumGalleryScroll />
      <CollectionHighlights />
      <ShopHighlights />
      <VisitInfo />
    </div>
  </>
);

const VisitPage = () => {
    const [assets, setAssets] = useState<PageAssets | null>(null);
    useEffect(() => { setAssets(getPageAssets()); }, []);
    if (!assets) return null;
    return (
        <div className="pt-10">
            <div className="max-w-[1600px] mx-auto px-6 mb-12">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8">Visit Us</h1>
                <div className="w-full aspect-[21/9] rounded-sm overflow-hidden mb-20 shadow-2xl">
                    <img src={assets.visit.hero} className="w-full h-full object-cover" alt="Museum Entry" />
                </div>
            </div>
            <VisitInfo />
        </div>
    );
};

const Layout: React.FC = () => {
    const location = useLocation();
    const showChat = !['/admin'].includes(location.pathname);

    return (
        <div className="font-sans text-black selection:bg-black selection:text-white">
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/exhibitions" element={<ExhibitionsPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/visit" element={<VisitPage />} />
                <Route path="/whatson" element={<CalendarPage />} />
                <Route path="/shop" element={<CollectablesPage />} />
                <Route path="/order-status" element={<OrderStatusPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/patrons" element={<PatronsPage />} />
                <Route path="/volunteer" element={<VolunteerPage />} />
                <Route path="/corporate" element={<CorporateSupportPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/refund" element={<RefundPolicy />} />
            </Routes>
            <Footer />
            
            {showChat && <CuratorChat />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <LoadingScreen />
      <Layout />
    </Router>
  );
};

export default App;
