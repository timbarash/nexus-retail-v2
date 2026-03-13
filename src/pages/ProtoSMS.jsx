import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, Sparkles } from 'lucide-react';

const CONVERSATIONS = [
  {
    store: 'Logan Square',
    budtender: 'Marcus T.',
    product: 'Ozone Cake Mints 3.5g',
    txnId: 'TXN-8834',
    time: '2:34 PM',
    flow: [
      { from: 'system', text: "Hey! Thanks for visiting Ascend Logan Square today 🌿 How was your experience? Reply with a quick thought.", delay: 0 },
      { from: 'customer', text: "Great! Marcus recommended the Ozone gummies and they're exactly what I needed.", delay: 2500 },
      { from: 'system', text: "Awesome to hear! 🎉 One more — on a scale of 1-5, how likely are you to recommend us to a friend?", delay: 1500 },
      { from: 'customer', text: "5 for sure", delay: 2000 },
      { from: 'system', text: "Thanks so much! That means a lot. See you next time! 💚", delay: 1000 },
    ],
  },
  {
    store: 'Fort Lee',
    budtender: 'Jamie R.',
    product: 'Select Elite Cart 1g',
    txnId: 'TXN-8821',
    time: '1:12 PM',
    flow: [
      { from: 'system', text: "Hi! Thanks for stopping by Ascend Fort Lee today. How was your visit? We'd love to hear 🙏", delay: 0 },
      { from: 'customer', text: "Waited 20 min even though I ordered ahead online. Pretty frustrating.", delay: 3000 },
      { from: 'system', text: "We're sorry about the wait 😔 That's not the experience we want. On a scale of 1-5, how would you rate today overall?", delay: 1500 },
      { from: 'customer', text: "2", delay: 1500 },
      { from: 'system', text: "Thank you for the honest feedback. We're working on faster pickup times. Your input helps us improve! 🙏", delay: 1000 },
    ],
  },
  {
    store: 'Boston',
    budtender: 'Alex K.',
    product: 'Simply Herb Gummies 100mg',
    txnId: 'TXN-8807',
    time: '11:45 AM',
    flow: [
      { from: 'system', text: "Hey there! How was your pickup at Ascend Boston today? Quick reply is all we need! 😊", delay: 0 },
      { from: 'customer', text: "Smooth and fast. Love the new online ordering flow too.", delay: 2500 },
      { from: 'system', text: "Glad to hear it! Last question — anything we could improve for next time?", delay: 1500 },
      { from: 'customer', text: "Maybe more strain info on the product pages? Had to Google a few things", delay: 2500 },
      { from: 'system', text: "Great suggestion, passing that along! Thanks for shopping with us 💚", delay: 1000 },
    ],
  },
];

function PhoneMockup({ children, title }) {
  return (
    <div className="relative mx-auto w-[340px]">
      {/* Glow backdrop */}
      <div className="absolute -inset-6 rounded-[3.5rem] bg-[#00C27C]/[0.07] blur-2xl pointer-events-none" />
      <div className="relative rounded-[2.5rem] border-[6px] border-[#38332B] bg-[#1C1B1A] shadow-[0_0_50px_rgba(0,194,124,0.08),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-surface-border">
        {/* Notch */}
        <div className="relative bg-[#1C1B1A] pt-2 pb-1 px-6">
          <div className="mx-auto h-5 w-28 rounded-full bg-[#1C1B1A]" />
        </div>
        {/* Status bar */}
        <div className="bg-[#1C1B1A] px-6 py-2 flex items-center justify-between text-[10px] text-gray-400">
          <span>2:34 PM</span>
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
        {/* Content */}
        <div className="bg-[#f5f5f5] min-h-[520px] max-h-[520px] overflow-hidden flex flex-col">
          {children}
        </div>
        {/* Home bar */}
        <div className="bg-[#1C1B1A] py-2 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-[#1C1B1A]/30" />
        </div>
      </div>
    </div>
  );
}

function SMSConversation({ conversation, onComplete }) {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setVisibleMessages([]);
    setIsTyping(false);
    let totalDelay = 0;
    const timeouts = [];

    conversation.flow.forEach((msg, i) => {
      totalDelay += msg.delay;
      // Show typing indicator before each message
      if (i > 0) {
        timeouts.push(setTimeout(() => setIsTyping(true), totalDelay - 800));
      }
      timeouts.push(setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => [...prev, msg]);
      }, totalDelay));
      totalDelay += 600; // gap between messages
    });

    timeouts.push(setTimeout(() => onComplete?.(), totalDelay + 500));

    return () => timeouts.forEach(clearTimeout);
  }, [conversation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleMessages, isTyping]);

  return (
    <>
      {/* Header */}
      <div className="bg-[#1C1B1A] border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#00C27C] flex items-center justify-center">
          <span className="text-white text-xs font-bold">D</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ascend {conversation.store}</p>
          <p className="text-[10px] text-gray-500">SMS · Auto-survey</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <p className="text-center text-[10px] text-gray-400 mb-3">Today {conversation.time}</p>
        {visibleMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'system' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
              msg.from === 'system'
                ? 'bg-[#e5e5ea] text-gray-900 rounded-bl-md'
                : 'bg-[#00C27C] text-white rounded-br-md'
            }`}>
              {msg.text}
              <div className={`flex items-center justify-end gap-1 mt-0.5 ${msg.from === 'system' ? 'text-gray-500' : 'text-white/70'}`}>
                <span className="text-[9px]">{conversation.time}</span>
                {msg.from === 'customer' && <CheckCheck size={10} />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#e5e5ea] rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="bg-[#1C1B1A] border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <input type="text" disabled placeholder="iMessage" className="flex-1 rounded-full bg-[#282724] px-4 py-2 text-sm text-gray-500" />
        <div className="w-8 h-8 rounded-full bg-[#00C27C] flex items-center justify-center">
          <Send size={14} className="text-white" />
        </div>
      </div>
    </>
  );
}

export default function ProtoSMS() {
  const [activeConvo, setActiveConvo] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE8]">Post-Purchase SMS Micro-Surveys</h1>
        <p className="text-sm text-[#ADA599] mt-1">Conversational 2-3 question SMS thread triggered after pickup/delivery confirmation from POS data</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Phone mockup */}
        <div className="flex justify-center">
          <PhoneMockup title="Messages">
            <SMSConversation
              key={activeConvo}
              conversation={CONVERSATIONS[activeConvo]}
              onComplete={() => setCompleted((prev) => new Set([...prev, activeConvo]))}
            />
          </PhoneMockup>
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          {/* Scenario picker */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#ADA599] mb-3">Choose a Scenario</p>
            <div className="space-y-2">
              {CONVERSATIONS.map((c, i) => (
                <button key={i} onClick={() => setActiveConvo(i)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    activeConvo === i ? 'border-[#00C27C] bg-[#00C27C]/5 ring-1 ring-[#00C27C]/20' : 'border-[#38332B] hover:border-[#00C27C]/30'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#F0EDE8]">{c.store} — {c.flow[1].text.includes('Great') || c.flow[1].text.includes('Smooth') ? '😊 Positive' : '😔 Negative'}</span>
                    {completed.has(i) && <Check size={16} className="text-[#00C27C]" />}
                  </div>
                  <p className="text-xs text-[#ADA599] line-clamp-1">{c.flow[1].text}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#141210] px-2 py-0.5 text-[10px] text-[#ADA599]">Staff: {c.budtender}</span>
                    {c.product && <span className="rounded-full bg-[#141210] px-2 py-0.5 text-[10px] text-[#ADA599]">{c.product}</span>}
                    <span className="rounded-full bg-[#141210] px-2 py-0.5 text-[10px] text-[#ADA599]">{c.txnId}</span>
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
                { step: '1', title: 'POS Trigger', desc: 'Transaction completes → POS fires pickup/delivery confirmation event' },
                { step: '2', title: 'SMS Sent', desc: '2-3 question conversational thread sent via Twilio within 15 minutes' },
                { step: '3', title: 'NLP Analysis', desc: 'Free-text responses piped through sentiment NLP alongside scraped review data' },
                { step: '4', title: 'Auto-Mapping', desc: 'Response auto-maps to store, budtender, product, and transaction ID' },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#00C27C] text-white text-xs font-bold">{s.step}</div>
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
                <p className="text-sm text-[#F0EDE8]/80 leading-relaxed">50.3% response rate — 10x higher than email surveys. Creates a proprietary first-party signal tied to actual transactions that no competitor can replicate. Free-text responses feed the same NLP engine analyzing Reddit, Leafly, and Weedmaps data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
