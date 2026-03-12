import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import CompositeScorecard from './pages/CompositeScorecard';
import StateAnalysis from './pages/StateAnalysis';
import SocialRedditPulse from './pages/SocialRedditPulse';
import NewsInvestorSentiment from './pages/NewsInvestorSentiment';
import ReviewExplorer from './pages/ReviewExplorer';
import LocationInsights from './pages/LocationInsights';
import CompetitiveInsights from './pages/CompetitiveInsights';
import VoiceAI from './pages/VoiceAI';
import Methodology from './pages/Methodology';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="ml-3">
            <span className="text-lg font-semibold text-navy-800">AWH Sentiment Analysis</span>
            <p className="text-xs text-panel-300 hidden sm:block">Consumer Intelligence Dashboard</p>
          </div>
        </div>

        {/* Prototype banner */}
        <div className="bg-gradient-to-r from-dutchie-900 to-navy-800 px-4 py-2 text-center text-sm font-medium text-white">
          Prototype: Dutchie Consumer Sentiment Intelligence Platform — Real-time insights from across the cannabis ecosystem
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/scorecard" element={<CompositeScorecard />} />
            <Route path="/states" element={<StateAnalysis />} />
            <Route path="/social" element={<SocialRedditPulse />} />
            <Route path="/news" element={<NewsInvestorSentiment />} />
            <Route path="/reviews" element={<ReviewExplorer />} />
            <Route path="/locations" element={<LocationInsights />} />
            <Route path="/competitive" element={<CompetitiveInsights />} />
            <Route path="/voice-ai" element={<VoiceAI />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
