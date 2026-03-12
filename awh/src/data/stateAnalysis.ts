export interface MonthlyDataPoint {
  month: string;
  score: number;
}

export interface StateData {
  state: string;
  abbreviation: string;
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  locationCount: number;
  trend: MonthlyDataPoint[];
  keyInsight: string;
}

export const stateData: StateData[] = [
  {
    state: 'Maryland',
    abbreviation: 'MD',
    score: 70,
    sentiment: 'positive',
    locationCount: 4,
    trend: [
      { month: 'Sep', score: 62 },
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 67 },
      { month: 'Dec', score: 68 },
      { month: 'Jan', score: 69 },
      { month: 'Feb', score: 70 },
    ],
    keyInsight: 'Strong adult-use transition benefiting AWH locations; positive community reception.',
  },
  {
    state: 'Ohio',
    abbreviation: 'OH',
    score: 68,
    sentiment: 'positive',
    locationCount: 6,
    trend: [
      { month: 'Sep', score: 60 },
      { month: 'Oct', score: 62 },
      { month: 'Nov', score: 64 },
      { month: 'Dec', score: 65 },
      { month: 'Jan', score: 67 },
      { month: 'Feb', score: 68 },
    ],
    keyInsight: 'Adult-use market opening driving optimism; Ozone brand performing well.',
  },
  {
    state: 'Massachusetts',
    abbreviation: 'MA',
    score: 64,
    sentiment: 'positive',
    locationCount: 5,
    trend: [
      { month: 'Sep', score: 61 },
      { month: 'Oct', score: 62 },
      { month: 'Nov', score: 63 },
      { month: 'Dec', score: 63 },
      { month: 'Jan', score: 64 },
      { month: 'Feb', score: 64 },
    ],
    keyInsight: 'Mature market with steady performance; Mister Jones concept well-received locally.',
  },
  {
    state: 'New Jersey',
    abbreviation: 'NJ',
    score: 60,
    sentiment: 'mixed',
    locationCount: 7,
    trend: [
      { month: 'Sep', score: 58 },
      { month: 'Oct', score: 59 },
      { month: 'Nov', score: 59 },
      { month: 'Dec', score: 60 },
      { month: 'Jan', score: 60 },
      { month: 'Feb', score: 60 },
    ],
    keyInsight: 'Largest footprint state; competitive pressure from new entrants.',
  },
  {
    state: 'Illinois',
    abbreviation: 'IL',
    score: 58,
    sentiment: 'mixed',
    locationCount: 8,
    trend: [
      { month: 'Sep', score: 60 },
      { month: 'Oct', score: 59 },
      { month: 'Nov', score: 59 },
      { month: 'Dec', score: 58 },
      { month: 'Jan', score: 58 },
      { month: 'Feb', score: 58 },
    ],
    keyInsight: 'Price compression ongoing; strong social media engagement on r/ILTrees.',
  },
  {
    state: 'Pennsylvania',
    abbreviation: 'PA',
    score: 55,
    sentiment: 'mixed',
    locationCount: 4,
    trend: [
      { month: 'Sep', score: 54 },
      { month: 'Oct', score: 55 },
      { month: 'Nov', score: 55 },
      { month: 'Dec', score: 55 },
      { month: 'Jan', score: 55 },
      { month: 'Feb', score: 55 },
    ],
    keyInsight: 'Medical-only market limits reach; awaiting adult-use legislation.',
  },
  {
    state: 'Michigan',
    abbreviation: 'MI',
    score: 48,
    sentiment: 'negative',
    locationCount: 3,
    trend: [
      { month: 'Sep', score: 55 },
      { month: 'Oct', score: 53 },
      { month: 'Nov', score: 52 },
      { month: 'Dec', score: 50 },
      { month: 'Jan', score: 49 },
      { month: 'Feb', score: 48 },
    ],
    keyInsight: 'Saturated market with severe price compression; negative consumer sentiment toward MSOs.',
  },
];
