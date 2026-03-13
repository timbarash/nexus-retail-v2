import React, { useState } from 'react';
import { Star, ChevronRight, Sparkles, MapPin, User, ShoppingBag, Check } from 'lucide-react';

function PhoneMockup({ children, title }) {
  return (
    <div className="relative mx-auto w-[340px]">
      {/* Glow backdrop */}
      <div className="absolute -inset-6 rounded-[3.5rem] bg-[#00C27C]/[0.07] blur-2xl pointer-events-none" />
      <div className="relative rounded-[2.5rem] border-[6px] border-[#38332B] bg-[#1C1B1A] shadow-[0_0_50px_rgba(0,194,124,0.08),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-surface-border">
        <div className="relative bg-[#1C1B1A] pt-2 pb-1 px-6">
          <div className="mx-auto h-5 w-28 rounded-full bg-[#1C1B1A]" />
        </div>
        <div className="bg-[#1C1B1A] px-6 py-2 flex items-center justify-between text-[10px] text-gray-400">
          <span>3:42 PM</span>
          <span className="font-medium text-gray-700">{title}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="w-1 h-2 bg-gray-800 rounded-sm" />
              <div className="w-1 h-2.5 bg-gray-800 rounded-sm" />
              <div className="w-1 h-3 bg-gray-800 rounded-sm" />
              <div className="w-1 h-3.5 bg-gray-300 rounded-sm" />
            </div>
          </div>
        </div>
        <div className="bg-[#1C1B1A] min-h-[520px] max-h-[520px] overflow-hidden flex flex-col">
          {children}
        </div>
        <div className="bg-[#1C1B1A] py-2 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-[#1C1B1A]/30" />
        </div>
      </div>
    </div>
  );
}

const SCENARIOS = [
  {
    store: 'Logan Square, IL',
    budtender: 'Marcus T.',
    products: ['Ozone Cake Mints 3.5g', 'Select Elite Cart 1g'],
    txnId: 'TXN-8834',
    time: '2:38 PM',
  },
  {
    store: 'Fort Lee, NJ',
    budtender: 'Jamie R.',
    products: ['Simply Herb Gummies 100mg'],
    txnId: 'TXN-8821',
    time: '1:15 PM',
  },
  {
    store: 'Boston, MA',
    budtender: 'Alex K.',
    products: ['Tunnel Vision 5-Pack', 'Ozone Cake Mints 3.5g'],
    txnId: 'TXN-8807',
    time: '11:50 AM',
  },
];

function QRSurveyFlow({ scenario }) {
  const [step, setStep] = useState('scan'); // scan | q1 | q2 | q3 | done
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [budtenderRating, setBudtenderRating] = useState(0);
  const [budtenderHover, setBudtenderHover] = useState(0);
  const [comment, setComment] = useState('');

  const resetFlow = () => {
    setStep('scan');
    setRating(0);
    setHoverRating(0);
    setBudtenderRating(0);
    setBudtenderHover(0);
    setComment('');
  };

  // When scenario changes, reset
  React.useEffect(() => { resetFlow(); }, [scenario]);

  return (
    <>
      {/* Header */}
      <div className="bg-[#00C389] px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1C1B1A] flex items-center justify-center">
            <span className="text-[#00C389] text-[10px] font-bold">D</span>
          </div>
          <span className="text-white text-sm font-semibold">Ascend Feedback</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* QR Scan simulation */}
        {step === 'scan' && (
          <div className="p-5 space-y-4">
            {/* Fake receipt */}
            <div className="mx-auto max-w-[260px] rounded-lg border border-dashed border-[#38332B] bg-[#1E1D1B] p-4 font-mono text-[11px] text-gray-600">
              <p className="text-center font-bold text-gray-800 mb-1">ASCEND {scenario.store.toUpperCase()}</p>
              <p className="text-center text-[10px] mb-3">{scenario.time} · {scenario.txnId}</p>
              <div className="border-t border-dashed border-[#38332B] pt-2 mb-2">
                {scenario.products.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="text-right font-bold text-gray-800">Budtender: {scenario.budtender}</p>
              <div className="mt-3 flex justify-center">
                {/* QR placeholder */}
                <div className="w-24 h-24 bg-[#1C1B1A] border border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-[#1C1B1A]'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-[9px] text-gray-400 mt-2">Scan for quick feedback</p>
            </div>

            <button onClick={() => setStep('q1')}
              className="w-full rounded-xl bg-[#00C389] py-3 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
              Simulate QR Scan
            </button>

            <div className="rounded-lg bg-[#1E1D1B] px-3 py-2">
              <p className="text-[10px] text-gray-400 text-center">
                QR encodes: Store: {scenario.store} · TXN: {scenario.txnId} · Staff: {scenario.budtender}
              </p>
            </div>
          </div>
        )}

        {/* Q1: Overall rating */}
        {step === 'q1' && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <MapPin size={12} className="text-[#00C389]" />
                <span className="text-xs text-gray-500">{scenario.store}</span>
              </div>
              <p className="text-base font-bold text-gray-900">How was your visit today?</p>
              <p className="text-xs text-gray-500 mt-1">Question 1 of 3</p>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#38332B]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#38332B]" />
            </div>

            {/* Star rating */}
            <div className="flex justify-center gap-3 py-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110 active:scale-90">
                  <Star size={36} className={`transition-colors ${s <= (hoverRating || rating) ? 'text-gold-500 fill-gold-500' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <button onClick={() => setStep('q2')}
                className="w-full rounded-xl bg-[#00C389] py-3 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                Next
              </button>
            )}
          </div>
        )}

        {/* Q2: Budtender rating */}
        {step === 'q2' && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">How was {scenario.budtender}?</p>
              <p className="text-xs text-gray-500 mt-1">Question 2 of 3</p>
            </div>

            <div className="flex gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#38332B]" />
            </div>

            <div className="rounded-xl bg-[#1E1D1B] border border-gray-100 p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#00C389]/20 flex items-center justify-center mb-2">
                <User size={24} className="text-[#00C389]" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{scenario.budtender}</p>
              <p className="text-xs text-gray-500">{scenario.store}</p>
            </div>

            <div className="flex justify-center gap-3 py-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s}
                  onMouseEnter={() => setBudtenderHover(s)}
                  onMouseLeave={() => setBudtenderHover(0)}
                  onClick={() => setBudtenderRating(s)}
                  className="transition-transform hover:scale-110 active:scale-90">
                  <Star size={36} className={`transition-colors ${s <= (budtenderHover || budtenderRating) ? 'text-gold-500 fill-gold-500' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>

            {budtenderRating > 0 && (
              <button onClick={() => setStep('q3')}
                className="w-full rounded-xl bg-[#00C389] py-3 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                Next
              </button>
            )}
          </div>
        )}

        {/* Q3: Free text */}
        {step === 'q3' && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">Anything else you'd like to share?</p>
              <p className="text-xs text-gray-500 mt-1">Question 3 of 3 · Optional</p>
            </div>

            <div className="flex gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
              <div className="flex-1 h-1.5 rounded-full bg-[#00C389]" />
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what went well or what we could improve..."
              className="w-full rounded-xl border border-gray-200 bg-[#1E1D1B] px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C389] resize-none"
              rows={4}
            />

            <div className="flex gap-2">
              <button onClick={() => setStep('done')}
                className="flex-1 rounded-xl bg-[#282724] py-3 text-sm font-medium text-gray-600 hover:bg-[#38332B] transition-colors">
                Skip
              </button>
              <button onClick={() => setStep('done')}
                className="flex-1 rounded-xl bg-[#00C389] py-3 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="p-5 flex flex-col items-center justify-center flex-1">
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00C389]/5 flex items-center justify-center mb-3">
                <Check size={32} className="text-[#00C389]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Thank you!</h2>
              <p className="text-sm text-gray-500 mt-1">Your feedback helps us improve</p>

              <div className="mt-4 rounded-xl bg-[#1E1D1B] border border-gray-100 p-3 text-xs text-gray-500 max-w-[240px] mx-auto">
                <p className="font-medium text-gray-700 mb-1">Auto-captured:</p>
                <p>Store: {scenario.store}</p>
                <p>Budtender: {scenario.budtender}</p>
                <p>Products: {scenario.products.join(', ')}</p>
                <p>TXN: {scenario.txnId}</p>
                <p>Visit: {rating}/5 · Staff: {budtenderRating}/5</p>
              </div>

              <button onClick={resetFlow}
                className="mt-6 rounded-xl bg-[#00C389] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                Replay Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProtoQR() {
  const [activeScenario, setActiveScenario] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE8]">QR Code "Moment of Truth" Captures</h1>
        <p className="text-sm text-[#ADA599] mt-1">Dynamic QR codes on receipts deep-link to a 3-question mobile survey — auto-maps to store, budtender, and products</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Phone mockup */}
        <div className="flex justify-center">
          <PhoneMockup title="Safari">
            <QRSurveyFlow key={activeScenario} scenario={SCENARIOS[activeScenario]} />
          </PhoneMockup>
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          {/* Scenario picker */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#ADA599] mb-3">Choose a Scenario</p>
            <div className="space-y-2">
              {SCENARIOS.map((s, i) => (
                <button key={i} onClick={() => setActiveScenario(i)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    activeScenario === i ? 'border-[#00C389] bg-[#00C389]/5 ring-1 ring-[#00C389]/20' : 'border-[#38332B] hover:border-[#00C389]/30'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#F0EDE8]">{s.store}</span>
                    <span className="text-[11px] text-[#ADA599]">{s.txnId}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="rounded-full bg-[#141210] px-2 py-0.5 text-[10px] text-[#ADA599]">Staff: {s.budtender}</span>
                    {s.products.map((p) => (
                      <span key={p} className="rounded-full bg-[#141210] px-2 py-0.5 text-[10px] text-[#ADA599]">{p}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-6">
            <h3 className="text-sm font-semibold text-[#F0EDE8] mb-3">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'QR Generated', desc: 'Dynamic QR printed on receipt encodes store, transaction ID, budtender, and products purchased' },
                { step: '2', title: 'Customer Scans', desc: 'Opens a mobile-optimized 3-question survey — no app install, no login, no friction' },
                { step: '3', title: 'Auto-Mapped', desc: 'Every response auto-maps to location, staff member, and specific products without customer entering anything' },
                { step: '4', title: 'Pipeline Merge', desc: 'Responses flow into the same sentiment engine analyzing Reddit, Leafly, Weedmaps, and Google data' },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00C389] text-white text-xs font-bold">{s.step}</div>
                  <div><p className="text-sm font-medium text-[#F0EDE8]">{s.title}</p><p className="text-xs text-[#ADA599]">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div className="rounded-xl bg-[#141210] p-5">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="text-[#00C27C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#00C27C] mb-1">Why This Matters</p>
                <p className="text-sm text-[#F0EDE8]/80 leading-relaxed">QR surveys with auto-mapped budtender data revealed that Jamie R. at Fort Lee is tied to 68% of negative feedback — a coaching opportunity invisible in aggregate data. 7.8% scan rate with 67.8% completion means high-intent, high-quality signal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
