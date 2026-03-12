import React from 'react';

const sentimentConfig = {
  positive: {
    bg: 'bg-[rgba(0,163,94,0.12)]',
    text: 'text-[#00a35e]',
    border: 'border-[rgba(0,163,94,0.2)]',
    dot: 'bg-[#00a35e]',
  },
  neutral: {
    bg: 'bg-[rgba(217,119,6,0.12)]',
    text: 'text-[#d97706]',
    border: 'border-[rgba(217,119,6,0.2)]',
    dot: 'bg-[#d97706]',
  },
  negative: {
    bg: 'bg-[rgba(239,68,68,0.12)]',
    text: 'text-[#ef4444]',
    border: 'border-[rgba(239,68,68,0.2)]',
    dot: 'bg-[#ef4444]',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function SentimentBadge({ sentiment, score, size = 'md' }) {
  const config = sentimentConfig[sentiment] || sentimentConfig.neutral;
  const sizeClass = sizeConfig[size] || sizeConfig.md;

  const label = sentiment
    ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1)
    : 'Unknown';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label}
      {typeof score === 'number' && (
        <span className="opacity-70">
          ({score > 0 ? '+' : ''}{(score * 100).toFixed(0)})
        </span>
      )}
    </span>
  );
}
