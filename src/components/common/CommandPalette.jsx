import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowRight, Hash, LayoutDashboard, BarChart3, MapPin, Star, Zap, ShoppingCart, DollarSign, Megaphone, Users, Bot } from 'lucide-react';
import { DTCH_SPACES } from '../../data/dtchMockData';

const PAGES = [
  { label: 'Nexus Home', path: '/', icon: LayoutDashboard, group: 'Pages' },
  { label: 'Overview', path: '/overview', icon: BarChart3, group: 'Pages' },
  { label: 'Brand Analysis', path: '/brands', icon: Star, group: 'Pages' },
  { label: 'Location Insights', path: '/locations', icon: MapPin, group: 'Pages' },
  { label: 'Review Explorer', path: '/reviews', icon: Star, group: 'Pages' },
  { label: 'Competitive Insights', path: '/competitive', icon: Zap, group: 'Pages' },
  { label: 'Connect Agent', path: '/agents/connect', icon: ShoppingCart, group: 'Pages' },
  { label: 'Pricing Agent', path: '/agents/pricing', icon: DollarSign, group: 'Pages' },
  { label: 'Marketing Agent', path: '/agents/marketing', icon: Megaphone, group: 'Pages' },
  { label: 'Customer Portal', path: '/portal', icon: Users, group: 'Pages' },
];

export default function CommandPalette({ isOpen, onClose, navigate, onOpenSpace }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Build filtered results
  const allItems = [
    ...PAGES,
    ...DTCH_SPACES.map(s => ({
      label: `${s.emoji} ${s.name}`,
      spaceId: s.id,
      icon: Hash,
      group: 'Spaces',
    })),
  ];

  const filtered = query
    ? allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  // Group items
  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });
  const flatItems = Object.values(groups).flat();

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[selectedIndex];
      if (item) selectItem(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [flatItems, selectedIndex, onClose]);

  const selectItem = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.spaceId) {
      onOpenSpace?.(item.spaceId);
    }
    onClose();
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  let itemIdx = 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed z-[81] top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl rounded-2xl bg-[#1C1B1A] border border-[#38332B] shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#38332B]">
          <Search className="w-4 h-4 text-[#ADA599] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, spaces, or actions..."
            className="flex-1 bg-transparent text-sm text-[#F0EDE8] placeholder-[#6B6359] outline-none"
          />
          <kbd className="text-[10px] text-[#6B6359] bg-[#141210] border border-[#38332B] rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {flatItems.length === 0 && (
            <p className="text-sm text-[#6B6359] text-center py-6">No results found</p>
          )}
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <p className="text-[10px] font-bold text-[#6B6359] uppercase tracking-wider px-4 pt-3 pb-1">{groupName}</p>
              {items.map((item) => {
                const idx = itemIdx++;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    data-index={idx}
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      idx === selectedIndex
                        ? 'bg-[#00C27C]/10 text-[#F0EDE8]'
                        : 'text-[#F0EDE8] hover:bg-[#282724]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#ADA599] flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ArrowRight className={`w-3 h-3 transition-opacity ${idx === selectedIndex ? 'opacity-100 text-[#00C27C]' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
