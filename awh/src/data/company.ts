export interface CompanyInfo {
  name: string;
  ticker: string;
  exchange: string;
  hq: string;
  locationCount: number;
  stateCount: number;
  states: string[];
  website: string;
  description: string;
  ceo: string;
  founded: number;
  employees: string;
}

export interface ProductBrand {
  name: string;
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  description: string;
}

export interface DispensaryFormat {
  name: string;
  score: number;
  sentiment: 'positive' | 'mixed' | 'negative';
  locationCount: number;
  description: string;
}

export const companyInfo: CompanyInfo = {
  name: 'Ascend Wellness Holdings',
  ticker: 'AAWH',
  exchange: 'NYSE',
  hq: 'New York, NY',
  locationCount: 37,
  stateCount: 7,
  states: ['IL', 'MI', 'OH', 'NJ', 'MA', 'MD', 'PA'],
  website: 'https://www.awholdings.com',
  description: 'Ascend Wellness Holdings (AWH) is a vertically integrated multi-state cannabis operator focused on cultivation, manufacturing, and retail dispensary operations.',
  ceo: 'John Hartmann',
  founded: 2018,
  employees: '2,500+',
};

export const productBrands: ProductBrand[] = [
  { name: 'Ozone', score: 72, sentiment: 'positive', description: 'Premium flower and concentrates — flagship brand with strong recognition' },
  { name: 'Simply Herb', score: 55, sentiment: 'mixed', description: 'Value-priced flower line — solid value play, occasional dryness complaints' },
  { name: "Effin'", score: 68, sentiment: 'positive', description: 'Concentrates and vapes — cult following among extract enthusiasts' },
  { name: 'Royale', score: 52, sentiment: 'mixed', description: 'Premium small-batch flower — limited availability, mixed awareness' },
  { name: 'HighWired', score: 42, sentiment: 'negative', description: 'Edibles and beverages — quality concerns, competitive market' },
  { name: 'Honor Roll', score: 38, sentiment: 'negative', description: 'Pre-rolls — inconsistency complaints, difficult category' },
  { name: 'Common Goods', score: 50, sentiment: 'mixed', description: 'Everyday value line — serviceable but undifferentiated' },
];

export const dispensaryFormats: DispensaryFormat[] = [
  { name: 'ASCEND', score: 64, sentiment: 'mixed', locationCount: 25, description: 'Core dispensary brand — generally well-received, varies by location' },
  { name: 'ASCEND Outlet', score: 48, sentiment: 'negative', locationCount: 8, description: 'Value-format stores — brand confusion with main ASCEND line' },
  { name: 'Mister Jones', score: 58, sentiment: 'mixed', locationCount: 4, description: 'Boutique concept — interesting positioning, limited footprint' },
];
