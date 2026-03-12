import React from 'react';
import { Menu, Search } from 'lucide-react';
import StoreSelector from './StoreSelector';
import DateRangeSelector from './DateRangeSelector';

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text-primary leading-tight">
              Dutchie AI
            </h1>
            <p className="text-xs text-text-muted hidden sm:block">
              Ascend — Retail Operations
            </p>
          </div>
        </div>
        {/* Right: search + date + store */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border text-text-muted hover:text-text-secondary hover:border-gray-300 hover:bg-surface-hover transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search</span>
            <kbd className="text-[10px] bg-surface-muted border border-surface-border rounded px-1 py-0.5 ml-1 font-mono text-text-muted">&#8984;K</kbd>
          </button>
          <DateRangeSelector />
          <StoreSelector />
        </div>
      </div>
    </header>
  );
}
