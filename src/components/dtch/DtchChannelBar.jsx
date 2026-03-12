import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DTCH_SPACES } from '../../data/dtchMockData';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';

const SECTION_COLORS = {
  Spaces: '#8B949E',
  Agents: '#00C27C',
  Team: '#58A6FF',
};

const STATUS_COLORS = {
  online: '#00C27C',
  away: '#D29922',
  offline: '#484F58',
};

const STATUS_LABELS = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

// Team members to display (non-bot)
const TEAM_LIST = Object.values(TEAM_MEMBERS).filter(m => !m.isBot);

function SectionGroup({ label, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = SECTION_COLORS[label] || '#8B949E';
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-3 pt-5 pb-2 hover:bg-white/[0.02] transition-colors"
      >
        {open
          ? <ChevronDown className="w-3 h-3 text-[#484F58]" />
          : <ChevronRight className="w-3 h-3 text-[#484F58]" />
        }
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? '500px' : '0', opacity: open ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

function SpaceButton({ space, isActive, unread, onClick, showAiBadge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] transition-all ${
        isActive
          ? 'border-l-2 border-l-[#00C27C] bg-white/[0.06] text-[#F0F6FC] font-medium'
          : 'border-l-2 border-transparent text-[#8B949E] hover:bg-white/[0.04] hover:text-[#C9D1D9]'
      }`}
    >
      <span className="flex-shrink-0 text-sm">{space.emoji}</span>
      <span className="truncate flex-1 text-left">{space.name}</span>
      {showAiBadge && (
        <span className="text-[9px] font-bold bg-[rgba(0,194,124,0.15)] text-[#00C27C] rounded px-1.5 py-0.5 uppercase flex-shrink-0 leading-none">
          AI
        </span>
      )}
      {unread > 0 && !isActive && (
        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#00C27C] text-white text-[10px] font-bold px-1 flex-shrink-0 leading-none">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
}

function MemberRow({ member }) {
  const statusColor = STATUS_COLORS[member.status] || STATUS_COLORS.offline;
  const statusLabel = STATUS_LABELS[member.status] || 'Offline';
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5">
      <div className="relative flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
          style={{ backgroundColor: member.color }}
        >
          {member.initials}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0D1117]"
          style={{ backgroundColor: statusColor }}
          title={statusLabel}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="truncate block text-[13px] text-[#C9D1D9]">{member.name}</span>
        <span className="text-[10px] text-[#484F58]">{member.role}</span>
      </div>
    </div>
  );
}

export default function DtchChannelBar({ activeSpace, unreadCounts, onSelectSpace }) {
  const hubAndOpsSpaces = DTCH_SPACES.filter(s => s.section === 'Hub' || s.section === 'Ops');
  const aiSpaces = DTCH_SPACES.filter(s => s.section === 'AI');

  const currentUser = CURRENT_USER;
  const currentUserMember = TEAM_MEMBERS[currentUser.id];

  return (
    <div className="w-48 flex-shrink-0 bg-[#0D1117] border-r border-[#30363D] flex flex-col">
      {/* Workspace header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#30363D]/50">
        <span className="text-sm font-bold text-[#F0F6FC] tracking-tight">DTCH</span>
        <span className="w-2 h-2 rounded-full bg-[#00C27C]" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-1 dtch-sidebar-scroll">
        {/* SPACES section */}
        <SectionGroup label="Spaces">
          {hubAndOpsSpaces.map(space => (
            <SpaceButton
              key={space.id}
              space={space}
              isActive={space.id === activeSpace}
              unread={unreadCounts[space.id] || 0}
              onClick={() => onSelectSpace(space.id)}
            />
          ))}
        </SectionGroup>

        {/* AI section */}
        <SectionGroup label="Agents">
          {aiSpaces.map(space => (
            <SpaceButton
              key={space.id}
              space={space}
              isActive={space.id === activeSpace}
              unread={unreadCounts[space.id] || 0}
              onClick={() => onSelectSpace(space.id)}
              showAiBadge
            />
          ))}
        </SectionGroup>

        {/* TEAM section */}
        <SectionGroup label="Team">
          {TEAM_LIST.map(member => (
            <MemberRow key={member.id} member={member} />
          ))}
        </SectionGroup>
      </div>

      {/* Current user footer */}
      {currentUserMember && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-t border-[#30363D]/50 bg-[#0D1117]">
          <div className="relative flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: currentUserMember.color }}
            >
              {currentUserMember.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0D1117] bg-[#00C27C]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#C9D1D9] truncate block">{currentUserMember.name}</span>
            <span className="text-[10px] text-[#00C27C]">Online</span>
          </div>
        </div>
      )}
    </div>
  );
}
