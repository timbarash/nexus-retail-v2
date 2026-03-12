export interface NewsItem {
  id: number;
  date: string;
  title: string;
  source: string;
  category: 'earnings' | 'expansion' | 'market' | 'regulatory';
  sentiment: 'positive' | 'mixed' | 'negative' | 'neutral';
  summary: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: '2025-02-15',
    title: 'AWH Reports Q4 2024 Revenue of $140M, Beating Estimates',
    source: 'Business Wire',
    category: 'earnings',
    sentiment: 'positive',
    summary: 'Ascend Wellness reported Q4 revenue of $140.2M, exceeding analyst estimates of $135M. Adjusted EBITDA margins improved to 22%, driven by operational efficiencies and strong performance in New Jersey and Illinois markets.',
  },
  {
    id: 2,
    date: '2025-02-10',
    title: 'Ohio Adult-Use Sales Launch Boosts AWH Outlook',
    source: 'Marijuana Business Daily',
    category: 'expansion',
    sentiment: 'positive',
    summary: 'With Ohio recreational sales officially launching, AWH\'s 6 dispensary locations in the state are well-positioned to capture adult-use demand. Analysts project Ohio could become a $2B annual market.',
  },
  {
    id: 3,
    date: '2025-01-28',
    title: 'Michigan Cannabis Price Compression Continues to Pressure MSOs',
    source: 'Cannabis Business Times',
    category: 'market',
    sentiment: 'negative',
    summary: 'Michigan wholesale cannabis prices fell another 15% in Q4 2024, with outdoor harvest adding further downward pressure. MSOs like AWH face margin headwinds despite cost-cutting measures.',
  },
  {
    id: 4,
    date: '2025-01-20',
    title: 'AWH Announces Restructuring, Closes 2 Michigan Locations',
    source: 'MJBizDaily',
    category: 'market',
    sentiment: 'negative',
    summary: 'Ascend Wellness is closing two underperforming Michigan dispensaries as part of a broader cost optimization plan. The company cited market saturation and pricing pressure as primary drivers.',
  },
  {
    id: 5,
    date: '2025-01-12',
    title: 'Maryland Cannabis Market Exceeds First-Year Adult-Use Projections',
    source: 'Baltimore Sun',
    category: 'regulatory',
    sentiment: 'positive',
    summary: 'Maryland\'s adult-use cannabis market generated over $800M in its first year, exceeding initial projections by 20%. AWH operates 4 dispensaries in the state and has seen strong traffic growth.',
  },
  {
    id: 6,
    date: '2025-01-05',
    title: 'Pennsylvania Adult-Use Bill Gains Bipartisan Support',
    source: 'Philadelphia Inquirer',
    category: 'regulatory',
    sentiment: 'positive',
    summary: 'A bipartisan coalition in the PA legislature introduced an adult-use cannabis bill with strong prospects. If passed, AWH\'s 4 PA locations would benefit from expanded consumer access.',
  },
  {
    id: 7,
    date: '2024-12-18',
    title: 'AWH Secures $50M Refinancing at Improved Terms',
    source: 'PR Newswire',
    category: 'earnings',
    sentiment: 'positive',
    summary: 'Ascend Wellness completed a $50M debt refinancing, reducing its interest rate by 200 basis points. The improved terms provide additional financial flexibility for strategic investments.',
  },
  {
    id: 8,
    date: '2024-12-05',
    title: 'Cannabis MSO Stocks Face Continued Headwinds Amid Federal Uncertainty',
    source: 'Barron\'s',
    category: 'market',
    sentiment: 'mixed',
    summary: 'Multi-state cannabis operators including AWH continue to face stock price pressure amid uncertainty around federal rescheduling timeline. Institutional investors remain cautious despite improving fundamentals.',
  },
  {
    id: 9,
    date: '2024-11-20',
    title: 'AWH Opens New Mister Jones Location in Boston',
    source: 'Boston Globe',
    category: 'expansion',
    sentiment: 'positive',
    summary: 'Ascend Wellness opened its latest Mister Jones boutique dispensary in downtown Boston, bringing its total Massachusetts locations to 5. The format targets premium consumers with a curated experience.',
  },
  {
    id: 10,
    date: '2024-11-08',
    title: 'NJ Cannabis Commission Approves New License Round',
    source: 'NJ.com',
    category: 'regulatory',
    sentiment: 'mixed',
    summary: 'New Jersey approved 30+ new cannabis retail licenses, increasing competition for established operators like AWH. However, AWH\'s 7 existing NJ locations benefit from brand recognition and established customer base.',
  },
];
