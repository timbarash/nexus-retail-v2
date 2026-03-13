import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, ChevronRight } from 'lucide-react';

const PRODUCTS = [
  { name: 'Ozone Cake Mints 3.5g', category: 'Flower', price: 45, img: '🌿' },
  { name: 'Select Elite Cart 1g', category: 'Vape', price: 60, img: '💨' },
  { name: 'Simply Herb Gummies 100mg', category: 'Edible', price: 28, img: '🍬' },
];

const EMOJIS = [
  { emoji: '😍', label: 'Love it' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '😒', label: 'Not great' },
];

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
          <span>3:15 PM</span>
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
        <div className="bg-[#fafafa] min-h-[520px] max-h-[520px] overflow-hidden flex flex-col">
          {children}
        </div>
        <div className="bg-[#1C1B1A] py-2 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-[#1C1B1A]/30" />
        </div>
      </div>
    </div>
  );
}

function EcommFlow() {
  const [step, setStep] = useState('confirmed'); // confirmed | feedback | text | done
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(0);

  const product = PRODUCTS[selectedProduct];

  const reset = (idx) => {
    setSelectedProduct(idx);
    setStep('confirmed');
    setSelectedEmoji(null);
    setFeedbackText('');
  };

  return (
    <>
      {/* Header bar */}
      <div className="bg-[#00C389] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1C1B1A] flex items-center justify-center">
            <span className="text-[#00C389] text-xs font-bold">D</span>
          </div>
          <span className="text-white text-sm font-semibold">Ascend</span>
        </div>
        <div className="flex items-center gap-1">
          <ShoppingBag size={16} className="text-white/80" />
          <span className="text-white/80 text-xs">Order #4821</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 'confirmed' && (
          <div className="p-5 space-y-4">
            {/* Order confirmed */}
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00C389]/5 flex items-center justify-center mb-3">
                <Check size={32} className="text-[#00C389]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Order Confirmed!</h2>
              <p className="text-sm text-gray-500 mt-1">Ready for pickup in ~15 min</p>
            </div>

            {/* Order summary */}
            <div className="rounded-xl border border-gray-200 bg-[#1C1B1A] p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{product.img}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category} · ${product.price}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Ascend Logan Square</span>
                <span className="text-sm font-semibold text-gray-900">${product.price}.00</span>
              </div>
            </div>

            {/* Feedback prompt — the magic moment */}
            <div className="rounded-2xl border-2 border-[#00C389]/20 bg-[#00C389]/5 p-5 text-center">
              <p className="text-sm font-semibold text-gray-900 mb-1">How do you feel about this order?</p>
              <p className="text-xs text-gray-500 mb-4">One tap — that's all we need!</p>
              <div className="flex justify-center gap-4">
                {EMOJIS.map((e) => (
                  <button key={e.emoji} onClick={() => { setSelectedEmoji(e); setStep('feedback'); }}
                    className="flex flex-col items-center gap-1 group">
                    <span className="text-3xl transition-transform group-hover:scale-125 group-active:scale-95">{e.emoji}</span>
                    <span className="text-[10px] text-gray-500">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div className="p-5 space-y-4">
            <div className="text-center py-2">
              <span className="text-5xl">{selectedEmoji.emoji}</span>
              <p className="text-sm font-semibold text-gray-900 mt-2">{selectedEmoji.label}!</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#1C1B1A] p-5">
              <p className="text-sm font-medium text-gray-900 mb-1">Want to tell us more?</p>
              <p className="text-xs text-gray-500 mb-3">Totally optional — but it helps us improve</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you like? Anything we could do better?"
                className="w-full rounded-xl border border-gray-200 bg-[#1E1D1B] px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C389] resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep('done')}
                  className="flex-1 rounded-xl bg-[#282724] py-2.5 text-sm font-medium text-gray-600 hover:bg-[#38332B] transition-colors">
                  Skip
                </button>
                <button onClick={() => setStep('done')}
                  className="flex-1 rounded-xl bg-[#00C389] py-2.5 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                  Submit
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-[#282724] px-3 py-2">
              <p className="text-[10px] text-gray-400 text-center">
                Mapped to: {product.name} · Ascend Logan Square · Order #4821
              </p>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="p-5 flex flex-col items-center justify-center flex-1">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00C389]/5 flex items-center justify-center mb-3">
                <span className="text-3xl">💚</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Thanks for the feedback!</h2>
              <p className="text-sm text-gray-500 mt-1">Your input helps us serve you better</p>
              <button onClick={() => reset(selectedProduct)}
                className="mt-6 rounded-xl bg-[#00C389] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00B07A] transition-colors">
                View Order Status
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function KioskFlow() {
  const [step, setStep] = useState('confirmed');
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  return (
    <>
      {/* Kiosk header */}
      <div className="bg-[#042017] px-4 py-3 flex items-center justify-center gap-2">
        <div className="w-6 h-6 rounded bg-[#00C389] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">D</span>
        </div>
        <span className="text-white text-sm font-semibold">Ascend Kiosk</span>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#042017]">
        {step === 'confirmed' && (
          <div className="p-6 space-y-5">
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#00C389]/20 flex items-center justify-center mb-4">
                <Check size={40} className="text-[#00C389]" />
              </div>
              <h2 className="text-xl font-bold text-white">Order Placed!</h2>
              <p className="text-sm text-gray-400 mt-1">A budtender will call your name shortly</p>
              <p className="text-3xl font-bold text-[#00C389] mt-3">#47</p>
              <p className="text-xs text-gray-500">Your queue number</p>
            </div>

            {/* Big emoji feedback — zero friction */}
            <div className="rounded-2xl border border-[#38332B] bg-[#042017] p-6 text-center">
              <p className="text-base font-semibold text-white mb-2">Quick — how was that?</p>
              <p className="text-xs text-gray-400 mb-5">Just tap one</p>
              <div className="flex justify-center gap-5">
                {EMOJIS.map((e) => (
                  <button key={e.emoji} onClick={() => { setSelectedEmoji(e); setStep('done'); }}
                    className="flex flex-col items-center gap-2 group">
                    <span className="text-4xl transition-transform group-hover:scale-125 group-active:scale-90">{e.emoji}</span>
                    <span className="text-[11px] text-gray-400 group-hover:text-white">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="p-6 flex flex-col items-center justify-center flex-1">
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">{selectedEmoji?.emoji}</span>
              <h2 className="text-xl font-bold text-white">Thanks!</h2>
              <p className="text-sm text-gray-400 mt-2">Enjoy your purchase 🌿</p>
              <button onClick={() => { setStep('confirmed'); setSelectedEmoji(null); }}
                className="mt-6 rounded-xl bg-[#282724] border border-[#38332B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#282724] transition-colors">
                Replay Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProtoEmoji() {
  const [mode, setMode] = useState('ecomm'); // ecomm | kiosk

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE8]">In-Menu Embedded Sentiment</h1>
        <p className="text-sm text-[#ADA599] mt-1">Single-tap emoji reaction + optional free-text after order completion on Dutchie Ecomm or Kiosk</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Phone mockup */}
        <div>
          {/* Mode toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => setMode('ecomm')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${mode === 'ecomm' ? 'bg-[#00C389] text-white' : 'bg-[#1C1B1A] text-[#ADA599] hover:bg-[#282724] border border-[#38332B]'}`}>
              Ecomm (Mobile Web)
            </button>
            <button onClick={() => setMode('kiosk')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${mode === 'kiosk' ? 'bg-[#042017] text-white' : 'bg-[#1C1B1A] text-[#ADA599] hover:bg-[#282724] border border-[#38332B]'}`}>
              In-Store Kiosk
            </button>
          </div>

          <PhoneMockup title={mode === 'ecomm' ? 'Ascend Ecomm' : 'Kiosk'}>
            {mode === 'ecomm' ? <EcommFlow /> : <KioskFlow />}
          </PhoneMockup>
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          {/* Key design principles */}
          <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-6">
            <h3 className="text-sm font-semibold text-[#F0EDE8] mb-3">Design Principles</h3>
            <div className="space-y-3">
              {[
                { title: 'Zero Friction', desc: 'One tap gets structured data. No forms, no logins, no extra screens.' },
                { title: 'Optional Depth', desc: 'The emoji is required data. Free-text is optional but gives rich qualitative signal when customers choose to share.' },
                { title: 'Auto-Mapped', desc: 'Every reaction auto-maps to product, brand, store, and transaction — no customer input needed.' },
                { title: 'Moment of Truth', desc: 'Prompt appears right at order confirmation when emotion is highest and engagement is guaranteed.' },
              ].map((p) => (
                <div key={p.title} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#00C389]" />
                  <div><p className="text-sm font-medium text-[#F0EDE8]">{p.title}</p><p className="text-xs text-[#ADA599]">{p.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Data captured */}
          <div className="rounded-2xl border border-[#38332B] bg-[#1C1B1A] p-6">
            <h3 className="text-sm font-semibold text-[#F0EDE8] mb-3">What Gets Captured</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Structured', items: ['Emoji reaction (1 of 4)', 'Product SKU', 'Store location', 'Transaction ID'] },
                { label: 'Qualitative', items: ['Free-text feedback', 'Timestamp', 'Order channel (ecomm/kiosk)', 'Customer segment'] },
              ].map((col) => (
                <div key={col.label}>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#ADA599] mb-2">{col.label}</p>
                  <div className="space-y-1.5">
                    {col.items.map((item) => (
                      <p key={item} className="text-xs text-[#F0EDE8] flex items-center gap-1.5">
                        <ChevronRight size={10} className="text-[#00C389]" />{item}
                      </p>
                    ))}
                  </div>
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
                <p className="text-sm text-[#F0EDE8]/80 leading-relaxed">Kiosk users leave 3.2x more reactions than ecomm users. With 15.1% adding free-text, you build product-level sentiment at scale — mapped to specific SKUs, brands, and stores over time. No competitor has this first-party signal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
