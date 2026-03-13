import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Minus } from 'lucide-react';
import { useStores } from '../../contexts/StoreContext';

const STATE_LABELS = {
  IL: 'Illinois',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  NJ: 'New Jersey',
  OH: 'Ohio',
  PA: 'Pennsylvania',
};

export default function StoreSelector() {
  const {
    selectedStoreNames, storesByState, stateOrder,
    selectedStates, isAllSelected, selectionLabel,
    toggleStore, toggleState, selectAll, clearAll,
  } = useStores();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#38332B] bg-[#1C1B1A] text-sm text-[#ADA599] hover:text-[#F0EDE8] hover:border-[#38332B] transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-[#00C27C]" />
        <span className="max-w-[160px] truncate">{selectionLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 max-h-[70vh] rounded-xl border border-[#38332B] bg-[#1C1B1A] shadow-xl z-50 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#38332B]">
            <span className="text-xs font-semibold text-[#6B6359] uppercase tracking-wider">Store Filter</span>
            <div className="flex items-center gap-2">
              <button onClick={selectAll} className="text-[10px] font-medium text-[#64A8E0] hover:text-blue-700 transition-colors">
                Select All
              </button>
              <span className="text-surface-border">|</span>
              <button onClick={clearAll} className="text-[10px] font-medium text-[#6B6359] hover:text-[#F0EDE8] transition-colors">
                Clear All
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 py-1">
            {stateOrder.map(st => {
              const stores = storesByState[st];
              const stateStatus = selectedStates[st];
              return (
                <div key={st}>
                  <button
                    onClick={() => toggleState(st)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#282724] transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                      stateStatus.status === 'all'
                        ? 'bg-[#00C27C] border-accent-green'
                        : stateStatus.status === 'some'
                          ? 'bg-[#00C27C]/40 border-accent-green'
                          : 'border-[#38332B]'
                    }`}>
                      {stateStatus.status === 'all' && <Check className="w-3 h-3 text-white" />}
                      {stateStatus.status === 'some' && <Minus className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[#F0EDE8] text-sm font-semibold">{STATE_LABELS[st] || st}</span>
                    <span className="text-[#6B6359] text-xs ml-auto">
                      {stateStatus.selected}/{stateStatus.total}
                    </span>
                  </button>

                  {stores.map(store => {
                    const checked = selectedStoreNames.has(store.name);
                    return (
                      <button
                        key={store.name}
                        onClick={() => toggleStore(store.name)}
                        className="w-full flex items-center gap-2.5 pl-8 pr-4 py-1.5 hover:bg-[#282724] transition-colors"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          checked ? 'bg-[#00C27C] border-accent-green' : 'border-[#38332B]'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={`text-xs truncate ${checked ? 'text-[#F0EDE8]' : 'text-[#ADA599]'}`}>
                          {store.name.replace('Ascend ', '')}
                        </span>
                        <span className="text-[10px] text-[#6B6359] ml-auto flex-shrink-0">{store.city}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
