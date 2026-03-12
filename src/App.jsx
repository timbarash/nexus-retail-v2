import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, QrCode, X } from 'lucide-react';
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
  const [cxOpen, setCxOpen] = useState(false);
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
    <div className="min-h-screen bg-surface-bg flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSlackOpen={() => setSlackOpen(true)} onDtchOpen={() => setDtchMode('full')} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* Prototype banner */}
        <div className="bg-[rgba(0,163,94,0.08)] border-b border-surface-border text-[#00a35e] px-4 py-2 text-center text-sm font-medium">
          Prototype: Dutchie Nexus — AI-Powered Command Center for Cannabis Retail
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<NexusHome />} />
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
        onOpenSpace={(spaceId) => { setDtchMode('full'); }}
      />

      {/* CX Prototypes floating button */}
      <div className="fixed bottom-5 right-5 z-50">
        {cxOpen && (
          <div className="absolute bottom-12 right-0 w-56 rounded-xl border border-surface-border bg-white shadow-2xl overflow-hidden mb-2 animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">CX Prototypes</span>
              <button onClick={() => setCxOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="py-1">
              {[
                { to: '/proto/sms', label: 'SMS Micro-Surveys', icon: Smartphone },
                { to: '/proto/emoji', label: 'Emoji Reactions', icon: Monitor },
                { to: '/proto/qr', label: 'QR Captures', icon: QrCode },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setCxOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setCxOpen(!cxOpen)}
          className="w-10 h-10 rounded-full bg-white border border-surface-border text-text-secondary hover:text-text-primary hover:shadow-card-hover transition-all shadow-card flex items-center justify-center text-xs font-bold"
        >
          CX
        </button>
      </div>
    </div>
  );
}
