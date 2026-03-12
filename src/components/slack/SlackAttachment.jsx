import React from 'react';

export default function SlackAttachment({ attachment, onDeepLink, deepLinkLabel }) {
  const { color, title, fields, footer } = attachment;

  return (
    <div className="mt-2 flex">
      <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="ml-3 flex-1 bg-[#161B22] rounded-lg p-3 border border-[#30363D]">
        {title && (
          <p className="text-sm font-semibold text-[#F0F6FC] mb-2">{title}</p>
        )}
        {fields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {fields.map((field, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-[#8B949E]">{field.label}</p>
                <p className="text-sm text-[#C9D1D9]">{field.value}</p>
              </div>
            ))}
          </div>
        )}
        {footer && (
          <p className="mt-2 text-xs text-[#484F58] border-t border-[#30363D] pt-2">{footer}</p>
        )}
        {onDeepLink && (
          <button
            onClick={onDeepLink}
            className="mt-2 text-xs font-medium text-[#00C27C] hover:text-[#00E88F] transition-colors flex items-center gap-1"
          >
            {deepLinkLabel || 'View in Bridge'} <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
