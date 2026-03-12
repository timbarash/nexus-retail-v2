import { AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SentimentBadge from '../components/SentimentBadge';
import { newsItems } from '../data/news';

const categoryStyles: Record<string, string> = {
  earnings: 'bg-dutchie-500 text-white',
  expansion: 'bg-dutchie-green text-white',
  market: 'bg-amber-500 text-white',
  regulatory: 'bg-navy-900 text-white',
};

export default function NewsInvestorSentiment() {
  return (
    <div>
      <PageHeader
        title="News & Investor Sentiment"
        subtitle="Recent news, earnings, and regulatory developments affecting AWH"
      />

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800">
          News items and investor sentiment are compiled from public sources. Summaries are
          directional and may not reflect the full context of each story.
        </p>
      </div>

      {/* News Timeline */}
      <div className="space-y-4">
        {newsItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">{item.date}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles[item.category] || 'bg-gray-100 text-gray-600'}`}>
                {item.category}
              </span>
              <SentimentBadge sentiment={item.sentiment} />
            </div>
            <h3 className="mt-2 font-semibold text-navy-900">{item.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{item.source}</p>
            <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
