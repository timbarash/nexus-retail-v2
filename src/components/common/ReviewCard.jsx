import React, { useState } from 'react';
import { MessageSquare, MapPin, Calendar, User, Star, ExternalLink } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

const sourceIcons = {
  Reddit: { label: 'Reddit', color: 'text-orange-500' },
  Google: { label: 'Google', color: 'text-[#64A8E0]' },
  Leafly: { label: 'Leafly', color: 'text-[#00C27C]' },
  Weedmaps: { label: 'Weedmaps', color: 'text-[#D4A03A]' },
};

const highlightBorderColors = {
  positive: 'border-l-[#00C27C]',
  negative: 'border-l-[#E87068]',
  neutral: 'border-l-[#D4A03A]',
  recent: 'border-l-[#64A8E0]',
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
              ? 'fill-[#D4A03A] text-[#D4A03A]'
              : 'fill-gray-200 text-[#6B6359]'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-[#ADA599]">{rating}/5</span>
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
  const sourceInfo = sourceIcons[source] || { label: source, color: 'text-[#ADA599]' };
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
      className={`bg-[#1C1B1A] rounded-xl border border-[#38332B] p-4 hover:border-[#38332B] transition-all duration-200 ${
        highlight ? `border-l-4 ${borderColor}` : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-[#F0EDE8] truncate mb-1">
              {title}
            </h4>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#ADA599]">
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
      <p className="mt-2 text-sm text-[#ADA599] leading-relaxed">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-[#00C27C] hover:text-[#00E08E] transition-colors"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {brand && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[rgba(0,194,124,0.08)] text-[#00C27C] text-xs font-medium border border-[#38332B]">
            {brand}
          </span>
        )}
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#141210] text-[#ADA599] text-xs border border-[#38332B]"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
