import { getSentimentColor } from '../utils/colors';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'mixed' | 'negative' | 'neutral';
}

export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const color = getSentimentColor(sentiment);
  const label = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  );
}
