import React from 'react';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';
import SlackAttachment from './SlackAttachment';

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

function parseMessageText(text) {
  // Split on @Name patterns and **bold** patterns
  const parts = [];
  const regex = /(@[\w\s]+?)(?=\s[—\-–.]|\s[@*]|[,!?;:]|\s*$)|(\*\*(.+?)\*\*)/g;
  let lastIndex = 0;
  let match;

  // Simpler approach: process @mentions then bold
  let processed = text;
  const elements = [];

  // First pass: split by **bold**
  const boldParts = processed.split(/(\*\*.*?\*\*)/g);

  boldParts.forEach((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      elements.push({ type: 'bold', text: part.slice(2, -2), key: `b-${i}` });
    } else {
      // Second pass: split by @mentions
      const mentionParts = part.split(/(@\w[\w\s]*\w)/g);
      mentionParts.forEach((mPart, j) => {
        if (mPart.startsWith('@')) {
          // Verify it's a real team member mention
          const name = mPart.slice(1);
          const isMember = Object.values(TEAM_MEMBERS).some(m => m.name === name);
          if (isMember) {
            elements.push({ type: 'mention', text: mPart, key: `m-${i}-${j}` });
          } else {
            elements.push({ type: 'text', text: mPart, key: `t-${i}-${j}` });
          }
        } else {
          elements.push({ type: 'text', text: mPart, key: `t-${i}-${j}` });
        }
      });
    }
  });

  return elements.map(el => {
    if (el.type === 'bold') {
      return <strong key={el.key} className="font-semibold text-[#F0F6FC]">{el.text}</strong>;
    }
    if (el.type === 'mention') {
      return (
        <span key={el.key} className="bg-[rgba(88,166,255,0.15)] text-[#58A6FF] rounded px-1 py-0.5 font-medium">
          {el.text}
        </span>
      );
    }
    return <span key={el.key}>{el.text}</span>;
  });
}

export default function SlackMessage({ message, onToggleReaction, onOpenDetail }) {
  const user = TEAM_MEMBERS[message.userId];
  if (!user) return null;

  return (
    <div className="flex gap-3 px-4 py-2 hover:bg-white/[0.02] group">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
        style={{ backgroundColor: user.color }}
      >
        {user.initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm text-[#F0F6FC]">{user.name}</span>
          {user.isBot && (
            <span className="text-[10px] font-semibold bg-[rgba(0,194,124,0.15)] text-[#00C27C] rounded px-1.5 py-0.5 uppercase">
              app
            </span>
          )}
          <span className="text-xs text-[#484F58]">{user.role}</span>
          <span className="text-xs text-[#484F58]">{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Message text */}
        <p className="text-sm text-[#C9D1D9] mt-0.5 leading-relaxed whitespace-pre-wrap">
          {parseMessageText(message.text)}
        </p>

        {/* Attachment */}
        {message.attachment && (
          <SlackAttachment
            attachment={message.attachment}
            onDeepLink={message.deepLink && onOpenDetail ? () => onOpenDetail(message.deepLink) : undefined}
            deepLinkLabel={message.deepLink?.label}
          />
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.reactions.map((reaction, i) => {
              const isActive = reaction.users.includes(CURRENT_USER.id);
              return (
                <button
                  key={i}
                  onClick={() => onToggleReaction(message.id, reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                    isActive
                      ? 'bg-[rgba(88,166,255,0.12)] border-[#58A6FF]/30 text-[#58A6FF]'
                      : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#484F58]'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
