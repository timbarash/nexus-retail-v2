import React, { useState } from 'react';
import { Zap, X, Menu } from 'lucide-react';
import NexusHome from './NexusHome';

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 bg-navy-900 min-h-screen">
        <SidebarContent />
      </aside>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 shadow-2xl lg:hidden animate-fade-in">
            <SidebarContent onClose={onClose} />
          </aside>
        </>
      )}
    </>
  );
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#6ABA48"/>
            <path d="M10 8h6c4.418 0 8 3.582 8 8s-3.582 8-8 8h-6V8zm3 3v10h3c2.761 0 5-2.239 5-5s-2.239-5-5-5h-3z" fill="white"/>
          </svg>
          <div>
            <span className="text-white font-semibold text-sm tracking-wide">Dutchie</span>
            <span className="text-gold-400 font-semibold text-sm ml-1">Nexus</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Command Center</p>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-gold-500/15 text-gold-400">
          <Zap className="w-5 h-5 text-gold-400" />
          <span>Nexus Home</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
        </div>
      </nav>
      <div className="px-4 py-4 border-t border-navy-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-800/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Curaleaf</p>
            <p className="text-gray-500 text-xs truncate">Enterprise Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-navy-800">Dutchie Nexus</span>
        </header>
        <div className="bg-gradient-to-r from-navy-800 to-dutchie-900 text-white px-4 py-2 text-center text-sm font-medium">
          Prototype: Dutchie Nexus — AI-Powered Command Center for Cannabis Retail
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <NexusHome />
        </main>
      </div>
    </div>
  );
}
