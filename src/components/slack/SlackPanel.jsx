import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { INITIAL_MESSAGES, CHANNELS, CURRENT_USER, TEAM_MEMBERS } from '../../data/slackMockData';
import SlackChannelSidebar from './SlackChannelSidebar';
import SlackMessageArea from './SlackMessageArea';
import { processSlackMessage } from './slackBridgeEngine';
import { CampaignPlan } from '../../pages/MarketingCampaigns';
import { ReorderView, ExploreView, RecommendationsView } from '../../pages/ConnectAgent';
import { BugTicketCard, FeatureCard, ReviewSummaryCard, SentimentSummaryCard, ReportSummaryCard } from '../dtch/DtchRichCards';

const DETAIL_TITLES = {
  campaign: 'Campaign Plan',
  report: 'Performance Report',
  reviews: 'Review Feed',
  sentiment: 'Sentiment Dashboard',
  reorder: 'Inventory Analysis',
  bug: 'Bug Ticket',
  feature: 'Feature Request',
};

function SlackDetailDrawer({ detail, onClose }) {
  function renderComponent() {
    switch (detail.type) {
      case 'campaign':
        return <CampaignPlan data={detail.data} onBack={null} />;
      case 'reorder':
        return <ReorderView data={detail.data} onBack={null} />;
      case 'report':
        return <ReportSummaryCard data={detail.data} />;
      case 'reviews':
        return <ReviewSummaryCard data={detail.data} />;
      case 'sentiment':
        return <SentimentSummaryCard data={detail.data} />;
      case 'bug':
        return <BugTicketCard data={detail.data} />;
      case 'feature':
        return <FeatureCard data={detail.data} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-[50%] min-w-[340px] border-l border-[#30363D] bg-[#0D1117] flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363D] bg-[#161B22] flex-shrink-0">
        <h3 className="text-sm font-semibold text-[#F0F6FC]">{DETAIL_TITLES[detail.type] || 'Detail View'}</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderComponent()}
      </div>
    </div>
  );
}

function deepCloneMessages(msgs) {
  return Object.fromEntries(
    Object.entries(msgs).map(([k, v]) => [
      k,
      v.map(m => ({
        ...m,
        reactions: m.reactions ? m.reactions.map(r => ({ ...r, users: [...r.users] })) : undefined,
      })),
    ])
  );
}

export default function SlackPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState(() => deepCloneMessages(INITIAL_MESSAGES));
  const [activeChannel, setActiveChannel] = useState('bridge-campaigns');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const counts = {};
    CHANNELS.forEach(c => { counts[c.id] = c.unread; });
    return counts;
  });

  // Escape key to close — if drawer is open, close drawer first
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') {
        if (detailView) {
          setDetailView(null);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, detailView]);

  // Clear unread when switching channels
  function handleSelectChannel(channelId) {
    setActiveChannel(channelId);
    setUnreadCounts(prev => ({ ...prev, [channelId]: 0 }));
  }

  // Send message — runs intent detection via bridge engine
  const handleSend = useCallback((text) => {
    const newMsg = {
      id: `user-${Date.now()}`,
      userId: CURRENT_USER.id,
      timestamp: new Date().toISOString(),
      text,
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));

    // Run the bridge engine to detect intent and generate a contextual response
    const response = processSlackMessage(text, activeChannel);
    const replyChannel = response.targetChannel || activeChannel;

    setTypingIndicator(true);
    setTypingUser(null); // default: "Nexus Chat"

    // If the response goes to a different channel, post a routing notice in the current channel first
    if (replyChannel !== activeChannel) {
      setTimeout(() => {
        const routingMsg = {
          id: `route-${Date.now()}`,
          userId: 'bridge',
          timestamp: new Date().toISOString(),
          text: `↗️ I've routed this to **#${replyChannel}** where the relevant team can see it. Switching you there now.`,
        };
        setMessages(prev => ({
          ...prev,
          [activeChannel]: [...(prev[activeChannel] || []), routingMsg],
        }));
      }, 800);
    }

    const botDelay = 1500 + Math.random() * 1000;

    setTimeout(() => {
      setTypingIndicator(false);
      const botMsg = {
        id: `bot-${Date.now()}`,
        userId: 'bridge',
        timestamp: new Date().toISOString(),
        text: response.text,
        mentions: response.mentions || [],
        attachment: response.attachment || undefined,
        deepLink: response.deepLink || undefined,
        reactions: [{ emoji: '🤖', count: 1, users: ['bridge'] }],
      };
      setMessages(prev => ({
        ...prev,
        [replyChannel]: [...(prev[replyChannel] || []), botMsg],
      }));

      // If cross-channel, switch to target channel and mark unread on it if not active
      if (replyChannel !== activeChannel) {
        setActiveChannel(replyChannel);
      }

      // Schedule Marcus's approval follow-up for actionable intents
      const actionableIntents = ['marketing', 'reporting', 'reviews', 'sentiment', 'connect', 'feedback', 'factory'];
      if (actionableIntents.includes(response.intent)) {
        scheduleTeamApproval(response.intent, replyChannel);
      }
    }, botDelay);
  }, [activeChannel]);

  // Schedule Marcus (or relevant lead) to respond ~15s after an action is created
  const scheduleTeamApproval = useCallback((intent, channel) => {
    const approvalMessages = {
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

    const replies = approvalMessages[intent] || approvalMessages.marketing;
    const reply = replies[Math.floor(Math.random() * replies.length)];

    // Show Marcus typing at ~12 seconds
    const typingDelay = 12000;
    const replyDelay = 15000;

    setTimeout(() => {
      setTypingIndicator(true);
      setTypingUser('Marcus Chen');
    }, typingDelay);

    setTimeout(() => {
      setTypingIndicator(false);
      setTypingUser(null);
      const marcusMsg = {
        id: `marcus-${Date.now()}`,
        userId: 'marcus',
        timestamp: new Date().toISOString(),
        text: reply,
        reactions: [{ emoji: '✅', count: 1, users: ['marcus'] }],
      };
      setMessages(prev => ({
        ...prev,
        [channel]: [...(prev[channel] || []), marcusMsg],
      }));
    }, replyDelay);
  }, []);

  // Toggle reaction
  const handleToggleReaction = useCallback((messageId, emoji) => {
    setMessages(prev => {
      const channelMsgs = [...(prev[activeChannel] || [])];
      const msgIndex = channelMsgs.findIndex(m => m.id === messageId);
      if (msgIndex === -1) return prev;

      const msg = { ...channelMsgs[msgIndex] };
      const reactions = msg.reactions ? [...msg.reactions] : [];
      const reactionIndex = reactions.findIndex(r => r.emoji === emoji);

      if (reactionIndex >= 0) {
        const reaction = { ...reactions[reactionIndex], users: [...reactions[reactionIndex].users] };
        const userIndex = reaction.users.indexOf(CURRENT_USER.id);
        if (userIndex >= 0) {
          reaction.users.splice(userIndex, 1);
          reaction.count--;
          if (reaction.count <= 0) {
            reactions.splice(reactionIndex, 1);
          } else {
            reactions[reactionIndex] = reaction;
          }
        } else {
          reaction.users.push(CURRENT_USER.id);
          reaction.count++;
          reactions[reactionIndex] = reaction;
        }
      } else {
        reactions.push({ emoji, count: 1, users: [CURRENT_USER.id] });
      }

      msg.reactions = reactions;
      channelMsgs[msgIndex] = msg;
      return { ...prev, [activeChannel]: channelMsgs };
    });
  }, [activeChannel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed z-[70] inset-2 sm:inset-4 lg:inset-8 rounded-2xl bg-[#0D1117] border border-[#30363D] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363D] bg-[#161B22] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#00C27C] flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">A</span>
            </div>
            <span className="text-sm font-semibold text-[#F0F6FC]">Ascend — Team Chat</span>
            <span className="text-[10px] text-[#484F58] bg-[#161B22] border border-[#30363D] rounded px-1.5 py-0.5">
              Slack Integration
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0">
          {/* Channel sidebar - hidden on very small screens */}
          <div className="hidden sm:flex">
            <SlackChannelSidebar
              activeChannel={activeChannel}
              unreadCounts={unreadCounts}
              onSelectChannel={handleSelectChannel}
            />
          </div>

          {/* Message area */}
          <SlackMessageArea
            activeChannel={activeChannel}
            messages={messages}
            typingIndicator={typingIndicator}
            typingUser={typingUser}
            onSend={handleSend}
            onToggleReaction={handleToggleReaction}
            onOpenDetail={setDetailView}
          />

          {/* Detail drawer */}
          {detailView && (
            <SlackDetailDrawer detail={detailView} onClose={() => setDetailView(null)} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
