import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-border px-4 py-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00a35e] to-[#10b981] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[10px]">D</span>
          </div>
          <span>
            Powered by{' '}
            <span className="font-semibold text-text-primary">Dutchie AI</span>
          </span>
        </div>
        <span>Nexus Retail Platform v2.0</span>
        <span>&copy; 2026 Dutchie. All rights reserved.</span>
      </div>
    </footer>
  );
}
