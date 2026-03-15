import React, { useRef, useEffect } from 'react';
import { Hash, Users } from 'lucide-react';
import { CHANNELS } from '../../data/slackMockData';
import SlackMessage from './SlackMessage';
import SlackMessageInput from './SlackMessageInput';

export default function SlackMessageArea({ activeChannel, messages, typingIndicator, typingUser, onSend, onToggleReaction, onOpenDetail }) {
  const scrollRef = useRef(null);
  const channel = CHANNELS.find(c => c.id === activeChannel);
  const channelMessages = messages[activeChannel] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages.length, activeChannel]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Channel header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30363D] flex-shrink-0">
        <Hash className="w-5 h-5 text-[#8B949E]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-[#F0F6FC]">{channel?.name}</h2>
          <p className="text-xs text-[#484F58] truncate">{channel?.description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#484F58]">
          <Users className="w-3.5 h-3.5" />
          <span>{channel?.members}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {channelMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Hash className="w-10 h-10 text-[#30363D] mb-2" />
            <p className="text-sm text-[#8B949E]">This is the start of <strong>#{channel?.name}</strong></p>
            <p className="text-xs text-[#484F58] mt-1">{channel?.description}</p>
          </div>
        ) : (
          channelMessages.map(msg => (
            <SlackMessage key={msg.id} message={msg} onToggleReaction={onToggleReaction} onOpenDetail={onOpenDetail} />
          ))
        )}

        {/* Typing indicator */}
        {typingIndicator && (
          <div className="px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C27C] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-[#8B949E] italic">{typingUser || 'Nexus Chat'} is typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <SlackMessageInput channelName={channel?.name || activeChannel} onSend={onSend} />
    </div>
  );
}
