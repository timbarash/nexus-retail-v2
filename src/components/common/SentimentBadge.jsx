import React from 'react';

const sentimentConfig = {
  positive: {
    bg: 'bg-[rgba(0,194,124,0.12)]',
    text: 'text-[#00C27C]',
    border: 'border-[rgba(0,194,124,0.2)]',
    dot: 'bg-[#00C27C]',
  },
  neutral: {
    bg: 'bg-[rgba(212,160,58,0.12)]',
    text: 'text-[#D4A03A]',
    border: 'border-[rgba(212,160,58,0.2)]',
    dot: 'bg-[#D4A03A]',
  },
  negative: {
    bg: 'bg-[rgba(232,112,104,0.12)]',
    text: 'text-[#E87068]',
    border: 'border-[rgba(232,112,104,0.2)]',
    dot: 'bg-[#E87068]',
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
