import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import NexusChat from './components/NexusChat';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import NexusHome from './pages/NexusHome';
import ProtoSMS from './pages/ProtoSMS';
import ProtoEmoji from './pages/ProtoEmoji';
import ProtoQR from './pages/ProtoQR';
import Overview from './pages/Overview';
import BrandAnalysis from './pages/BrandAnalysis';
import LocationInsights from './pages/LocationInsights';
import ReviewExplorer from './pages/ReviewExplorer';
import CompetitiveInsights from './pages/CompetitiveInsights';
import MarketingCampaigns from './pages/MarketingCampaigns';
import ConnectAgent from './pages/ConnectAgent';
import CustomerBridge from './pages/CustomerBridge';
import PricingAgent from './pages/PricingAgent';
import CustomerPortal from './pages/CustomerPortal';
import NexusLanding from './pages/NexusLanding';
import { reviews as allReviews, sources, brands, locations, categories } from './data/mockData';
import { filterReviews } from './utils/helpers';
import { useStores } from './contexts/StoreContext';
import { useDateRange } from './contexts/DateRangeContext';
import DesignReview from './pages/DesignReview';
import NexusMobileApp from './pages/NexusMobileApp';
import SlackPanel from './components/slack/SlackPanel';
import DtchPanel from './components/dtch/DtchPanel';
import CommandPalette from './components/common/CommandPalette';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [dtchMode, setDtchMode] = useState('closed'); // 'closed'|'rail'|'sidebar'|'full'
  const [nexusChatOpen, setNexusChatOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K handler
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const { selectedStoreNames, isAllSelected } = useStores();
  const { startDate, endDate } = useDateRange();
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    sources: [],
    brands: [],
    locations: [],
    sentiments: [],
    categories: [],
    search: '',
  });

  // Sync store selection → filters.locations for analytics pages
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      locations: isAllSelected ? [] : [...selectedStoreNames],
    }));
  }, [selectedStoreNames, isAllSelected]);

  // First filter by date range, then by other filters
  const dateFilteredReviews = useMemo(
    () => allReviews.filter(r => r.date >= startDate && r.date <= endDate),
    [startDate, endDate]
  );

  const filteredReviews = useMemo(
    () => filterReviews(dateFilteredReviews, filters),
    [dateFilteredReviews, filters]
  );

  // Standalone pages rendered outside the app shell (no sidebar, header, footer, banner)
  if (location.pathname === '/design-review') return <DesignReview />;
  if (location.pathname === '/nexus-landing') return <NexusLanding />;
  if (location.pathname === '/nexus-mobile') return <NexusMobileApp />;

  return (
    <div className="min-h-screen bg-[#141210] flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSlackOpen={() => setSlackOpen(true)} onDtchOpen={() => setDtchMode('full')} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* Prototype banner */}
        <div className="bg-[rgba(0,194,124,0.08)] border-b border-[#38332B] text-[#00C27C] px-4 py-2 text-center text-sm font-medium">
          Prototype: Dutchie Nexus — AI-Powered Command Center for Cannabis Retail
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto" style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,194,124,0.02) 0%, rgba(0,194,124,0) 60%), radial-gradient(ellipse 120% 100% at 50% 0%, #181513 0%, #141210 50%)`,
          backgroundColor: '#141210',
          backgroundAttachment: 'fixed',
        }}>
          <Routes>
            <Route path="/" element={<NexusHome onOpenNexus={() => setNexusChatOpen(true)} />} />
            <Route path="/proto/sms" element={<ProtoSMS />} />
            <Route path="/proto/emoji" element={<ProtoEmoji />} />
            <Route path="/proto/qr" element={<ProtoQR />} />
            <Route path="/agents/marketing" element={<MarketingCampaigns />} />
            <Route path="/agents/connect" element={<ConnectAgent />} />
            <Route path="/agents/bridge" element={<CustomerBridge />} />
            <Route path="/portal" element={<CustomerPortal />} />
            <Route path="/nexus-landing" element={<NexusLanding />} />
            <Route path="/pricing" element={<PricingAgent mode="agent" />} />
            <Route path="/agents/pricing" element={<PricingAgent mode="agent" />} />
            <Route path="/overview" element={<Overview reviews={filteredReviews} allReviews={allReviews} filters={filters} onFilterChange={setFilters} />} />
            <Route path="/brands" element={<BrandAnalysis reviews={filteredReviews} />} />
            <Route path="/locations" element={<LocationInsights reviews={filteredReviews} />} />
            <Route path="/reviews" element={<ReviewExplorer reviews={filteredReviews} filters={filters} onFilterChange={setFilters} />} />
            <Route path="/competitive" element={<CompetitiveInsights reviews={filteredReviews} />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <SlackPanel isOpen={slackOpen} onClose={() => setSlackOpen(false)} />
      <DtchPanel mode={dtchMode} onModeChange={setDtchMode} onClose={() => setDtchMode('closed')} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        navigate={navigate}
        onOpenSpace={(spaceId) => { setNexusChatOpen(true); }}
      />

      {/* Nexus AI Chat overlay */}
      <NexusChat isOpen={nexusChatOpen} onClose={() => setNexusChatOpen(false)} />

      {/* Nexus AI floating action button — hidden on home (chat is inline there) */}
      {!nexusChatOpen && location.pathname !== '/' && (
        <button
          onClick={() => setNexusChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#00C27C] text-white shadow-lg animate-fab-spring animate-pulse-glow hover:scale-110 active:scale-95 transition-transform"
          aria-label="Open Nexus AI"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
