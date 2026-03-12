import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'flat';
}

export default function TrendIndicator({ trend }: TrendIndicatorProps) {
  switch (trend) {
    case 'up':
      return <TrendingUp size={16} className="text-emerald-600" style={{ color: '#00a47c' }} />;
    case 'down':
      return <TrendingDown size={16} style={{ color: '#d94040' }} />;
    case 'flat':
      return <Minus size={16} style={{ color: '#77868e' }} />;
  }
}
