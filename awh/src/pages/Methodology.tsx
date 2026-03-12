import PageHeader from '../components/PageHeader';

const sections = [
  {
    title: 'Data Sources',
    content: [
      'Reddit community discussions from 7 state-specific cannabis subreddits',
      'Google Reviews and Leafly/Weedmaps ratings for Ascend dispensary locations',
      'Public news articles, press releases, and earnings reports',
      'Investor sentiment from financial news coverage and analyst commentary',
    ],
  },
  {
    title: 'Scoring Methodology',
    content: [
      'Composite scores range from 0-100, combining multiple sentiment signals',
      'Brand scores weight product quality mentions, price perception, and availability',
      'State scores incorporate local market conditions, competition, and regulatory environment',
      'Trend indicators reflect 6-month directional movement (up, down, or flat)',
    ],
  },
  {
    title: 'Sentiment Classification',
    content: [
      'Positive (score \u2265 65): Generally favorable consumer and market perception',
      'Mixed (score 50-64): Balanced positive and negative signals',
      'Negative (score < 50): Predominantly unfavorable sentiment indicators',
    ],
  },
  {
    title: 'What Is Real vs. Directional',
    content: [
      'Company facts (locations, states, brands, ticker) are verified from public filings',
      'Reddit subreddit names and general community themes are based on real communities',
      'Specific scores, mention counts, and trend data are modeled estimates for analysis purposes',
      'News items are representative of real market dynamics but summaries are generated',
      'Sample Reddit posts are illustrative composites, not verbatim quotes',
    ],
  },
  {
    title: 'Limitations',
    content: [
      'Reddit and social media represent a vocal subset of consumers, not the full customer base',
      'Sentiment analysis may miss context, sarcasm, or nuanced opinions',
      'Scores are relative to the cannabis industry, not absolute quality measures',
      'Data freshness varies by source; some signals may lag real-world changes',
      'Michigan market dynamics are particularly volatile and may shift rapidly',
    ],
  },
  {
    title: 'Enhancement Roadmap',
    content: [
      'Integration with live Reddit API for real-time mention tracking',
      'Google Reviews scraping for location-level sentiment scores',
      'Competitor comparison module (vs. Curaleaf, Trulieve, Green Thumb)',
      'Automated alerting for significant sentiment shifts',
      'Historical trend analysis with longer lookback periods',
    ],
  },
];

export default function Methodology() {
  return (
    <div>
      <PageHeader
        title="Methodology"
        subtitle="How scores are calculated, data sources, and important disclaimers"
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="mb-3 text-lg font-semibold text-navy-900">{section.title}</h2>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
