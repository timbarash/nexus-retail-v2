import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { CURRENT_USER } from '../../data/slackMockData';
import { TEAM_MEMBERS } from '../../data/slackMockData';
import { DTCH_SPACES, DTCH_INITIAL_MESSAGES, DTCH_INITIAL_UNREADS, INTENT_ROUTING } from '../../data/dtchMockData';
import { processDtchMessage } from './dtchBridgeEngine';
import DtchChannelBar from './DtchChannelBar';
import DtchMessageList from './DtchMessageList';
import DtchMessageInput from './DtchMessageInput';
import DtchNotificationCenter from './DtchNotificationCenter';

// Intent → Approver mapping
const INTENT_APPROVERS = {
  marketing: 'marcus',
  reporting: 'rachel',
  reviews: 'lisa',
  sentiment: 'lisa',
  connect: 'sofia',
  feedback: 'derek',
  factory: 'rachel',
};

// Approval response messages by intent
const APPROVAL_MESSAGES = {
  marketing: [
    "Love the targeting on this one. Creative assets approved — let's push it live. Bridge, schedule it for the next available window.",
    "Solid campaign plan. I'd bump the discount to 20% for the VIP segment. Approved — let's launch it.",
    "This looks great. Approved. Can we also get a variant for our loyalty tier customers? Bridge — draft a follow-up.",
  ],
  reporting: [
    "Great numbers. I'll incorporate this into the Q1 deck. Can Bridge also pull a month-over-month comparison for the board?",
    "Really helpful snapshot. Let's discuss the AOV trend at the team meeting Friday. Thanks Bridge.",
  ],
  reviews: [
    "Thanks for pulling this. I'll draft responses to the negative reviews today. Bridge — flag any new ones as they come in.",
    "Good intel. The wait time complaints are concerning — let me loop in @Derek Williams on the ops side.",
  ],
  sentiment: [
    "The delivery speed improvement is great to see — that was a direct result of our logistics changes last month. Keep monitoring.",
    "NPS trending up is excellent. Let's double down on the staff training that's driving the positive sentiment.",
  ],
  connect: [
    "Rush orders confirmed. I've also reached out to our backup supplier for the Blue Dream. Bridge — track the ETAs and alert me on delays.",
    "Agreed on the restock priorities. Let's also review the dead stock items at the ops meeting and plan a clearance sale.",
  ],
  feedback: [
    "I've flagged this with the engineering team directly. We should have a root cause analysis within 24 hours. Keep me posted, Bridge.",
    "Thanks for logging this. I'll follow up with the customer personally to make sure they know we're on it.",
  ],
  factory: [
    "Good feature request — I've added it to the priority review list. Bridge, check if there's anything similar already on the roadmap.",
    "Interesting idea. Let me discuss with the product team at our next sync. I'll update the ticket with their feedback.",
  ],
};

// Catch-me-up summaries by space
const CATCH_UP_SUMMARIES = {
  lounge: (count, names) =>
    `Here's what you missed in the **Lounge** (${count} messages):\n\n• Rachel shared a Q1 review reminder — department leads need summaries by Thursday\n• James celebrated hitting **500 five-star reviews** on Google\n• Nina reported the February compliance audit passed with **zero findings**\n• I flagged that Ascend is in the **top 8% of multi-state operators** by customer sentiment\n\nOverall vibe: Positive and productive. The team is energized heading into Q1 review.`,

  campaigns: (count, names) =>
    `**Campaigns** summary (${count} messages):\n\n• "Spring Into Savings" campaign is **LIVE** and outperforming projections\n• T+24h metrics: 68.2% open rate (+14% vs avg), $12,340 revenue from 187 orders\n• Marcus approved creative assets and wants a VIP variant\n• Rachel approved the follow-up "Edible Enthusiast" campaign\n\nAction items: Follow-up campaign targeting the 187 converters is greenlit.`,

  inventory: (count, names) =>
    `**Inventory** update (${count} messages):\n\n• 🔴 3 critical low-stock SKUs flagged: Blue Dream, Sour Diesel Cart, Gummy Bears\n• Sofia submitted PO for Blue Dream — **ETA Thursday**\n• Rush orders placed for the other two\n• GreenLeaf Supply confirmed Sour Diesel rush — **ETA Friday morning**\n\nAll 3 critical SKUs should be restocked by end of week.`,

  'sales-floor': (count, names) =>
    `**Sales Floor** recap (${count} messages):\n\n• Extra Saturday 12–4pm shift added per staffing recommendation\n• Tanya confirmed she can cover Saturdays for the rest of March\n• Data shows 78% of complaints happen during that window — the extra budtender should reduce errors ~60%\n• POS maintenance scheduled Tuesday 6–7am (no impact to store hours)\n\nRachel approved the staffing change for 2-week monitoring.`,

  'customer-issues': (count, names) =>
    `**Customer Issues** summary (${count} messages):\n\n• Lisa closed 23/26 support tickets — avg resolution down to **4.2 hours** (was 6.8)\n• 🚨 VIP escalation: Gold-tier customer Michael R. got wrong product twice\n• Risk: **72% churn probability** on a $4,200 LTV customer\n• Derek is calling personally, Rachel approved full refund + 20% next order\n\nCritical: Watch for the fulfillment root cause investigation.`,

  'cash-desk': (count, names) =>
    `**Cash Desk** recap (${count} messages):\n\n• Morning cash count complete — $1,500 per register\n• End-of-day reconciliation: Registers 1 & 3 balanced, Register 2 has **-$22.50** variance\n• Derek investigating — likely the manual Thompson refund\n\nTotal cash collected: $4,812.`,

  compliance: (count, names) =>
    `**Compliance** update (${count} messages):\n\n• METRC manifest #MF-20260308 submitted — 14 packages tagged\n• License renewal in **47 days**\n• Monthly state report 94% complete\n• GreenTest Labs results expected tomorrow for 2 label updates\n\nNo blockers — on track.`,

  'managers-office': (count, names) =>
    `**Manager's Office** summary (${count} messages):\n\n• February P&L: Revenue $142K (+6% MoM), margins at 47.9%\n• Q1 goal tracker: Revenue 88% on track, NPS 92%, New Customers 76% (needs attention)\n• Rachel wants to discuss customer acquisition gap at Friday review\n\nAction: Marcus to bring campaign conversion funnel data.`,

  'vendor-alley': (count, names) =>
    `**Vendor Alley** recap (${count} messages):\n\n• PO #4892 submitted to GreenLeaf — Blue Dream + Sour Diesel, ETA Thursday\n• Vendor scorecard: GreenLeaf 94% on-time, Kiva 88% on-time (higher quality)\n• New vendor application from Pacific Roots — samples arriving next week\n\nSofia is asking Rachel about scheduling a tasting.`,

  'ai-alerts': (count, names) =>
    `**AI Alerts** digest (${count} messages):\n\n• Weekly sales: $62,800 revenue (+8.2% WoW), 1,080 orders\n• Weekly sentiment: **4.3/5.0** (+0.2), 78% positive reviews\n• Bug ticket CB-5201 filed for POS sync delay\n• 🔴 1-star review flagged — 45-min wait time, root cause: POS sync delay\n• Positive trend: "Delivery speed" mentions up **34%**\n• I recommended increasing Kiva Camino Gummies order by 25%\n\nLisa is drafting a response to the negative review.`,
};

// Build initial messages-by-space from seeded data
function buildInitialMessages() {
  const msgs = {};
  DTCH_SPACES.forEach(s => {
    msgs[s.id] = DTCH_INITIAL_MESSAGES[s.id] ? [...DTCH_INITIAL_MESSAGES[s.id]] : [];
  });
  return msgs;
}

export default function DtchPanel({ mode = 'closed', onModeChange, onClose }) {
  const [messages, setMessages] = useState(buildInitialMessages);
  const [activeSpace, setActiveSpace] = useState('lounge');
  const [unreadCounts, setUnreadCounts] = useState({ ...DTCH_INITIAL_UNREADS });
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState({}); // spaceId -> Set of message IDs

  // useRef for activeSpace so setTimeout closures see the current value
  const activeSpaceRef = useRef(activeSpace);
  useEffect(() => {
    activeSpaceRef.current = activeSpace;
  }, [activeSpace]);

  // Escape key to close
  useEffect(() => {
    if (mode === 'closed') return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, onClose]);

  // Select a space — clears unread for that space
  const handleSelectSpace = useCallback((spaceId) => {
    setActiveSpace(spaceId);
    setUnreadCounts(prev => ({ ...prev, [spaceId]: 0 }));
  }, []);

  // Add message to a specific space, increment unread if not active
  const addMessageToSpace = useCallback((spaceId, msg) => {
    setMessages(prev => ({
      ...prev,
      [spaceId]: [...(prev[spaceId] || []), msg],
    }));
    // Increment unread if message is in a non-active space
    if (spaceId !== activeSpaceRef.current) {
      setUnreadCounts(prev => ({
        ...prev,
        [spaceId]: (prev[spaceId] || 0) + 1,
      }));
    }
  }, []);

  // Navigate to space from route notice
  const handleNavigateToSpace = useCallback((spaceId) => {
    handleSelectSpace(spaceId);
  }, [handleSelectSpace]);

  // Pin / unpin a message in the current space
  const handlePinMessage = useCallback((messageId) => {
    const spaceId = activeSpaceRef.current;
    setPinnedMessages(prev => {
      const current = new Set(prev[spaceId] || []);
      if (current.has(messageId)) {
        current.delete(messageId);
      } else {
        current.add(messageId);
      }
      return { ...prev, [spaceId]: current };
    });
  }, []);

  // Delete a message from the current space
  const handleDeleteMessage = useCallback((messageId) => {
    const spaceId = activeSpaceRef.current;
    setMessages(prev => {
      const spaceMsgs = prev[spaceId];
      if (!spaceMsgs) return prev;
      return { ...prev, [spaceId]: spaceMsgs.filter(m => m.id !== messageId) };
    });
    // Also remove from pinned if pinned
    setPinnedMessages(prev => {
      const current = new Set(prev[spaceId] || []);
      if (current.has(messageId)) {
        current.delete(messageId);
        return { ...prev, [spaceId]: current };
      }
      return prev;
    });
  }, []);

  // Catch Me Up — Bridge generates a summary of the current space
  const handleCatchUp = useCallback(() => {
    const spaceId = activeSpaceRef.current;
    const spaceMsgs = messages[spaceId] || [];
    const count = spaceMsgs.length;

    if (count === 0) {
      const emptyMsg = {
        id: `catchup-${Date.now()}`,
        userId: 'bridge',
        timestamp: new Date().toISOString(),
        text: "Nothing to catch up on — this space is quiet. Try asking me something or use `/` commands to get started.",
        reactions: [{ emoji: '🤖', count: 1, users: ['bridge'] }],
      };
      addMessageToSpace(spaceId, emptyMsg);
      return;
    }

    setTypingIndicator(true);
    setTypingUser(null);

    setTimeout(() => {
      setTypingIndicator(false);
      const uniqueUsers = [...new Set(spaceMsgs.map(m => m.userId).filter(id => id !== CURRENT_USER.id && id !== 'bridge'))];
      const names = uniqueUsers.map(id => TEAM_MEMBERS[id]?.name || id).slice(0, 4).join(', ');

      const summaryFn = CATCH_UP_SUMMARIES[spaceId];
      const summaryText = summaryFn
        ? summaryFn(count, names)
        : `Here's a summary of **${count} messages** in this space. Active participants: ${names || 'Bridge'}. Check the thread above for full context.`;

      const catchUpMsg = {
        id: `catchup-${Date.now()}`,
        userId: 'bridge',
        timestamp: new Date().toISOString(),
        text: `✨ **Catch Me Up** — ${summaryText}`,
        reactions: [{ emoji: '✨', count: 1, users: ['bridge'] }],
      };
      addMessageToSpace(spaceId, catchUpMsg);
    }, 1200 + Math.random() * 800);
  }, [messages, addMessageToSpace]);

  // Send message
  const handleSend = useCallback((text) => {
    const currentSpaceId = activeSpaceRef.current;

    const userMsg = {
      id: `user-${Date.now()}`,
      userId: CURRENT_USER.id,
      timestamp: new Date().toISOString(),
      text,
    };

    // Add user message to current space
    addMessageToSpace(currentSpaceId, userMsg);

    // Run bridge engine with current space context
    const response = processDtchMessage(text, currentSpaceId);

    setTypingIndicator(true);
    setTypingUser(null); // Nexus Chat

    const botDelay = 1500 + Math.random() * 1000;
    const targetSpaceId = response.targetSpace || currentSpaceId;

    setTimeout(() => {
      setTypingIndicator(false);

      const botMsg = {
        id: `bot-${Date.now()}`,
        userId: 'bridge',
        timestamp: new Date().toISOString(),
        text: response.text,
        mentions: response.mentions || [],
        component: response.component || null,
        componentData: response.data || null,
        reactions: [{ emoji: '🤖', count: 1, users: ['bridge'] }],
      };

      // If routing to a different space, post routing notice in source + response in target
      if (response.targetSpace) {
        const targetMeta = DTCH_SPACES.find(s => s.id === response.targetSpace);
        const targetName = targetMeta ? targetMeta.name : response.targetSpace;

        // Routing notice in source space
        const routeNotice = {
          id: `route-${Date.now()}`,
          userId: 'bridge',
          timestamp: new Date().toISOString(),
          text: `Routed to **${targetName}**`,
          isRouteNotice: true,
          routeTarget: response.targetSpace,
        };
        addMessageToSpace(currentSpaceId, routeNotice);

        // Bot response in target space
        addMessageToSpace(response.targetSpace, botMsg);

        // Auto-switch to target space after a brief moment
        setTimeout(() => {
          handleSelectSpace(response.targetSpace);
        }, 600);
      } else {
        // Normal: post in current space
        addMessageToSpace(currentSpaceId, botMsg);
      }

      // Schedule approval prompt for actionable intents
      const actionableIntents = ['marketing', 'reporting', 'reviews', 'sentiment', 'connect', 'feedback', 'factory'];
      if (actionableIntents.includes(response.intent)) {
        scheduleApprovalPrompt(response.intent, targetSpaceId);
      }
    }, botDelay);
  }, [addMessageToSpace, handleSelectSpace]);

  // Post an interactive approval prompt ~500ms after bot response
  const scheduleApprovalPrompt = useCallback((intent, spaceId) => {
    const approverId = INTENT_APPROVERS[intent];
    if (!approverId) return;
    const approver = TEAM_MEMBERS[approverId];
    if (!approver) return;

    setTimeout(() => {
      const promptMsg = {
        id: `prompt-${Date.now()}`,
        userId: 'bridge',
        timestamp: new Date().toISOString(),
        isApprovalPrompt: true,
        approvalTarget: approverId,
        approvalIntent: intent,
        text: `Should I tag **@${approver.name}** (${approver.role}) for approval?`,
        handled: false,
      };
      addMessageToSpace(spaceId, promptMsg);
    }, 500);
  }, [addMessageToSpace]);

  // Handle "Yes" click on approval prompt
  const handleApproveTag = useCallback((messageId) => {
    setMessages(prev => {
      const updated = { ...prev };
      for (const spaceId of Object.keys(updated)) {
        const msgs = updated[spaceId];
        const idx = msgs.findIndex(m => m.id === messageId);
        if (idx !== -1) {
          const newMsgs = [...msgs];
          const prompt = { ...newMsgs[idx], handled: true, approved: true };
          newMsgs[idx] = prompt;
          updated[spaceId] = newMsgs;

          const approverId = prompt.approvalTarget;
          const intent = prompt.approvalIntent;
          const approver = TEAM_MEMBERS[approverId];
          if (!approver) break;

          const targetSpace = INTENT_ROUTING[intent] || spaceId;

          if (targetSpace !== activeSpaceRef.current) {
            const targetMeta = DTCH_SPACES.find(s => s.id === targetSpace);
            const targetName = targetMeta ? targetMeta.name : targetSpace;

            const routeNotice = {
              id: `route-approve-${Date.now()}`,
              userId: 'bridge',
              timestamp: new Date().toISOString(),
              text: `Routed to **${targetName}**`,
              isRouteNotice: true,
              routeTarget: targetSpace,
            };
            updated[activeSpaceRef.current] = [...(updated[activeSpaceRef.current] || []), routeNotice];

            setTimeout(() => {
              handleSelectSpace(targetSpace);
            }, 600);
          }

          const tagMsg = {
            id: `tag-${Date.now()}`,
            userId: 'bridge',
            timestamp: new Date().toISOString(),
            text: `📋 @${approver.name} — please review and approve.`,
            mentions: [approverId],
            reactions: [{ emoji: '🤖', count: 1, users: ['bridge'] }],
          };

          updated[targetSpace] = [...(updated[targetSpace] || []), tagMsg];

          if (targetSpace !== activeSpaceRef.current) {
            setUnreadCounts(prevU => ({
              ...prevU,
              [targetSpace]: (prevU[targetSpace] || 0) + 1,
            }));
          }

          const replies = APPROVAL_MESSAGES[intent] || APPROVAL_MESSAGES.marketing;
          const reply = replies[Math.floor(Math.random() * replies.length)];

          setTimeout(() => {
            setTypingIndicator(true);
            setTypingUser(approver.name);
          }, 7000);

          setTimeout(() => {
            setTypingIndicator(false);
            setTypingUser(null);
            const approverMsg = {
              id: `approval-${Date.now()}`,
              userId: approverId,
              timestamp: new Date().toISOString(),
              text: reply,
              reactions: [{ emoji: '✅', count: 1, users: [approverId] }],
            };
            addMessageToSpace(targetSpace, approverMsg);
          }, 10000);

          break;
        }
      }
      return updated;
    });
  }, [addMessageToSpace, handleSelectSpace]);

  // Handle "No" click on approval prompt
  const handleDeclineTag = useCallback((messageId) => {
    setMessages(prev => {
      const updated = { ...prev };
      for (const spaceId of Object.keys(updated)) {
        const msgs = updated[spaceId];
        const idx = msgs.findIndex(m => m.id === messageId);
        if (idx !== -1) {
          const newMsgs = [...msgs];
          newMsgs[idx] = { ...newMsgs[idx], handled: true, approved: false };
          updated[spaceId] = newMsgs;

          const dismissMsg = {
            id: `dismiss-${Date.now()}`,
            userId: 'bridge',
            timestamp: new Date().toISOString(),
            text: "Got it — skipping the tag. Let me know if you change your mind.",
            reactions: [{ emoji: '🤖', count: 1, users: ['bridge'] }],
          };
          updated[spaceId] = [...updated[spaceId], dismissMsg];
          break;
        }
      }
      return updated;
    });
  }, []);

  // Toggle reaction
  const handleToggleReaction = useCallback((messageId, emoji) => {
    setMessages(prev => {
      const spaceId = activeSpaceRef.current;
      const spaceMsgs = prev[spaceId];
      if (!spaceMsgs) return prev;

      const idx = spaceMsgs.findIndex(m => m.id === messageId);
      if (idx === -1) return prev;

      const msgs = [...spaceMsgs];
      const msg = { ...msgs[idx] };
      const reactions = msg.reactions ? [...msg.reactions] : [];
      const rIdx = reactions.findIndex(r => r.emoji === emoji);

      if (rIdx >= 0) {
        const reaction = { ...reactions[rIdx], users: [...reactions[rIdx].users] };
        const uIdx = reaction.users.indexOf(CURRENT_USER.id);
        if (uIdx >= 0) {
          reaction.users.splice(uIdx, 1);
          reaction.count--;
          if (reaction.count <= 0) reactions.splice(rIdx, 1);
          else reactions[rIdx] = reaction;
        } else {
          reaction.users.push(CURRENT_USER.id);
          reaction.count++;
          reactions[rIdx] = reaction;
        }
      } else {
        reactions.push({ emoji, count: 1, users: [CURRENT_USER.id] });
      }

      msg.reactions = reactions;
      msgs[idx] = msg;
      return { ...prev, [spaceId]: msgs };
    });
  }, []);

  if (mode === 'closed') return null;

  const currentMessages = messages[activeSpace] || [];
  const currentPinnedIds = pinnedMessages[activeSpace] ? [...pinnedMessages[activeSpace]] : [];
  const activeSpaceMeta = DTCH_SPACES.find(s => s.id === activeSpace);

  const totalUnreads = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // ─── RAIL MODE (48px strip) ───
  if (mode === 'rail') {
    return (
      <div className="fixed right-0 top-0 bottom-0 w-12 z-[70] bg-[#0D1117] border-l border-[#30363D] flex flex-col items-center py-2 transition-all duration-200">
        {/* DTCH icon */}
        <div className="w-8 h-8 rounded-lg bg-[#00C27C] flex items-center justify-center mb-3 cursor-pointer"
          onClick={() => onModeChange('full')}
          title="Open DTCH"
        >
          <span className="text-white font-bold text-[10px]">D</span>
        </div>

        {/* Space emojis */}
        <div className="flex-1 overflow-y-auto space-y-1 w-full px-1">
          {DTCH_SPACES.map(space => {
            const unread = unreadCounts[space.id] || 0;
            const isActive = space.id === activeSpace;
            return (
              <button
                key={space.id}
                onClick={() => { handleSelectSpace(space.id); onModeChange('full'); }}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-colors mx-auto ${
                  isActive ? 'bg-[#00C27C]/15' : 'hover:bg-white/[0.06]'
                }`}
                title={space.name}
              >
                {space.emoji}
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#00C27C] text-white text-[8px] font-bold px-0.5 leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#484F58] hover:text-[#C9D1D9] hover:bg-white/[0.06] transition-colors mt-2"
          title="Close DTCH"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ─── SIDEBAR / FULL MODES ───
  const isFull = mode === 'full';
  const panelWidth = isFull ? 'w-full' : 'w-[640px]';

  return (
    <>
      {/* Backdrop — only in full mode */}
      {isFull && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 animate-dtch-fade-in"
          onClick={() => onModeChange('sidebar')}
        />
      )}

      {/* Panel */}
      <div className={`fixed right-0 top-0 bottom-0 z-[70] ${panelWidth} bg-[#0D1117] ${isFull ? '' : 'border-l border-[#30363D]'} shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363D] bg-[#161B22] flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded bg-[#00C27C] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-[10px]">D</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-[#F0F6FC]">DTCH</span>
            <span className="text-sm font-medium text-[#484F58]">Team Chat</span>
          </div>
          <div className="flex items-center gap-0.5">
            <DtchNotificationCenter
              messages={messages}
              onNavigateToSpace={handleNavigateToSpace}
            />
            {!isFull && (
              <button className="p-1.5 rounded-lg text-[#484F58] hover:text-[#C9D1D9] hover:bg-white/[0.06] transition-colors"
                title="Collapse to rail"
                onClick={() => onModeChange('rail')}>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              className="p-1.5 rounded-lg text-[#484F58] hover:text-[#C9D1D9] hover:bg-white/[0.06] transition-colors"
              onClick={() => onModeChange(isFull ? 'sidebar' : 'full')}
              title={isFull ? 'Exit full screen' : 'Full screen'}
            >
              {isFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 min-h-0">
          {/* Channel bar — always shown */}
          <DtchChannelBar
            activeSpace={activeSpace}
            unreadCounts={unreadCounts}
            onSelectSpace={handleSelectSpace}
          />

          {/* Message area */}
          <div className="flex flex-col flex-1 min-w-0">
            <DtchMessageList
              messages={currentMessages}
              typingIndicator={typingIndicator}
              typingUser={typingUser}
              onSuggestionClick={handleSend}
              onToggleReaction={handleToggleReaction}
              activeSpace={activeSpace}
              onNavigateToSpace={handleNavigateToSpace}
              onApproveTag={handleApproveTag}
              onDeclineTag={handleDeclineTag}
              onPinMessage={handlePinMessage}
              onDeleteMessage={handleDeleteMessage}
              pinnedMessageIds={currentPinnedIds}
              onCatchUp={handleCatchUp}
            />
            <DtchMessageInput
              onSend={handleSend}
              onCatchUp={handleCatchUp}
              activeSpace={activeSpace}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dtch-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-dtch-fade-in {
          animation: dtch-fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
