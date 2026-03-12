export interface Subreddit {
  name: string;
  state: string;
  members: string;
  sentiment: 'positive' | 'mixed' | 'negative';
  mentionCount: number;
}

export interface ThemeMention {
  theme: string;
  count: number;
  sentiment: 'positive' | 'mixed' | 'negative';
}

export interface RedditPost {
  id: number;
  subreddit: string;
  title: string;
  snippet: string;
  upvotes: number;
  comments: number;
  sentiment: 'positive' | 'mixed' | 'negative' | 'neutral';
  date: string;
}

export const subreddits: Subreddit[] = [
  { name: 'r/ILTrees', state: 'Illinois', members: '52k', sentiment: 'mixed', mentionCount: 145 },
  { name: 'r/Michigents', state: 'Michigan', members: '38k', sentiment: 'negative', mentionCount: 89 },
  { name: 'r/OhioMarijuana', state: 'Ohio', members: '24k', sentiment: 'positive', mentionCount: 67 },
  { name: 'r/NewJerseyMarijuana', state: 'New Jersey', members: '31k', sentiment: 'mixed', mentionCount: 112 },
  { name: 'r/bostontrees', state: 'Massachusetts', members: '45k', sentiment: 'positive', mentionCount: 54 },
  { name: 'r/MDEnts', state: 'Maryland', members: '18k', sentiment: 'positive', mentionCount: 43 },
  { name: 'r/PaMedicalMarijuana', state: 'Pennsylvania', members: '41k', sentiment: 'mixed', mentionCount: 76 },
];

export const positiveThemes: ThemeMention[] = [
  { theme: 'Store aesthetics & layout', count: 87, sentiment: 'positive' },
  { theme: 'Ozone flower quality', count: 134, sentiment: 'positive' },
  { theme: "Effin' cult following", count: 72, sentiment: 'positive' },
  { theme: 'Knowledgeable budtenders', count: 65, sentiment: 'positive' },
  { theme: 'Mister Jones concept', count: 41, sentiment: 'positive' },
  { theme: 'OH/MD market excitement', count: 58, sentiment: 'positive' },
];

export const negativeThemes: ThemeMention[] = [
  { theme: 'MI pricing complaints', count: 112, sentiment: 'negative' },
  { theme: 'Simply Herb dryness', count: 89, sentiment: 'negative' },
  { theme: 'MSO stigma / corporate feel', count: 95, sentiment: 'negative' },
  { theme: 'Outlet brand confusion', count: 67, sentiment: 'negative' },
  { theme: 'Honor Roll inconsistency', count: 54, sentiment: 'negative' },
  { theme: 'HighWired edible potency', count: 48, sentiment: 'negative' },
];

export const samplePosts: RedditPost[] = [
  {
    id: 1,
    subreddit: 'r/ILTrees',
    title: 'Ozone South Beach from Ascend — impressive cure on this batch',
    snippet: 'Picked this up at the Ascend in Chicago. Dense nugs, great nose, and the effects hit smooth. Ozone has really stepped it up lately. 8.5/10 for me.',
    upvotes: 47,
    comments: 23,
    sentiment: 'positive',
    date: '2025-02-12',
  },
  {
    id: 2,
    subreddit: 'r/Michigents',
    title: 'Why would anyone pay Ascend prices when...',
    snippet: 'Serious question — you can get oz for $60-80 from local brands. Why are people still going to Ascend and paying double? The MI market is way too competitive for MSO pricing.',
    upvotes: 89,
    comments: 67,
    sentiment: 'negative',
    date: '2025-02-08',
  },
  {
    id: 3,
    subreddit: 'r/OhioMarijuana',
    title: 'First time at Ascend Columbus — pleasantly surprised',
    snippet: 'Clean store, quick check-in, budtender actually knew the strains. Got some Ozone and an Effin cart. Both solid. Will definitely go back when rec opens up.',
    upvotes: 34,
    comments: 18,
    sentiment: 'positive',
    date: '2025-01-28',
  },
  {
    id: 4,
    subreddit: 'r/NewJerseyMarijuana',
    title: 'Ascend vs Rise for NJ flower — thoughts?',
    snippet: 'Been going to both. Ascend has better store vibes and Ozone is solid, but Rise has more variety. Simply Herb was dry last time I tried it. Ozone is where it\'s at for Ascend.',
    upvotes: 56,
    comments: 41,
    sentiment: 'mixed',
    date: '2025-02-05',
  },
  {
    id: 5,
    subreddit: 'r/PaMedicalMarijuana',
    title: 'Anyone tried Honor Roll pre-rolls?',
    snippet: 'Got a 5-pack from Ascend. Two were fine, but one was way too loose and another canoed badly. For the price, I expected better QC. Might just stick to Ozone eighths.',
    upvotes: 28,
    comments: 15,
    sentiment: 'negative',
    date: '2025-01-20',
  },
  {
    id: 6,
    subreddit: 'r/MDEnts',
    title: 'Ascend Rockville is one of the better dispos in MD',
    snippet: 'Great selection, nice store layout, and the rewards program is decent. Maryland market has been solid since adult-use kicked in. Grabbed some Ozone Cake Mints — fire.',
    upvotes: 42,
    comments: 19,
    sentiment: 'positive',
    date: '2025-02-14',
  },
  {
    id: 7,
    subreddit: 'r/bostontrees',
    title: 'Visited the Mister Jones in Boston — unique vibe',
    snippet: 'Different from your typical dispensary. More boutique feel. Selection was curated rather than overwhelming. Prices are higher but the experience was worth it. Interesting concept.',
    upvotes: 31,
    comments: 22,
    sentiment: 'positive',
    date: '2025-02-01',
  },
  {
    id: 8,
    subreddit: 'r/ILTrees',
    title: 'Ascend Outlet vs regular Ascend — what\'s the difference?',
    snippet: 'Went to the Outlet location and it felt like a stripped down version. Less selection, budget-focused. Is there actually a quality difference or just branding? Confusing having both.',
    upvotes: 63,
    comments: 38,
    sentiment: 'neutral',
    date: '2025-01-15',
  },
];
