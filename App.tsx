
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ExhibitionGrid from './components/ExhibitionGrid';
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
      <ExhibitionGrid />
      <CollectionHighlights />
      <ShopHighlights />
      <VisitInfo />
    </div>
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <LoadingScreen />
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
