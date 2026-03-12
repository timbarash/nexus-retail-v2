import type { Review } from '../data/reviews';

/**
 * Calculate average sentiment score from an array of reviews.
 */
export function avgSentiment(reviews: Review[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.sentimentScore || 0), 0);
  return Math.round((sum / reviews.length) * 100) / 100;
}

/**
 * Group reviews by a given key.
 */
export function groupBy<K extends keyof Review>(reviews: Review[], key: K): Record<string, Review[]> {
  if (!reviews || !key) return {};
  return reviews.reduce((groups: Record<string, Review[]>, review) => {
    const value = String(review[key] ?? 'Unknown');
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(review);
    return groups;
  }, {});
}

/**
 * Get sentiment distribution counts.
 */
export function sentimentDistribution(reviews: Review[]): { positive: number; neutral: number; negative: number } {
  if (!reviews) return { positive: 0, neutral: 0, negative: 0 };
  return reviews.reduce(
    (dist, r) => {
      if (r.sentiment === 'positive') dist.positive++;
      else if (r.sentiment === 'neutral') dist.neutral++;
      else if (r.sentiment === 'negative') dist.negative++;
      return dist;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );
}

/**
 * Get monthly trend data for charts.
 * Returns an array of objects sorted chronologically from Mar 2025 to Feb 2026.
 */
export function monthlyTrend(reviews: Review[]): Array<{
  month: string;
  positive: number;
  neutral: number;
  negative: number;
  avg: number;
  total: number;
}> {
  if (!reviews || reviews.length === 0) return [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const months: Array<{ key: string; label: string }> = [];
  for (let m = 2; m <= 13; m++) {
    const year = m > 11 ? 2026 : 2025;
    const monthIndex = m % 12;
    months.push({
      key: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: `${monthNames[monthIndex]} ${year}`,
    });
  }

  const buckets: Record<string, { positive: number; neutral: number; negative: number; scores: number[]; total: number }> = {};
  months.forEach(m => {
    buckets[m.key] = { positive: 0, neutral: 0, negative: 0, scores: [], total: 0 };
  });

  reviews.forEach(r => {
    const dateKey = r.date.substring(0, 7);
    if (buckets[dateKey]) {
      buckets[dateKey][r.sentiment]++;
      buckets[dateKey].scores.push(r.sentimentScore);
      buckets[dateKey].total++;
    }
  });

  return months.map(m => {
    const b = buckets[m.key];
    const avg = b.scores.length > 0
      ? Math.round((b.scores.reduce((a, s) => a + s, 0) / b.scores.length) * 100) / 100
      : 0;
    return {
      month: m.label,
      positive: b.positive,
      neutral: b.neutral,
      negative: b.negative,
      avg,
      total: b.total,
    };
  });
}

/**
 * Filter reviews by multiple criteria.
 */
export function filterReviews(
  reviews: Review[],
  filters: {
    sources?: string[];
    brands?: string[];
    sentiments?: string[];
    locations?: string[];
    states?: string[];
    categories?: string[];
    search?: string;
    dateRange?: [string, string];
  } = {},
): Review[] {
  if (!reviews) return [];
  if (!filters || Object.keys(filters).length === 0) return reviews;

  return reviews.filter(r => {
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      if (start && r.date < start) return false;
      if (end && r.date > end) return false;
    }
    if (filters.sources && filters.sources.length > 0) {
      if (!filters.sources.includes(r.source)) return false;
    }
    if (filters.brands && filters.brands.length > 0) {
      if (r.brand === null) return false;
      if (!filters.brands.includes(r.brand)) return false;
    }
    if (filters.locations && filters.locations.length > 0) {
      if (!filters.locations.includes(r.location)) return false;
    }
    if (filters.sentiments && filters.sentiments.length > 0) {
      if (!filters.sentiments.includes(r.sentiment)) return false;
    }
    if (filters.categories && filters.categories.length > 0) {
      const hasMatch = r.categories.some(c => filters.categories!.includes(c));
      if (!hasMatch) return false;
    }
    if (filters.states && filters.states.length > 0) {
      if (!filters.states.includes(r.state)) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      const textMatch = r.text.toLowerCase().includes(searchLower);
      const titleMatch = r.title ? r.title.toLowerCase().includes(searchLower) : false;
      const authorMatch = r.author.toLowerCase().includes(searchLower);
      if (!textMatch && !titleMatch && !authorMatch) return false;
    }
    return true;
  });
}

/**
 * Calculate an NPS-like score from reviews.
 */
export function calculateNPS(reviews: Review[]): number {
  if (!reviews || reviews.length === 0) return 0;

  let promoters = 0;
  let detractors = 0;

  reviews.forEach(r => {
    if (r.sentimentScore > 0.3) promoters++;
    else if (r.sentimentScore < -0.3) detractors++;
  });

  const nps = Math.round(((promoters - detractors) / reviews.length) * 100);
  return Math.max(-100, Math.min(100, nps));
}

/**
 * Get category-level sentiment breakdown.
 */
export function categorySentiment(reviews: Review[]): Array<{
  category: string;
  positive: number;
  neutral: number;
  negative: number;
  avg: number;
  total: number;
}> {
  if (!reviews || reviews.length === 0) return [];

  const catData: Record<string, { positive: number; neutral: number; negative: number; scores: number[]; total: number }> = {};

  reviews.forEach(r => {
    r.categories.forEach(cat => {
      if (!catData[cat]) {
        catData[cat] = { positive: 0, neutral: 0, negative: 0, scores: [], total: 0 };
      }
      catData[cat][r.sentiment]++;
      catData[cat].scores.push(r.sentimentScore);
      catData[cat].total++;
    });
  });

  return Object.entries(catData)
    .map(([category, data]) => ({
      category,
      positive: data.positive,
      neutral: data.neutral,
      negative: data.negative,
      avg: data.scores.length > 0
        ? Math.round((data.scores.reduce((a, s) => a + s, 0) / data.scores.length) * 100) / 100
        : 0,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Format an ISO date string for display.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get sentiment color hex code.
 */
export function sentimentColor(sentiment: string | number): string {
  if (typeof sentiment === 'number') {
    sentiment = sentiment >= 0.2 ? 'positive' : sentiment <= -0.2 ? 'negative' : 'neutral';
  }
  return ({ positive: '#00a47c', neutral: '#e8932c', negative: '#d94040' } as Record<string, string>)[sentiment] || '#77868e';
}
