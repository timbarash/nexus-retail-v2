import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, Users, Pin, MessageSquare } from 'lucide-react';
import { DTCH_SPACES } from '../../data/dtchMockData';
import DtchMessage from './DtchMessage';

const BRIDGE_SUGGESTION_CHIPS = [
  'Run a Jeeter campaign',
  'What products need reordering?',
  'Show me recent reviews',
  "How's our sentiment?",
  'Weekly sales report',
  'The checkout page is broken',
];

function formatDateSeparator(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DateSeparator({ label }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 h-px bg-[#21262D]" />
      <span className="text-[11px] font-medium text-[#484F58] px-2">{label}</span>
      <div className="flex-1 h-px bg-[#21262D]" />
    </div>
  );
}

function SpaceHeader({ spaceMeta, onCatchUp, messageCount, pinnedCount }) {
  if (!spaceMeta) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[#30363D] bg-[#0D1117] flex-shrink-0">
      <span className="text-base">{spaceMeta.emoji}</span>
      <span className="text-sm font-bold text-[#F0F6FC]">{spaceMeta.name}</span>
      <div className="flex items-center gap-2 ml-1">
        <span className="inline-flex items-center gap-1 text-[10px] text-[#484F58] bg-[#161B22] rounded-full px-2 py-0.5 border border-[#21262D]">
          <Users className="w-3 h-3" />
          8
        </span>
        {pinnedCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] text-[#D29922] bg-[#D29922]/10 rounded-full px-2 py-0.5 border border-[#D29922]/20">
            <Pin className="w-3 h-3" />
            {pinnedCount}
          </span>
        )}
      </div>
      <div className="flex-1" />
      <button
        onClick={onCatchUp}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#00C27C] bg-[#00C27C]/[0.08] hover:bg-[#00C27C]/[0.15] border border-[#00C27C]/20 transition-colors flex-shrink-0"
        title="Get an AI summary of this space"
      >
        <Sparkles className="w-3 h-3" />
        Catch me up
      </button>
    </div>
  );
}

function PinnedSection({ pinnedMessages, onToggleReaction, onNavigateToSpace, onPinMessage, onDeleteMessage, pinnedMessageIds }) {
  const [expanded, setExpanded] = useState(false);

  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  return (
    <div className="border-b border-[#30363D]/50 bg-[#161B22]/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-[#D29922] hover:bg-white/[0.02] transition-colors"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span>📌</span>
        <span>{pinnedMessages.length} pinned message{pinnedMessages.length !== 1 ? 's' : ''}</span>
      </button>
      {expanded && (
        <div className="pb-2 space-y-0.5">
          {pinnedMessages.map(msg => (
            <DtchMessage
              key={`pin-${msg.id}`}
              message={msg}
              onToggleReaction={onToggleReaction}
              onNavigateToSpace={onNavigateToSpace}
              onPinMessage={onPinMessage}
              onDeleteMessage={onDeleteMessage}
              isPinned={true}
              isCompact
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Compute whether a message should be grouped with the previous one
function computeGrouping(messages) {
  return messages.map((msg, i) => {
    if (i === 0) return false;
    if (msg.isRouteNotice || msg.isApprovalPrompt) return false;
    const prev = messages[i - 1];
    if (prev.isRouteNotice || prev.isApprovalPrompt) return false;
    if (msg.userId !== prev.userId) return false;
    // Same sender within 5 minutes
    const timeDiff = new Date(msg.timestamp) - new Date(prev.timestamp);
    return timeDiff < 5 * 60 * 1000;
  });
}

// Compute date separator positions
function computeDateSeparators(messages) {
  const separators = {};
  let lastDateStr = null;
  messages.forEach((msg, i) => {
    const dateStr = new Date(msg.timestamp).toDateString();
    if (dateStr !== lastDateStr) {
      separators[i] = formatDateSeparator(msg.timestamp);
      lastDateStr = dateStr;
    }
  });
  return separators;
}

export default function DtchMessageList({
  messages,
  typingIndicator,
  typingUser,
  onSuggestionClick,
  onToggleReaction,
  activeSpace,
  onNavigateToSpace,
  onApproveTag,
  onDeclineTag,
  onPinMessage,
  onDeleteMessage,
  pinnedMessageIds,
  onCatchUp,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);

  const spaceMeta = DTCH_SPACES.find(s => s.id === activeSpace);
  const isBridgeSpace = spaceMeta?.section === 'Bridge';

  const pinnedSet = new Set(pinnedMessageIds || []);
  const pinnedMessages = messages.filter(m => pinnedSet.has(m.id));
  const pinnedCount = pinnedMessages.length;

  const grouping = computeGrouping(messages);
  const dateSeparators = computeDateSeparators(messages);

  // Welcome / empty state
  if (messages.length === 0) {
    if (isBridgeSpace) {
      // Bridge spaces — show AI prompt with suggestion chips
      return (
        <div className="flex flex-col flex-1 min-h-0">
          <SpaceHeader spaceMeta={spaceMeta} onCatchUp={onCatchUp} messageCount={0} pinnedCount={0} />
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center space-y-4 max-w-md">
              <MessageSquare className="w-10 h-10 text-[#30363D] mx-auto" />
              <div className="text-lg font-semibold text-[#F0F6FC]">{spaceMeta?.name || 'Bridge'}</div>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                Your AI-powered command center. Ask about campaigns, inventory, reviews, sentiment, reports — or anything else.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {BRIDGE_SUGGESTION_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick(chip)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#30363D] text-[#C9D1D9] hover:border-[#00C27C]/50 hover:text-[#00C27C] hover:bg-[#00C27C]/[0.06] transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Non-Bridge spaces — emoji + description empty state
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <SpaceHeader spaceMeta={spaceMeta} onCatchUp={onCatchUp} messageCount={0} pinnedCount={0} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center space-y-3 max-w-sm">
            <MessageSquare className="w-10 h-10 text-[#30363D] mx-auto" />
            <div className="text-lg font-semibold text-[#F0F6FC]">{spaceMeta?.name || 'Space'}</div>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              {spaceMeta?.description || 'Start the conversation'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SpaceHeader spaceMeta={spaceMeta} onCatchUp={onCatchUp} messageCount={messages.length} pinnedCount={pinnedCount} />
      <PinnedSection
        pinnedMessages={pinnedMessages}
        onToggleReaction={onToggleReaction}
        onNavigateToSpace={onNavigateToSpace}
        onPinMessage={onPinMessage}
        onDeleteMessage={onDeleteMessage}
        pinnedMessageIds={pinnedMessageIds}
      />
      <div className="flex-1 overflow-y-auto py-3">
        {messages.map((msg, i) => (
          <React.Fragment key={msg.id}>
            {dateSeparators[i] && <DateSeparator label={dateSeparators[i]} />}
            <DtchMessage
              message={msg}
              onToggleReaction={onToggleReaction}
              onNavigateToSpace={onNavigateToSpace}
              onApproveTag={onApproveTag}
              onDeclineTag={onDeclineTag}
              onPinMessage={onPinMessage}
              onDeleteMessage={onDeleteMessage}
              isPinned={pinnedSet.has(msg.id)}
              isGrouped={grouping[i]}
            />
          </React.Fragment>
        ))}

        {/* Typing indicator */}
        {typingIndicator && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-9 h-9 rounded-lg bg-[#00C27C] flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-white">{typingUser ? typingUser.split(' ').map(n => n[0]).join('') : 'CB'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-[#484F58] ml-1">{typingUser || 'Nexus Chat'} is typing...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
