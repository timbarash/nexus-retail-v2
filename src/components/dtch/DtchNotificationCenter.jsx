import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';
import { DTCH_SPACES } from '../../data/dtchMockData';

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

const TYPE_STYLES = {
  mention: { label: 'Mention', bg: 'bg-[#58A6FF]/10', text: 'text-[#58A6FF]', border: 'border-[#58A6FF]/20' },
  approval: { label: 'Approval', bg: 'bg-[#D29922]/10', text: 'text-[#D29922]', border: 'border-[#D29922]/20' },
  alert: { label: 'Alert', bg: 'bg-[#F85149]/10', text: 'text-[#F85149]', border: 'border-[#F85149]/20' },
};

export default function DtchNotificationCenter({ messages, onNavigateToSpace }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Collect notifications: @mentions of current user + approval prompts + alerts
  const notifications = [];

  for (const [spaceId, spaceMsgs] of Object.entries(messages)) {
    const spaceMeta = DTCH_SPACES.find(s => s.id === spaceId);
    for (const msg of spaceMsgs) {
      // @mentions of current user
      if (msg.mentions && msg.mentions.includes(CURRENT_USER.id)) {
        const sender = TEAM_MEMBERS[msg.userId];
        notifications.push({
          id: msg.id,
          type: 'mention',
          spaceId,
          spaceName: spaceMeta?.name || spaceId,
          spaceEmoji: spaceMeta?.emoji || '💬',
          senderName: sender?.name || 'Someone',
          senderInitials: sender?.initials || '??',
          senderColor: sender?.color || '#484F58',
          text: msg.text.slice(0, 100) + (msg.text.length > 100 ? '...' : ''),
          timestamp: msg.timestamp,
        });
      }

      // Pending approval prompts
      if (msg.isApprovalPrompt && !msg.handled) {
        notifications.push({
          id: msg.id,
          type: 'approval',
          spaceId,
          spaceName: spaceMeta?.name || spaceId,
          spaceEmoji: spaceMeta?.emoji || '💬',
          senderName: 'Nexus Chat',
          senderInitials: 'CB',
          senderColor: '#00C27C',
          text: msg.text.slice(0, 100) + (msg.text.length > 100 ? '...' : ''),
          timestamp: msg.timestamp,
        });
      }

      // Alert messages (contain emoji indicators like 🔴, 🚨, ⚠️)
      if (msg.userId === 'bridge' && !msg.isApprovalPrompt && !msg.isRouteNotice && /🔴|🚨|⚠️/.test(msg.text)) {
        notifications.push({
          id: `alert-${msg.id}`,
          type: 'alert',
          spaceId,
          spaceName: spaceMeta?.name || spaceId,
          spaceEmoji: spaceMeta?.emoji || '💬',
          senderName: 'Nexus Chat',
          senderInitials: 'CB',
          senderColor: '#00C27C',
          text: msg.text.slice(0, 100) + (msg.text.length > 100 ? '...' : ''),
          timestamp: msg.timestamp,
        });
      }
    }
  }

  // Sort newest first
  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const count = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-1.5 rounded-lg transition-colors ${
          open
            ? 'text-[#F0F6FC] bg-white/[0.08]'
            : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-white/[0.08]'
        }`}
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-[#F85149] text-white text-[9px] font-bold px-1 z-10">
              {count > 99 ? '99+' : count}
            </span>
            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 rounded-full bg-[#F85149] animate-ping opacity-40" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-96 max-h-96 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#30363D]">
            <Bell className="w-3.5 h-3.5 text-[#8B949E]" />
            <span className="text-xs font-bold text-[#F0F6FC]">Notifications</span>
            {count > 0 && (
              <span className="text-[9px] font-bold bg-[#F85149]/15 text-[#F85149] rounded-full px-1.5 py-0.5 leading-none">
                {count}
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="w-8 h-8 text-[#30363D] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#8B949E]">All caught up!</p>
              <p className="text-xs text-[#484F58] mt-1">No new notifications</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80">
              {notifications.slice(0, 20).map(notif => {
                const style = TYPE_STYLES[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      onNavigateToSpace(notif.spaceId);
                      setOpen(false);
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors border-b border-[#21262D] last:border-b-0"
                  >
                    {/* Unread green dot */}
                    <div className="flex-shrink-0 mt-2">
                      <span className="w-2 h-2 rounded-full bg-[#00C27C] block" />
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                      style={{ backgroundColor: notif.senderColor }}
                    >
                      {notif.senderInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border} leading-none`}>
                          {style.label}
                        </span>
                        <span className="text-[10px] text-[#484F58]">in {notif.spaceEmoji} {notif.spaceName}</span>
                        <span className="text-[10px] text-[#30363D] ml-auto flex-shrink-0">{formatTimeAgo(notif.timestamp)}</span>
                      </div>
                      <p className="text-xs text-[#8B949E] line-clamp-2 leading-relaxed">{notif.senderName}: {notif.text.replace(/\*\*/g, '')}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
