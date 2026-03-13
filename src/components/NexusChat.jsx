import React from 'react';
import { X, Sparkles, RotateCcw } from 'lucide-react';
import CustomerBridge from '../pages/CustomerBridge';

/**
 * NexusChat — Full-screen AI agent overlay
 * Wraps CustomerBridge with a dutchie-connect-style overlay shell.
 * Opened by the FAB button and Nexus AI bar.
 * Completely separate from the DTCH team chat.
 */
export default function NexusChat({ isOpen, onClose, initialQuery }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ backgroundColor: '#141210' }}>
      {/* Header with gradient */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-[#38332B] flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #141210 0%, #0F1923 50%, #141210 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00C27C, #64A8E0)' }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F0EDE8]">Nexus AI</h2>
            <p className="text-xs text-[#6B6359]">Retail operations agent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#ADA599] hover:text-[#F0EDE8] hover:bg-white/[0.06] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New conversation
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#ADA599] hover:text-[#F0EDE8] hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CustomerBridge fills the rest */}
      <div className="flex-1 overflow-hidden px-0">
        <div className="h-full max-w-5xl mx-auto px-6 py-4">
          <CustomerBridge nexusOverlay initialQuery={initialQuery} />
        </div>
      </div>
    </div>
  );
}
