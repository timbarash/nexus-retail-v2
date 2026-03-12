import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Smile, MoreHorizontal, Copy, Pin, Trash2, SmilePlus, ChevronDown as ChevronDownIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';
import { DTCH_SPACES } from '../../data/dtchMockData';
import { CampaignPlan } from '../../pages/MarketingCampaigns';
import { ReorderView, ExploreView, RecommendationsView } from '../../pages/ConnectAgent';
import { BugTicketCard, FeatureCard, KBCard, ReviewSummaryCard, SentimentSummaryCard, ReportSummaryCard, ShiftHandoffCard, POSAlertCard, ComplianceAlertCard } from './DtchRichCards';

const DUTCHIE_EMOJI = ':dutchie:';
const QUICK_EMOJIS = ['👍', '🎉', '🔥', '✅', '👀', '💯'];

function DutchieBadge({ size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg className={s} viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M55.4781 42.8893C48.9047 56.4498 32.7765 62.2585 19.216 55.6851C5.65557 49.1117 -0.153125 32.9836 6.42024 19.4231C12.9936 5.86262 29.1218 0.0539498 42.6823 6.62731C56.2427 13.2007 62.0514 29.3288 55.4781 42.8893Z" fill="#00C27C"/>
      <path d="M29.363 3.1173C28.5571 3.1173 27.7466 3.15216 26.9361 3.22653L27.0756 6.16498C27.8326 6.09527 28.5966 6.05808 29.363 6.05808C43.3779 6.05808 54.7469 17.427 54.7469 31.4419C54.7469 45.4568 43.3779 56.8258 29.363 56.8258C15.3481 56.8258 3.97919 45.4568 3.97919 31.4419C3.97919 24.5413 6.77484 18.0378 11.7275 13.2665L9.64498 11.0908C4.14489 16.3878 0.992188 23.6413 0.992188 31.4419C0.992188 47.1042 13.7007 59.8128 29.363 59.8128C45.0253 59.8128 57.7339 47.1042 57.7339 31.4419C57.7339 15.7796 45.0253 3.1173 29.363 3.1173Z" fill="white"/>
      <path d="M32.1324 21.7399C26.4277 21.7399 21.7959 26.3717 21.7959 32.0764C21.7959 37.7812 26.4277 42.413 32.1324 42.413C37.8371 42.413 42.4689 37.7812 42.4689 32.0764C42.4689 26.3717 37.8371 21.7399 32.1324 21.7399ZM32.1324 39.476C28.0494 39.476 24.733 36.1596 24.733 32.0764C24.733 27.9933 28.0494 24.6769 32.1324 24.6769C36.2155 24.6769 39.5319 27.9933 39.5319 32.0764C39.5319 36.1596 36.2155 39.476 32.1324 39.476Z" fill="white"/>
      <path d="M29.6161 14.974C28.4382 14.974 27.2649 15.0948 26.1148 15.327L26.7189 18.1924C27.6689 17.9997 28.6398 17.9021 29.6161 17.9021C37.4632 17.9021 43.8527 24.2893 43.8527 32.1387C43.8527 39.988 37.4632 46.3752 29.6161 46.3752C21.769 46.3752 15.3795 39.9857 15.3795 32.1387C15.3795 28.4416 16.8574 24.8793 19.4694 22.2487L17.4078 20.0498C14.2528 23.2281 12.4448 27.5296 12.4448 32.1364C12.4448 41.6073 20.1476 49.3099 29.6184 49.3099C39.0893 49.3099 46.7921 41.6073 46.7921 32.1364C46.7921 22.6655 39.0847 14.974 29.6161 14.974Z" fill="white"/>
    </svg>
  );
}

function EmojiDisplay({ emoji, size = 'sm' }) {
  if (emoji === DUTCHIE_EMOJI) return <DutchieBadge size={size} />;
  return <span>{emoji}</span>;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatHoverTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function parseMessageText(text) {
  const elements = [];
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  boldParts.forEach((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      elements.push(<strong key={`b-${i}`} className="font-semibold text-[#F0F6FC]">{part.slice(2, -2)}</strong>);
    } else {
      const mentionParts = part.split(/(@\w[\w\s]*\w)/g);
      mentionParts.forEach((mPart, j) => {
        if (mPart.startsWith('@')) {
          const name = mPart.slice(1);
          const isMember = Object.values(TEAM_MEMBERS).some(m => m.name === name);
          if (isMember) {
            elements.push(
              <span key={`m-${i}-${j}`} className="bg-[rgba(0,194,124,0.15)] text-[#00C27C] rounded px-1 py-0.5 font-medium">
                {mPart}
              </span>
            );
          } else {
            elements.push(<span key={`t-${i}-${j}`}>{mPart}</span>);
          }
        } else {
          elements.push(<span key={`t-${i}-${j}`}>{mPart}</span>);
        }
      });
    }
  });
  return elements;
}

function RichComponent({ component, data }) {
  if (!component) return null;

  switch (component) {
    case 'campaign':
      return (
        <div className="mt-2 max-h-[500px] overflow-y-auto rounded-lg border border-[#30363D]">
          <CampaignPlan data={data} onBack={null} />
        </div>
      );
    case 'reorder':
      return (
        <div className="mt-2 max-h-[500px] overflow-y-auto rounded-lg border border-[#30363D]">
          <ReorderView data={data} onBack={null} />
        </div>
      );
    case 'explore':
      return (
        <div className="mt-2 max-h-[500px] overflow-y-auto rounded-lg border border-[#30363D]">
          <ExploreView data={data} onBack={null} />
        </div>
      );
    case 'recommendations':
      return (
        <div className="mt-2 max-h-[500px] overflow-y-auto rounded-lg border border-[#30363D]">
          <RecommendationsView data={data} onBack={null} />
        </div>
      );
    case 'report':
      return <ReportSummaryCard data={data} />;
    case 'reviews':
      return <ReviewSummaryCard data={data} />;
    case 'sentiment':
      return <SentimentSummaryCard data={data} />;
    case 'bug':
      return <BugTicketCard data={data} />;
    case 'feature':
      return <FeatureCard data={data} />;
    case 'kb':
      return <KBCard data={data} />;
    case 'shift-handoff':
      return <ShiftHandoffCard data={data} />;
    case 'pos-alert':
      return <POSAlertCard data={data} />;
    case 'compliance':
      return <ComplianceAlertCard data={data} />;
    default:
      return null;
  }
}

function EmojiPicker({ messageId, onToggleReaction, onClose, anchorRef }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 220) });
    }
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const allEmojis = [DUTCHIE_EMOJI, ...QUICK_EMOJIS, '❤️', '😂', '😮', '😢', '🙏', '🚀', '💡', '⭐', '🎯', '💪', '👏', '🤝'];

  if (!pos) return null;

  return createPortal(
    <div ref={ref} style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }} className="bg-[#1C2128] border border-[#30363D] rounded-xl shadow-xl p-2 animate-fade-in" onMouseDown={(e) => e.stopPropagation()}>
      <p className="text-[10px] text-[#484F58] px-1 mb-1.5 font-medium">Add reaction</p>
      <div className="grid grid-cols-6 gap-0.5">
        {allEmojis.map(emoji => (
          <button
            key={emoji}
            onClick={(e) => { e.stopPropagation(); onToggleReaction(messageId, emoji); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-base transition-colors"
            title={emoji === DUTCHIE_EMOJI ? 'Dutchie' : emoji}
          >
            <EmojiDisplay emoji={emoji} size="md" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

function MoreMenu({ messageId, messageText, onPinMessage, isPinned, onDeleteMessage, onClose, anchorRef }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 160) });
    }
  }, [anchorRef]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const plain = (messageText || '').replace(/\*\*(.*?)\*\*/g, '$1');
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => onClose(), 600);
    });
  };

  if (!pos) return null;

  return createPortal(
    <div ref={ref} style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }} className="bg-[#1C2128] border border-[#30363D] rounded-xl shadow-xl py-1.5 min-w-[160px] animate-fade-in" onMouseDown={(e) => e.stopPropagation()}>
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#C9D1D9] hover:bg-white/[0.06] transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-[#8B949E]" />
        {copied ? 'Copied!' : 'Copy text'}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPinMessage?.(messageId); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#C9D1D9] hover:bg-white/[0.06] transition-colors"
      >
        <Pin className="w-3.5 h-3.5 text-[#8B949E]" />
        {isPinned ? 'Unpin message' : 'Pin message'}
      </button>
      <div className="border-t border-[#30363D] my-1" />
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteMessage?.(messageId); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete message
      </button>
    </div>,
    document.body
  );
}

function HoverActionBar({ messageId, messageText, onToggleReaction, onPinMessage, isPinned, onDeleteMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const emojiButtonRef = useRef(null);
  const moreButtonRef = useRef(null);

  const popoverOpen = showEmojiPicker || showMoreMenu;

  return (
    <div
      className={`absolute -top-3 right-4 flex items-center gap-0.5 bg-[#1C2128] border border-[#30363D] rounded-lg shadow-lg px-1 py-0.5 z-10 transition-opacity ${
        popoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
    >
      {QUICK_EMOJIS.slice(0, 3).map(emoji => (
        <button
          key={emoji}
          onClick={(e) => { e.stopPropagation(); onToggleReaction(messageId, emoji); }}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/[0.08] text-sm transition-colors"
          title={emoji}
        >
          {emoji}
        </button>
      ))}
      <div className="w-px h-4 bg-[#30363D] mx-0.5" />
      <button
        onClick={(e) => { e.stopPropagation(); onPinMessage?.(messageId); }}
        className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${
          isPinned ? 'text-[#00C27C] bg-[#00C27C]/10' : 'hover:bg-white/[0.08]'
        }`}
        title={isPinned ? 'Unpin message' : 'Pin message'}
      >
        📌
      </button>
      <button
        ref={emojiButtonRef}
        onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowMoreMenu(false); }}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
          showEmojiPicker ? 'bg-white/[0.08] text-[#F0F6FC]' : 'hover:bg-white/[0.08] text-[#484F58]'
        }`}
        title="Add reaction"
      >
        <SmilePlus className="w-3.5 h-3.5" />
      </button>
      <button
        ref={moreButtonRef}
        onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); setShowEmojiPicker(false); }}
        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
          showMoreMenu ? 'bg-white/[0.08] text-[#F0F6FC]' : 'hover:bg-white/[0.08] text-[#484F58]'
        }`}
        title="More actions"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
      {showEmojiPicker && (
        <EmojiPicker messageId={messageId} onToggleReaction={onToggleReaction} onClose={() => setShowEmojiPicker(false)} anchorRef={emojiButtonRef} />
      )}
      {showMoreMenu && (
        <MoreMenu messageId={messageId} messageText={messageText} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} onClose={() => setShowMoreMenu(false)} anchorRef={moreButtonRef} />
      )}
    </div>
  );
}

function ReactionPills({ reactions, messageId, onToggleReaction }) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {reactions.map((reaction, i) => {
        const isActive = reaction.users.includes(CURRENT_USER.id);
        return (
          <button
            key={i}
            onClick={() => onToggleReaction(messageId, reaction.emoji)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
              isActive
                ? 'bg-[rgba(0,194,124,0.12)] border-[#00C27C]/30 text-[#00C27C]'
                : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#484F58]'
            }`}
          >
            <EmojiDisplay emoji={reaction.emoji} />
            <span>{reaction.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function DtchMessage({ message, onToggleReaction, onNavigateToSpace, onApproveTag, onDeclineTag, onPinMessage, onDeleteMessage, isPinned, isCompact, isGrouped }) {
  const isCurrentUser = message.userId === CURRENT_USER.id;
  const [isExpanded, setIsExpanded] = useState(() => message.urgency === 'critical');

  // Urgency wrapper classes
  const urgencyClasses = message.urgency === 'critical'
    ? 'border-l-4 border-[#F85149] bg-[#F85149]/[0.06]'
    : message.urgency === 'action'
    ? 'border-l-4 border-[#D29922] bg-[#D29922]/[0.06]'
    : '';

  // Approval prompt — bot message with Yes/No buttons
  if (message.isApprovalPrompt) {
    const user = TEAM_MEMBERS[message.userId];
    if (!user) return null;
    return (
      <div className="group relative flex gap-3 px-4 py-1.5 hover:bg-[#161B22]/50 transition-colors">
        <HoverActionBar messageId={message.id} messageText={message.text} onToggleReaction={onToggleReaction} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} />
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
          style={{ backgroundColor: user.color }}
        >
          {user.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-semibold text-[13px] text-[#F0F6FC]">{user.name}</span>
            <span className="text-[9px] font-semibold bg-[rgba(0,194,124,0.15)] text-[#00C27C] rounded px-1.5 py-0.5 uppercase leading-none">AI</span>
            <span className="text-[10px] text-[#484F58]">{formatTimestamp(message.timestamp)}</span>
          </div>
          <p className="text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap mb-2.5">
            {parseMessageText(message.text)}
          </p>
          {message.handled ? (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                message.approved
                  ? 'bg-[#00C27C]/20 text-[#00C27C] border border-[#00C27C]/30'
                  : 'bg-[#30363D] text-[#8B949E] border border-[#484F58]'
              }`}>
                {message.approved ? '✓ Tagged' : 'Skipped'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApproveTag?.(message.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#00C27C] hover:bg-[#00E08E] text-white shadow-sm shadow-[#00C27C]/20 transition-colors"
              >
                Yes, tag them
              </button>
              <button
                onClick={() => onDeclineTag?.(message.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] transition-colors"
              >
                No, skip
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Route notice — inline pill
  if (message.isRouteNotice) {
    const targetMeta = DTCH_SPACES.find(s => s.id === message.routeTarget);
    return (
      <div className="flex justify-center px-4 py-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] text-xs">
          <span className="text-[#8B949E]">Routed to</span>
          <span className="font-semibold text-[#F0F6FC]">
            {targetMeta?.emoji} {targetMeta?.name || message.routeTarget}
          </span>
          <button
            onClick={() => onNavigateToSpace?.(message.routeTarget)}
            className="text-[#00C27C] hover:text-[#00E08E] font-medium transition-colors"
          >
            View →
          </button>
        </div>
      </div>
    );
  }

  // Current user message — Slack-style left-aligned flat layout
  if (isCurrentUser) {
    if (isGrouped) {
      return (
        <div className="group relative flex gap-3 px-4 py-0.5 hover:bg-[#161B22]/50 transition-colors">
          <HoverActionBar messageId={message.id} messageText={message.text} onToggleReaction={onToggleReaction} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} />
          <div className="w-9 flex-shrink-0 flex items-start justify-center">
            <span className="text-[10px] text-[#484F58] opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
              {formatHoverTime(message.timestamp)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap">
              {parseMessageText(message.text)}
            </p>
            <ReactionPills reactions={message.reactions} messageId={message.id} onToggleReaction={onToggleReaction} />
          </div>
        </div>
      );
    }

    return (
      <div className="group relative flex gap-3 px-4 py-1.5 hover:bg-[#161B22]/50 transition-colors">
        <HoverActionBar messageId={message.id} messageText={message.text} onToggleReaction={onToggleReaction} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} />
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white bg-[#00C27C]"
        >
          {CURRENT_USER.initials || 'You'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-semibold text-[13px] text-[#00C27C]">You</span>
            <span className="text-[10px] text-[#484F58]">{formatTimestamp(message.timestamp)}</span>
          </div>
          <p className="text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap">
            {parseMessageText(message.text)}
          </p>
          <ReactionPills reactions={message.reactions} messageId={message.id} onToggleReaction={onToggleReaction} />
        </div>
      </div>
    );
  }

  const user = TEAM_MEMBERS[message.userId];
  if (!user) return null;

  const isBot = user.isBot;

  // Grouped message — hide avatar + name, show hover timestamp
  if (isGrouped) {
    return (
      <div className="group relative flex gap-3 px-4 py-0.5 hover:bg-[#161B22]/50 transition-colors">
        <HoverActionBar messageId={message.id} messageText={message.text} onToggleReaction={onToggleReaction} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} />
        <div className="w-9 flex-shrink-0 flex items-start justify-center">
          <span className="text-[10px] text-[#484F58] opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
            {formatHoverTime(message.timestamp)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap">
            {parseMessageText(message.text)}
          </p>
          {/* Rich component (only for bot messages) */}
          {!isCompact && isBot && message.component && message.componentData && (
            <RichComponent component={message.component} data={message.componentData} />
          )}
          <ReactionPills reactions={message.reactions} messageId={message.id} onToggleReaction={onToggleReaction} />
        </div>
      </div>
    );
  }

  // Full message — avatar + name + body (Slack-style flat layout)
  const hasRichComponent = !isCompact && isBot && message.component && message.componentData;

  return (
    <div className={`group relative flex gap-3 px-4 py-1.5 hover:bg-[#161B22]/50 transition-colors ${urgencyClasses}`}>
      <HoverActionBar messageId={message.id} messageText={message.text} onToggleReaction={onToggleReaction} onPinMessage={onPinMessage} isPinned={isPinned} onDeleteMessage={onDeleteMessage} />
      {/* Pulsing dot for critical */}
      {message.urgency === 'critical' && (
        <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-[#F85149] animate-pulse" />
      )}
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
        style={{ backgroundColor: user.color }}
      >
        {user.initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-semibold text-[13px] text-[#F0F6FC]">{user.name}</span>
          {isBot && (
            <span className="text-[9px] font-semibold bg-[rgba(0,194,124,0.15)] text-[#00C27C] rounded px-1.5 py-0.5 uppercase leading-none">AI</span>
          )}
          {!isCompact && !isBot && <span className="text-[10px] text-[#484F58]">{user.role}</span>}
          <span className="text-[10px] text-[#484F58]">{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Message text — flat, no bubble */}
        <p className="text-sm text-[#C9D1D9] leading-relaxed whitespace-pre-wrap">
          {parseMessageText(message.text)}
        </p>

        {/* Rich component with collapse/expand */}
        {hasRichComponent && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-[#8B949E] hover:text-[#C9D1D9] mt-1 transition-colors"
            >
              {isExpanded ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />}
              {isExpanded ? 'Collapse details' : 'Show details'}
            </button>
            {isExpanded && (
              <RichComponent component={message.component} data={message.componentData} />
            )}
          </div>
        )}

        {/* Rich component (non-collapsible for messages without component field but with data) */}
        {!isCompact && isBot && !message.component && message.componentData && (
          <RichComponent component={message.component} data={message.componentData} />
        )}

        {/* Reactions */}
        <ReactionPills reactions={message.reactions} messageId={message.id} onToggleReaction={onToggleReaction} />
      </div>
    </div>
  );
}
