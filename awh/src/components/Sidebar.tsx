import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Map,
  MessageCircle,
  Newspaper,
  BookOpen,
  Search,
  MapPin,
  Trophy,
  PhoneCall,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/scorecard', icon: BarChart3, label: 'Scorecard' },
  { to: '/states', icon: Map, label: 'State Analysis' },
  { to: '/social', icon: MessageCircle, label: 'Social Pulse' },
  { to: '/news', icon: Newspaper, label: 'News & Investors' },
  { to: '/reviews', icon: Search, label: 'Review Explorer' },
  { to: '/locations', icon: MapPin, label: 'Location Insights' },
  { to: '/competitive', icon: Trophy, label: 'Competitive' },
];

const aiNavItems = [
  { to: '/voice-ai', icon: PhoneCall, label: 'Voice AI' },
  { to: '/methodology', icon: BookOpen, label: 'Methodology' },
];

function DutchieLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 flex-shrink-0" fill="none">
      <rect width="32" height="32" rx="8" fill="#6ABA48" />
      <path
        d="M10 8.5h5.5c4.14 0 7.5 3.36 7.5 7.5s-3.36 7.5-7.5 7.5H10V8.5z"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavItem({ item, onMobileClose }: { item: typeof mainNavItems[0]; onMobileClose: () => void }) {
  const isVoiceAI = item.to === '/voice-ai';

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={() => {
        if (window.innerWidth < 1024) onMobileClose();
      }}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? 'bg-dutchie-300/15 text-dutchie-300'
            : 'text-gray-400 hover:bg-navy-700 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-dutchie-300' : ''}`} />
          <span>{item.label}</span>
          {isVoiceAI && !isActive && (
            <span className="ml-auto rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-navy-800">
              NEW
            </span>
          )}
          {isActive && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-dutchie-300" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-navy-800 transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header — Dutchie branding */}
        <div className="flex items-center justify-between border-b border-navy-700 px-5 py-5">
          <div className="flex items-center gap-3">
            <DutchieLogo />
            <div>
              <span className="text-sm font-semibold tracking-wide text-white">Dutchie</span>
              <span className="ml-1 text-sm font-semibold text-dutchie-300">Insights</span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-navy-700 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
            Dashboard
          </p>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.to} item={item} onMobileClose={onToggle} />
            ))}
          </div>

          <p className="mb-3 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
            AI Tools
          </p>
          <div className="space-y-1">
            {aiNavItems.map((item) => (
              <NavItem key={item.to} item={item} onMobileClose={onToggle} />
            ))}
          </div>
        </nav>

        {/* Client badge */}
        <div className="border-t border-navy-700 px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-navy-900/60 px-3 py-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dutchie-300 to-dutchie-600">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Ascend Wellness</p>
              <p className="truncate text-xs text-navy-400">Enterprise Client</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
