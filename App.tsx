
import React, { useEffect } from 'react';
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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import RefundPolicy from './components/RefundPolicy';
import CuratorChat from './components/CuratorChat';

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

const Layout: React.FC = () => {
    const location = useLocation();
    // Hide chat on admin page to avoid covering controls
    const showChat = !['/admin'].includes(location.pathname);

    return (
        <div className="font-sans text-black selection:bg-black selection:text-white">
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/exhibitions" element={<ExhibitionsPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/visit" element={<CalendarPage />} />
                <Route path="/shop" element={<CollectablesPage />} />
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
