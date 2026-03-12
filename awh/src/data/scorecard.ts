export interface BrandScore {
  name: string;
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  trend: 'up' | 'down' | 'flat';
  category: 'product' | 'dispensary';
  description: string;
}

export interface ScorecardData {
  overallScore: number;
  overallSentiment: 'mixed';
  lastUpdated: string;
  brands: BrandScore[];
}

export const scorecardData: ScorecardData = {
  overallScore: 62,
  overallSentiment: 'mixed',
  lastUpdated: '2025-02',
  brands: [
    { name: 'Ozone', score: 72, sentiment: 'positive', trend: 'up', category: 'product', description: 'Flagship flower/concentrate brand with growing loyalty' },
    { name: "Effin'", score: 68, sentiment: 'positive', trend: 'up', category: 'product', description: 'Concentrate brand with dedicated fanbase' },
    { name: 'ASCEND', score: 64, sentiment: 'mixed', trend: 'flat', category: 'dispensary', description: 'Core retail brand — quality varies by location' },
    { name: 'Mister Jones', score: 58, sentiment: 'mixed', trend: 'flat', category: 'dispensary', description: 'Boutique dispensary — unique but limited reach' },
    { name: 'Simply Herb', score: 55, sentiment: 'mixed', trend: 'flat', category: 'product', description: 'Budget flower — solid value, occasional quality issues' },
    { name: 'Royale', score: 52, sentiment: 'mixed', trend: 'flat', category: 'product', description: 'Premium small-batch — limited availability hurts scores' },
    { name: 'Common Goods', score: 50, sentiment: 'mixed', trend: 'flat', category: 'product', description: 'Everyday essentials — functional but generic' },
    { name: 'ASCEND Outlet', score: 48, sentiment: 'negative', trend: 'down', category: 'dispensary', description: 'Value format — brand confusion with core ASCEND' },
    { name: 'HighWired', score: 42, sentiment: 'negative', trend: 'down', category: 'product', description: 'Edibles — struggling in competitive category' },
    { name: 'Honor Roll', score: 38, sentiment: 'negative', trend: 'down', category: 'product', description: 'Pre-rolls — consistency complaints persist' },
  ],
};
