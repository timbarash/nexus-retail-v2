import { useState } from 'react';
import { Calendar, MapPin, User, Star, ThumbsUp } from 'lucide-react';
import type { Review } from '../data/reviews';

const sourceStyles: Record<string, { label: string; color: string }> = {
  Reddit: { label: 'Reddit', color: 'text-orange-500' },
  'Google Reviews': { label: 'Google', color: 'text-blue-500' },
  Leafly: { label: 'Leafly', color: 'text-emerald-600' },
  Weedmaps: { label: 'Weedmaps', color: 'text-amber-500' },
};

const highlightBorders: Record<string, string> = {
  positive: 'border-l-[#00a47c]',
  negative: 'border-l-[#d94040]',
  neutral: 'border-l-[#e8932c]',
};

const sentimentBadgeStyles: Record<string, string> = {
  positive: 'bg-[#00a47c]/10 text-[#00a47c]',
  neutral: 'bg-[#e8932c]/10 text-[#e8932c]',
  negative: 'bg-[#d94040]/10 text-[#d94040]',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating}/5</span>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  highlight?: string;
}

export default function ReviewCard({ review, highlight }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;

  if (!review) return null;

  const { text, source, date, location, sentiment, brand, categories, author, rating, title, helpful } = review;

  const isLong = text.length > maxLength;
  const displayText = expanded || !isLong ? text : text.slice(0, maxLength) + '...';
  const srcStyle = sourceStyles[source] || { label: source, color: 'text-gray-500' };
  const borderColor = highlight ? highlightBorders[highlight] || '' : '';

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        highlight ? `border-l-4 ${borderColor}` : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-navy-900 truncate mb-1">{title}</h4>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className={`font-medium ${srcStyle.color}`}>{srcStyle.label}</span>
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {location}
              </span>
            )}
            {author && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {author}
              </span>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sentimentBadgeStyles[sentiment] || ''}`}>
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </span>
      </div>

      {/* Rating */}
      {source !== 'Reddit' && rating != null && <StarRating rating={rating} />}

      {/* Text */}
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-dutchie-500 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Tags + Helpful */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {brand && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-navy-900/5 text-navy-900 text-xs font-medium border border-navy-900/10">
            {brand}
          </span>
        )}
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-xs border border-gray-100"
          >
            {cat}
          </span>
        ))}
        {helpful > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <ThumbsUp size={12} />
            {helpful}
          </span>
        )}
      </div>
    </div>
  );
}
