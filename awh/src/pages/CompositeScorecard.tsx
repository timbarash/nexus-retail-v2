import PageHeader from '../components/PageHeader';
import ScoreGauge from '../components/ScoreGauge';
import SentimentBadge from '../components/SentimentBadge';
import TrendIndicator from '../components/TrendIndicator';
import { scorecardData } from '../data/scorecard';
import { getScoreColor } from '../utils/colors';

export default function CompositeScorecard() {
  const productBrands = scorecardData.brands.filter(b => b.category === 'product');
  const dispensaryFormats = scorecardData.brands.filter(b => b.category === 'dispensary');

  return (
    <div>
      <PageHeader
        title="Composite Scorecard"
        subtitle="Aggregated sentiment scores across all brands and formats"
      />

      {/* Overall Score */}
      <div className="mb-8 flex justify-center">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm px-12 py-8 text-center">
          <ScoreGauge score={scorecardData.overallScore} size={160} label="Overall Composite" />
          <p className="mt-3 text-sm text-gray-500">
            Based on social media, reviews, and news sentiment analysis
          </p>
        </div>
      </div>

      {/* Product Brands */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">Product Brands</h2>
        <div className="space-y-4">
          {productBrands.map((brand) => (
            <div key={brand.name} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm font-medium text-navy-900">{brand.name}</span>
                <div className="flex-1">
                  <div className="relative h-7 w-full overflow-hidden rounded-full bg-gray-50">
                    <div
                      className="flex h-full items-center rounded-full px-3 text-xs font-medium text-white transition-all"
                      style={{
                        width: `${brand.score}%`,
                        backgroundColor: getScoreColor(brand.score),
                      }}
                    >
                      {brand.score}
                    </div>
                  </div>
                </div>
                <SentimentBadge sentiment={brand.sentiment} />
                <TrendIndicator trend={brand.trend} />
              </div>
              <p className="mt-2 pl-28 text-xs text-gray-500">{brand.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dispensary Formats */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">Dispensary Formats</h2>
        <div className="space-y-4">
          {dispensaryFormats.map((brand) => (
            <div key={brand.name} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm font-medium text-navy-900">{brand.name}</span>
                <div className="flex-1">
                  <div className="relative h-7 w-full overflow-hidden rounded-full bg-gray-50">
                    <div
                      className="flex h-full items-center rounded-full px-3 text-xs font-medium text-white transition-all"
                      style={{
                        width: `${brand.score}%`,
                        backgroundColor: getScoreColor(brand.score),
                      }}
                    >
                      {brand.score}
                    </div>
                  </div>
                </div>
                <SentimentBadge sentiment={brand.sentiment} />
                <TrendIndicator trend={brand.trend} />
              </div>
              <p className="mt-2 pl-28 text-xs text-gray-500">{brand.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
