import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  dutchie: {
    iconBg: 'bg-[rgba(0,163,94,0.08)]',
    iconText: 'text-[#00a35e]',
  },
  blue: {
    iconBg: 'bg-[rgba(59,130,246,0.08)]',
    iconText: 'text-[#3b82f6]',
  },
  purple: {
    iconBg: 'bg-[rgba(139,92,246,0.08)]',
    iconText: 'text-[#8b5cf6]',
  },
  amber: {
    iconBg: 'bg-[rgba(217,119,6,0.08)]',
    iconText: 'text-[#d97706]',
  },
  red: {
    iconBg: 'bg-[rgba(239,68,68,0.08)]',
    iconText: 'text-[#ef4444]',
  },
};

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'dutchie' }) {
  const colors = colorMap[color] || colorMap.dutchie;
  const trendPositive = typeof trend === 'number' && trend >= 0;

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
          {typeof trend === 'number' && (
            <div className="mt-2 flex items-center gap-1">
              {trendPositive ? (
                <TrendingUp className="w-4 h-4 text-[#00a35e]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#ef4444]" />
              )}
              <span className={`text-sm font-medium ${trendPositive ? 'text-[#00a35e]' : 'text-[#ef4444]'}`}>
                {trendPositive ? '+' : ''}{trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-text-muted ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`flex-shrink-0 p-3 rounded-xl ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.iconText}`} />
          </div>
        )}
      </div>
    </div>
  );
}
