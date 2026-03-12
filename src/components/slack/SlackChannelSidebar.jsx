import React from 'react';
import { Hash, ChevronDown } from 'lucide-react';
import { CHANNELS } from '../../data/slackMockData';

const SECTIONS = ['General', 'Departments', 'Dutchie Bridge'];

export default function SlackChannelSidebar({ activeChannel, unreadCounts, onSelectChannel }) {
  return (
    <div className="w-56 flex-shrink-0 bg-[#0D1117] border-r border-[#30363D] flex flex-col">
      {/* Workspace header */}
      <div className="px-4 py-3 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#00C27C] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">A</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F0F6FC] leading-tight">Ascend</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00C27C]" />
              <span className="text-[10px] text-[#8B949E]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map(section => {
          const channels = CHANNELS.filter(c => c.section === section);
          return (
            <div key={section} className="mb-2">
              <button className="w-full flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#8B949E] uppercase tracking-wider hover:text-[#F0F6FC] transition-colors">
                <ChevronDown className="w-3 h-3" />
                {section}
              </button>
              {channels.map(channel => {
                const unread = unreadCounts[channel.id] || 0;
                const isActive = activeChannel === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`w-full flex items-center gap-2 px-4 py-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#1C2128] text-[#F0F6FC] font-medium'
                        : unread > 0
                          ? 'text-[#F0F6FC] font-semibold hover:bg-white/[0.04]'
                          : 'text-[#8B949E] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{channel.name}</span>
                    {unread > 0 && (
                      <span className="ml-auto bg-[#F85149] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
