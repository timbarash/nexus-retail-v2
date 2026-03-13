import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  dutchie: {
    iconBg: 'bg-[rgba(0,194,124,0.08)]',
    iconText: 'text-[#00C27C]',
  },
  blue: {
    iconBg: 'bg-[rgba(100,168,224,0.08)]',
    iconText: 'text-[#64A8E0]',
  },
  purple: {
    iconBg: 'bg-[rgba(181,152,232,0.08)]',
    iconText: 'text-[#B598E8]',
  },
  amber: {
    iconBg: 'bg-[rgba(212,160,58,0.08)]',
    iconText: 'text-[#D4A03A]',
  },
  red: {
    iconBg: 'bg-[rgba(232,112,104,0.08)]',
    iconText: 'text-[#E87068]',
  },
};

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'dutchie' }) {
  const colors = colorMap[color] || colorMap.dutchie;
  const trendPositive = typeof trend === 'number' && trend >= 0;

  return (
    <div className="bg-[#1C1B1A] rounded-xl border border-[#38332B] p-5 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#ADA599] truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#F0EDE8] tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-[#6B6359]">{subtitle}</p>
          )}
          {typeof trend === 'number' && (
            <div className="mt-2 flex items-center gap-1">
              {trendPositive ? (
                <TrendingUp className="w-4 h-4 text-[#00C27C]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#E87068]" />
              )}
              <span className={`text-sm font-medium ${trendPositive ? 'text-[#00C27C]' : 'text-[#E87068]'}`}>
                {trendPositive ? '+' : ''}{trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-[#6B6359] ml-1">{trendLabel}</span>
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
