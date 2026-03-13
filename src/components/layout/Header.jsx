import React from 'react';
import { Menu, Search } from 'lucide-react';
import StoreSelector from './StoreSelector';
import DateRangeSelector from './DateRangeSelector';

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-[#1C1B1A]/80 backdrop-blur-md border-b border-[#38332B]">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-[#ADA599] hover:bg-[#282724] hover:text-[#F0EDE8] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#F0EDE8] leading-tight">
              Dutchie AI
            </h1>
            <p className="text-xs text-[#6B6359] hidden sm:block">
              Ascend — Retail Operations
            </p>
          </div>
        </div>
        {/* Right: search + date + store */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#38332B] text-[#6B6359] hover:text-[#ADA599] hover:border-[#38332B] hover:bg-[#282724] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search</span>
            <kbd className="text-[10px] bg-[#1E1D1B] border border-[#38332B] rounded px-1 py-0.5 ml-1 font-mono text-[#6B6359]">&#8984;K</kbd>
          </button>
          <DateRangeSelector />
          <StoreSelector />
        </div>
      </div>
    </header>
  );
}
