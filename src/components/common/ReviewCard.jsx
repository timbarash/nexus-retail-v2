import React, { useState } from 'react';
import { MessageSquare, MapPin, Calendar, User, Star, ExternalLink } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

const sourceIcons = {
  Reddit: { label: 'Reddit', color: 'text-orange-500' },
  Google: { label: 'Google', color: 'text-[#3b82f6]' },
  Leafly: { label: 'Leafly', color: 'text-[#00a35e]' },
  Weedmaps: { label: 'Weedmaps', color: 'text-[#d97706]' },
};

const highlightBorderColors = {
  positive: 'border-l-[#00a35e]',
  negative: 'border-l-[#ef4444]',
  neutral: 'border-l-[#d97706]',
  recent: 'border-l-[#3b82f6]',
};

function StarRating({ rating }) {
  if (!rating && rating !== 0) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? 'fill-[#d97706] text-[#d97706]'
              : 'fill-gray-200 text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-text-secondary">{rating}/5</span>
    </div>
  );
}

export default function ReviewCard({ review, highlight }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;

  if (!review) return null;

  const {
    text = '',
    source,
    date,
    location,
    sentiment,
    sentimentScore,
    brand,
    categories = [],
    author,
    rating,
    title,
  } = review;

  const isLong = text.length > maxLength;
  const displayText = expanded || !isLong ? text : text.slice(0, maxLength) + '...';
  const sourceInfo = sourceIcons[source] || { label: source, color: 'text-text-secondary' };
  const borderColor = highlight
    ? highlightBorderColors[highlight] || 'border-l-[#30363D]'
    : '';

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div
      className={`bg-white rounded-xl border border-surface-border p-4 hover:border-gray-300 transition-all duration-200 ${
        highlight ? `border-l-4 ${borderColor}` : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-text-primary truncate mb-1">
              {title}
            </h4>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <span className={`font-medium ${sourceInfo.color}`}>
              {sourceInfo.label}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            )}
            {author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {author}
              </span>
            )}
          </div>
        </div>
        <SentimentBadge sentiment={sentiment} score={sentimentScore} size="sm" />
      </div>

      {/* Rating */}
      {source !== 'Reddit' && rating && <StarRating rating={rating} />}

      {/* Text */}
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-[#00a35e] hover:text-[#10b981] transition-colors"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {brand && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[rgba(0,163,94,0.08)] text-[#00a35e] text-xs font-medium border border-surface-border">
            {brand}
          </span>
        )}
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-bg text-text-secondary text-xs border border-surface-border"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
