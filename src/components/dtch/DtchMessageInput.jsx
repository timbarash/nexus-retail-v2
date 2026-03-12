import React, { useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';

const allMembers = Object.values(TEAM_MEMBERS).filter(m => m.id !== CURRENT_USER.id);

const SLASH_COMMANDS = [
  { command: '/campaign', label: 'Campaign', description: 'Draft a marketing campaign with Bridge', fill: 'Run a campaign for ', category: 'Marketing', emoji: '🚀' },
  { command: '/report', label: 'Sales Report', description: 'Generate a performance report', fill: 'Weekly sales report', category: 'Analytics', emoji: '📊' },
  { command: '/reviews', label: 'Reviews', description: 'Pull and analyze customer reviews', fill: 'Show me recent reviews', category: 'Analytics', emoji: '⭐' },
  { command: '/sentiment', label: 'Sentiment', description: 'Check customer sentiment and NPS', fill: "How's our sentiment?", category: 'Analytics', emoji: '💚' },
  { command: '/restock', label: 'Inventory', description: 'Check stock levels and reorder needs', fill: 'What products need reordering?', category: 'Operations', emoji: '📦' },
  { command: '/explore', label: 'Explore Products', description: 'Discover trending products to stock', fill: 'Explore new trending products', category: 'Operations', emoji: '🔍' },
  { command: '/bug', label: 'Report Bug', description: 'File a bug report via Bridge', fill: 'Report a bug: ', category: 'Support', emoji: '🐛' },
  { command: '/feature', label: 'Feature Request', description: 'Submit a feature request', fill: 'Feature request: ', category: 'Support', emoji: '💡' },
  { command: '/catchup', label: 'Catch Me Up', description: 'Get a Bridge AI summary of this space', fill: '__catchup__', category: 'Productivity', emoji: '✨' },
];

export default function DtchMessageInput({ onSend, onCatchUp, activeSpace }) {
  const [text, setText] = useState('');
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [slashQuery, setSlashQuery] = useState(null);
  const [slashIndex, setSlashIndex] = useState(0);
  const textareaRef = useRef(null);

  const filteredMembers = mentionQuery !== null
    ? allMembers.filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  const filteredCommands = slashQuery !== null
    ? SLASH_COMMANDS.filter(c =>
        c.command.toLowerCase().includes(slashQuery.toLowerCase()) ||
        c.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(slashQuery.toLowerCase())
      )
    : [];

  function handleChange(e) {
    const val = e.target.value;
    setText(val);

    const cursorPos = e.target.selectionStart;
    const beforeCursor = val.slice(0, cursorPos);

    // Slash command detection — only if "/" is at the very start
    if (beforeCursor.match(/^\/\S*$/) && !beforeCursor.includes(' ')) {
      setSlashQuery(beforeCursor);
      setSlashIndex(0);
      setMentionQuery(null);
      return;
    } else {
      setSlashQuery(null);
    }

    // @mention detection
    const atMatch = beforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  }

  function insertMention(member) {
    const cursorPos = textareaRef.current.selectionStart;
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);
    const atIndex = beforeCursor.lastIndexOf('@');
    const newText = beforeCursor.slice(0, atIndex) + `@${member.name} ` + afterCursor;
    setText(newText);
    setMentionQuery(null);
    textareaRef.current.focus();
  }

  function selectSlashCommand(cmd) {
    setSlashQuery(null);
    if (cmd.fill === '__catchup__') {
      setText('');
      onCatchUp?.();
    } else {
      setText(cmd.fill);
      textareaRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    // Slash command navigation
    if (slashQuery !== null && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashIndex(i => (i + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectSlashCommand(filteredCommands[slashIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setSlashQuery(null);
        return;
      }
    }

    // @mention navigation
    if (mentionQuery !== null && filteredMembers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(i => (i + 1) % filteredMembers.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(i => (i - 1 + filteredMembers.length) % filteredMembers.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        insertMention(filteredMembers[mentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    setMentionQuery(null);
    setSlashQuery(null);
  }

  const spaceName = activeSpace ? activeSpace.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'channel';

  return (
    <div className="relative px-4 pb-4">
      {/* Slash command palette */}
      {slashQuery !== null && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden z-10 max-h-[280px] overflow-y-auto">
          <div className="px-3 py-2 border-b border-[#30363D]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C27C]">Bridge Commands</span>
          </div>
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.command}
              onClick={() => selectSlashCommand(cmd)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === slashIndex ? 'bg-[rgba(0,194,124,0.08)] border-l-2 border-l-[#00C27C]' : 'border-l-2 border-transparent hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-base flex-shrink-0">{cmd.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#F0F6FC] font-medium">{cmd.label}</span>
                  <span className="text-[10px] text-[#484F58] font-mono">{cmd.command}</span>
                </div>
                <span className="text-xs text-[#8B949E]">{cmd.description}</span>
              </div>
              <span className="text-[10px] text-[#30363D] font-medium px-1.5 py-0.5 rounded bg-white/[0.04]">{cmd.category}</span>
            </button>
          ))}
        </div>
      )}

      {/* @mention autocomplete */}
      {mentionQuery !== null && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden z-10">
          <div className="px-3 py-2 border-b border-[#30363D]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#58A6FF]">Team Members</span>
          </div>
          {filteredMembers.map((member, i) => (
            <button
              key={member.id}
              onClick={() => insertMention(member)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === mentionIndex ? 'bg-[rgba(88,166,255,0.08)] border-l-2 border-l-[#58A6FF]' : 'border-l-2 border-transparent hover:bg-white/[0.04]'
              }`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <span className="text-sm text-[#F0F6FC] font-medium">{member.name}</span>
              <span className="text-xs text-[#484F58]">{member.role}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl focus-within:border-[#00C27C]/40 focus-within:shadow-[0_0_0_1px_rgba(0,194,124,0.15)] transition-all">
        <div className="flex items-end gap-2 px-3 py-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${spaceName}...`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-[#C9D1D9] placeholder-[#484F58] resize-none outline-none max-h-24 leading-relaxed"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={() => onCatchUp?.()}
            title="Catch me up"
            className="p-1.5 rounded-lg text-[#484F58] hover:text-[#00C27C] hover:bg-[#00C27C]/[0.08] transition-colors flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
              text.trim()
                ? 'text-white bg-[#00C27C] hover:bg-[#00E08E] shadow-sm shadow-[#00C27C]/20'
                : 'text-[#484F58] bg-[#21262D] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
