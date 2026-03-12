import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { TEAM_MEMBERS, CURRENT_USER } from '../../data/slackMockData';

const allMembers = Object.values(TEAM_MEMBERS).filter(m => m.id !== CURRENT_USER.id);

export default function SlackMessageInput({ channelName, onSend }) {
  const [text, setText] = useState('');
  const [mentionQuery, setMentionQuery] = useState(null); // null = not active
  const [mentionIndex, setMentionIndex] = useState(0);
  const textareaRef = useRef(null);

  const filteredMembers = mentionQuery !== null
    ? allMembers.filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  function handleChange(e) {
    const val = e.target.value;
    setText(val);

    // Check for @mention trigger
    const cursorPos = e.target.selectionStart;
    const beforeCursor = val.slice(0, cursorPos);
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

  function handleKeyDown(e) {
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
  }

  return (
    <div className="relative px-4 pb-4">
      {/* @mention autocomplete dropdown */}
      {mentionQuery !== null && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl overflow-hidden z-10">
          {filteredMembers.map((member, i) => (
            <button
              key={member.id}
              onClick={() => insertMention(member)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === mentionIndex ? 'bg-[rgba(88,166,255,0.12)]' : 'hover:bg-white/[0.04]'
              }`}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
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

      <div className="flex items-end gap-2 bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 focus-within:border-[#484F58] transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#C9D1D9] placeholder-[#484F58] resize-none outline-none max-h-24 leading-relaxed"
          style={{ minHeight: '24px' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
            text.trim()
              ? 'text-[#00C27C] hover:bg-[rgba(0,194,124,0.1)]'
              : 'text-[#484F58] cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
