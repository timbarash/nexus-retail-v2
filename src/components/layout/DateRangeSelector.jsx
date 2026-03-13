import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useDateRange } from '../../contexts/DateRangeContext';

export default function DateRangeSelector() {
  const { selectedRange, rangeLabel, ranges, setRange } = useDateRange();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#38332B] bg-[#1C1B1A] hover:border-[#38332B] transition-colors text-sm"
      >
        <Calendar className="w-4 h-4 text-[#00C27C]" />
        <span className="text-[#F0EDE8] font-medium hidden sm:inline">{rangeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#6B6359] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#38332B] bg-[#1C1B1A] shadow-xl overflow-hidden z-50">
          <div className="p-1.5">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRange(r.key); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedRange === r.key
                    ? 'bg-[#00C27C]/8 text-[#00C27C] font-medium'
                    : 'text-[#F0EDE8] hover:bg-[#282724]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
