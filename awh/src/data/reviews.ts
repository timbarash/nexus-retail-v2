// AWH (Ascend Wellness Holdings) Consumer Sentiment Mock Data
// 450 deterministically generated reviews across multiple sources, brands, and locations

export const brands = ['Ozone', "Effin'", 'Simply Herb', 'Tunnel Vision', 'ASCEND'];

export const sources = ['Reddit', 'Google Reviews', 'Leafly', 'Weedmaps'];

export const categories = [
  'Product Quality', 'Staff Friendliness', 'Wait Times',
  'Pricing', 'Store Atmosphere', 'Product Selection',
];

export interface LocationMeta {
  name: string;
  state: string;
  city: string;
}

export const locations: LocationMeta[] = [
  // Illinois (5)
  { name: 'Ascend Chicago - River North', state: 'IL', city: 'Chicago' },
  { name: 'Ascend Fairview Heights', state: 'IL', city: 'Fairview Heights' },
  { name: 'Ascend Chicago - Michigan Ave', state: 'IL', city: 'Chicago' },
  { name: 'Ascend Collinsville', state: 'IL', city: 'Collinsville' },
  { name: 'Ascend Springfield', state: 'IL', city: 'Springfield' },
  // Michigan (3)
  { name: 'Ascend Morenci', state: 'MI', city: 'Morenci' },
  { name: 'Ascend Grand Rapids', state: 'MI', city: 'Grand Rapids' },
  { name: 'Ascend Battle Creek', state: 'MI', city: 'Battle Creek' },
  // Ohio (4)
  { name: 'Ascend Columbus', state: 'OH', city: 'Columbus' },
  { name: 'Ascend Springfield OH', state: 'OH', city: 'Springfield' },
  { name: 'Ascend Coshocton', state: 'OH', city: 'Coshocton' },
  { name: 'Ascend Carroll', state: 'OH', city: 'Carroll' },
  // New Jersey (4)
  { name: 'Ascend Fort Lee', state: 'NJ', city: 'Fort Lee' },
  { name: 'Ascend Rochelle Park', state: 'NJ', city: 'Rochelle Park' },
  { name: 'Ascend Montclair', state: 'NJ', city: 'Montclair' },
  { name: 'Ascend Franklin', state: 'NJ', city: 'Franklin' },
  // Massachusetts (3)
  { name: 'Ascend New Bedford', state: 'MA', city: 'New Bedford' },
  { name: 'Ascend Canton', state: 'MA', city: 'Canton' },
  { name: 'Ascend Boston', state: 'MA', city: 'Boston' },
  // Maryland (2)
  { name: 'Ascend Baltimore', state: 'MD', city: 'Baltimore' },
  { name: 'Ascend Laurel', state: 'MD', city: 'Laurel' },
  // Pennsylvania (2)
  { name: 'Ascend Scranton', state: 'PA', city: 'Scranton' },
  { name: 'Ascend KOP', state: 'PA', city: 'King of Prussia' },
];

export const competitors = ['Curaleaf', 'Green Thumb Industries', 'Trulieve', 'Verano', 'Cresco Labs'];

const subredditsByState: Record<string, string[]> = {
  IL: ['r/ILTrees', 'r/ILTrees', 'r/trees'],
  MI: ['r/Michigents', 'r/Michigents', 'r/trees'],
  OH: ['r/OhioMarijuana', 'r/OhioMarijuana', 'r/trees'],
  NJ: ['r/NewJerseyMarijuana', 'r/NewJerseyMarijuana', 'r/trees'],
  MA: ['r/bostontrees', 'r/bostontrees', 'r/trees'],
  MD: ['r/MDEnts', 'r/MDEnts', 'r/trees'],
  PA: ['r/PaMedicalMarijuana', 'r/PaMedicalMarijuana', 'r/trees'],
};

// Seeded pseudo-random number generator (Mulberry32)
function createRng(seed: number): () => number {
  let state = seed | 0;
  return function next() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function rngPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// --- Review text templates ---

const positiveTemplates = [
  'Picked up some {brand} flower from {location} and it was top-notch. Dense nugs, great nose, and the effects hit smooth. Really impressed with this batch.',
  '{brand} carts from {location} are always reliable. Consistent oil color, consistent potency, never had a dud. Been buying them for over a year now.',
  'Was only there 15 min at {location} from check-in to walking out with my {brand} order. That is how a dispensary should run.',
  'Shoutout to the staff at {location} - they remembered my name and my usual {brand} order. That personal touch makes all the difference.',
  'The Ozone flower from {location} is seriously underrated. Dense buds, great cure, and the terp profiles are always on point. 8.5/10 for me.',
  'Clean modern store at {location}. Felt like walking into a high-end shop. {brand} products were beautifully displayed and the staff was super knowledgeable.',
  'Been buying {brand} from {location} for months and the consistency is what keeps me coming back. I know exactly what I am getting every single time.',
  'The {brand} concentrates from {location} are fire. Live sugar was super terpy and the effects were exactly what the strain description promised.',
  'In and out quick at {location}. Online order was ready when I got there, {brand} flower was fresh, staff was friendly. No complaints at all.',
  'The budtender at {location} spent 20 minutes educating me on different {brand} strains and terpene profiles. As a new customer that made me feel so much more comfortable.',
  '{location} is my go-to. The {brand} products hit smooth and the flower is always fresh. Plus parking is easy which is a huge bonus.',
  "Effin' concentrates from {location} have a cult following for a reason. The live resin is some of the best I have had in this state. Seriously good stuff.",
  'I was nervous about my first dispensary visit but {location} made it so easy. The staff walked me through every {brand} product option and helped me find what I needed.',
  '{brand} from {location} has been a game changer for my sleep. Consistent dosing and I finally have a routine that works. Thank you Ascend.',
  'Just want to say {location} has really stepped up their game. Store is spotless, {brand} selection is huge, and the staff genuinely seems happy to be there.',
  'Honest review: been going to {location} for 6 months buying {brand} products. Quality has been consistently good. Not perfect but reliably good, which is what matters.',
  'The {brand} flower from {location} had the most beautiful trichome coverage I have seen at a dispensary. Smelled incredible out of the jar too.',
  'As a medical patient I appreciate how {location} treats me with respect and takes my needs seriously. {brand} products have genuinely improved my quality of life.',
  'Had an issue with a {brand} cart from {location} and they replaced it same day no questions asked. That is how you build customer loyalty.',
  '{location} had a great sale on {brand} last week. Stocked up on carts and flower and everything has been top quality. Love when deals align with good product.',
  'Really appreciate that {location} has knowledgeable staff who actually use {brand} products themselves. Makes the recommendations so much more authentic.',
  'Ozone South Beach from {location} — impressive cure on this batch. Dense nugs, great nose, effects hit smooth. Ozone has really stepped it up lately.',
  'The {brand} pre-rolls from {location} burned perfectly even. Great flavor, no canoeing, proper effects. Way better than trying to roll my own honestly.',
  'First time at {location}, pleasantly surprised. Clean store, quick check-in, budtender actually knew the strains. Got some {brand} and will definitely go back.',
  '{location} does express pickup right. Ordered {brand} online, got the text it was ready in 8 minutes, grabbed it from the counter and was out the door.',
  'Ascend stores have a premium feel that most MSO dispos do not have. {location} in particular has great vibes and {brand} products are always stocked.',
  'The loyalty program at {location} actually saves me real money. Between the points and the daily deals I probably save 20% on {brand} products monthly.',
  'Tunnel Vision from {location} is quickly becoming my favorite vape brand. Smooth pulls, great flavors, and the effects are dialed in.',
];

const negativeTemplates = [
  'Waited over an hour at {location} just to pick up a pre-order. This is unacceptable. Other dispensaries have this figured out, why cant Ascend?',
  'The {brand} cart I got from {location} was noticeably half empty. Oil was dark and tasted burnt. For $50 a half gram this is robbery.',
  'Showed in stock online, drove 30 min to {location}, not available. They will not inform you ever. Complete waste of my time and gas money.',
  '{location} online menu is straight up lies at this point. Third time the {brand} product I wanted was listed but not actually there when I arrived.',
  'Prices at {location} are insane compared to local shops. Paying $60 for an eighth of {brand} flower that would be $40 anywhere else. No thanks.',
  'The {brand} flower from {location} was dry as cardboard. No moisture, no smell, crumbled to dust when I broke it apart. Old stock for sure.',
  'Got a {brand} vape cart from {location} that had dark oil and tasted like chemicals. Returned it and they acted like I was being difficult about it.',
  'Staff at {location} couldnt tell me the terpene profile of the {brand} strain I was asking about. How do you work at a dispensary and not know this basic info?',
  'Budtender at {location} clearly didnt know anything about {brand} products. Just reading off the label I can do that myself at home.',
  '{location} feels like a corporate machine. Zero personal touch, staff seems checked out, and {brand} products have been declining in quality.',
  'Serious question — you can get ounces for $60-80 from local brands in Michigan. Why are people still going to {location} and paying double? MSO pricing is crazy.',
  'I switched to Rise and the difference is night and day. {brand} from {location} is overpriced mid compared to what competitors are putting out.',
  'The wait times at {location} are criminal. Went on a Saturday and it was a 90 minute wait. No dispensary visit should take that long.',
  '{brand} pre-rolls from {location} were loose, uneven, and ran like crazy. Waste of money when I could just get a jar and roll my own.',
  'Bought {brand} edibles from {location} and felt absolutely nothing. Took the full dose, waited 2 hours, nothing. Either mislabeled or just bad product.',
  '{location} staff was rude when I had questions about {brand}. Not everyone is an expert, thats literally why you have budtenders.',
  'Drove 45 minutes to {location} because their website showed {brand} in stock. Got there and they said it sold out yesterday. Update your menu.',
  'Simply Herb from {location} was dry last time I tried it. For a value brand I get it but come on, at least make it smokeable.',
  'Nothing about {location} justified the prices. {brand} flower was average at best and they are charging premium prices for it.',
  'Got home from {location} and my {brand} product was clearly old stock. Dry flower, package date was 4 months ago. They need to rotate inventory.',
  '{brand} carts from {location} have been so inconsistent lately. Some are great and some taste like burnt rubber. Quality control is nonexistent.',
  'Avoid {location} on weekends unless you enjoy waiting in line for an hour. By the time you get in half the {brand} products are sold out anyway.',
  '{location} is giving big corporate dispensary energy and not in a good way. No soul, no personal touch, just take your money and next in line.',
  'MSO stigma is real. {location} charges MSO prices for {brand} products that are not better than what local growers put out. Hard pass.',
  'The parking situation at {location} is a nightmare. Combine that with the long wait and subpar {brand} products and theres no reason to go here.',
  'Poor communication from {location}. Placed an online order for {brand}, never got a confirmation, showed up and they had no record of it.',
];

const neutralTemplates = [
  'Went to {location} for the first time. Its fine, nothing special. {brand} flower was decent but nothing to write home about.',
  '{location} is convenient to my house so I go there. {brand} selection could be better but it gets the job done.',
  'The {brand} flower from {location} was kind of mid honestly. Not bad but not great. 3 out of 5.',
  'I would only recommend {location} if you are in the area and need something quick. {brand} products are standard dispensary quality.',
  'Picked up {brand} from {location}. Comparable to what Curaleaf puts out. Not better not worse just about the same.',
  '{brand} products at {location} are okay. Decent for some things, not great for others. Their carts are better than their flower imo.',
  'Average experience at {location}. {brand} quality is consistent I guess but consistency at a C+ level is still a C+.',
  'The price vs quality tradeoff at {location} is hard to justify when competitors are right there. {brand} is fine but not a clear winner.',
  '{location} has gotten better over time I will admit that. {brand} products are more consistent now than they were a year ago. Still room to improve.',
  'Standard dispensary experience at {location}. Nothing particularly good or bad. {brand} products are what you expect from a big MSO.',
  '{brand} from {location} vs what I have gotten from Rise - pretty similar honestly. Big MSO products are all starting to taste the same.',
  'Visited {location} yesterday. Clean store, fair prices. {brand} is adequate. Not switching from here but not raving about it either.',
  'The {brand} edibles from {location} are fine. Standard 10mg gummies, average flavor, does what it says on the label. Nothing more nothing less.',
  'Ascend vs Rise for NJ flower — been going to both. {location} has better store vibes and Ozone is solid, but Rise has more variety.',
  'Not bad not great. {location} is my local spot and {brand} is there so I buy it. Mainly a convenience thing if I am being honest.',
  '{brand} concentrates from {location} are middle of the road. Acceptable potency, average terp profile. Gets the job done.',
  'The staff at {location} was friendly enough. {brand} selection is limited but what they have is acceptable quality.',
  'First time buying {brand} at {location}. Its standard quality. About what I expected from a chain dispensary. Will try other options too.',
  '{location} had my {brand} order ready in 15 minutes. Average wait time, average product, average experience. It is what it is.',
  'Honestly the Ohio rec market opening is more interesting to me than anything {location} has going on. {brand} is holding steady, which is fine I guess.',
  '{location} is improving slowly. {brand} product quality is slightly better than last year. Still not where competitors are but getting closer.',
  'Mixed feelings on {location}. The {brand} carts are solid but the flower has been inconsistent. Would give it a 3 out of 5 overall.',
  'Visited the Ascend Outlet — different from regular Ascend. Felt stripped down. Less selection, budget-focused. Confusing having both.',
  '{location} is a perfectly adequate dispensary. {brand} products are perfectly adequate cannabis. Nothing wrong with adequate.',
  'Decent enough selection at {location}. {brand} products are comparable to other MSO brands. Not going out of my way for it though.',
];

// Reddit-specific title templates
const redditTitles = [
  '{location} haul - quick review',
  'Honest {brand} review after 6 months',
  '{brand} quality has been inconsistent lately',
  'Is {location} worth the drive?',
  'PSA: {location} online menu is wrong again',
  '{brand} vs Rise - my comparison',
  'First time at {location}, thoughts',
  "Anyone else having issues with {brand} carts?",
  'Shoutout to the staff at {location}',
  'Hot take: {brand} is mid',
  '{location} wait times - is it just me?',
  'Ozone from Ascend - pics inside',
  'Why I stopped going to {location}',
  'Unpopular opinion: {brand} is actually decent',
  '{location} has really improved lately',
  'Just switched from Rise to {location}',
  'Weekly {brand} pickup from {location}',
  "What's the deal with {brand} quality control?",
  'Ascend Outlet vs regular Ascend — what is the difference?',
  'Why would anyone pay Ascend prices when...',
];

const redditUsernames = [
  'TreesEnthusiast420', 'IL_Patient_2025', 'ChronicReliefSeeker', 'BudBoss99',
  'MedicalMaryJane', 'CannaConnoisseur_', 'GreenTherapy2025', 'TerpHunterX',
  'DabDaddy561', 'MichiganFlowerFan', 'NJCannaPatient', 'OhioEnts_',
  'PurplePuffington', 'HashishHealer', 'mmjpatient2025', 'WaxWizard808',
  'SativaSweet', 'IndicaIndy', 'CannabisCarla', 'HerbHeaven23',
  'TrichomeCollector', 'VapeNation305', 'EdibleExplorer', 'BudgetBud420',
  'QualityQuest_MMJ', 'DailyDabber_', 'THCtherapist', 'CouchLockKing',
  'RosinRanger', 'CartConnoisseur', 'WeedWatcher2025', 'StoneySam_',
  'CannaCurious_OH', 'MichigEnts_', 'PASmoker_', 'MassMedPatient',
  'ChiCannabis', 'MDmedical420', 'BostonBuds_', 'HighHiker_',
];

const googleUsernames = [
  'John M.', 'Sarah L.', 'Mike R.', 'Lisa T.', 'David K.', 'Jennifer W.',
  'Chris B.', 'Amanda P.', 'Robert S.', 'Emily H.', 'James D.', 'Michelle F.',
  'Brian G.', 'Stephanie N.', 'Kevin C.', 'Rachel A.', 'Mark V.', 'Laura J.',
  'Daniel Z.', 'Nicole E.', 'Thomas Q.', 'Jessica Y.', 'Andrew O.', 'Megan I.',
  'Steven U.', 'Ashley X.', 'Paul W.', 'Katie M.', 'Ryan L.', 'Hannah K.',
  'Eric T.', 'Samantha R.', 'Justin P.', 'Olivia B.', 'Tyler S.', 'Emma D.',
  'Brandon H.', 'Sophia G.', 'Nathan F.', 'Alyssa C.',
];

const leaflyUsernames = [
  'BudReviewer_2025', 'CannaCritic420', 'StrainSleuth', 'TerpProfile',
  'FlowerPower_MMJ', 'WeedWise', 'HighNote_', 'GreenGrade',
  'LeafLover23', 'BudScore', 'StonerScientist', 'CannabisRater',
  'PotPurveyor', 'HerbHero_', 'DankDiaries', 'BluntReviews',
  'NugNerd420', 'cannabisking', 'mmj_reviewer', 'TokerTester',
  'GanjGuru', 'WeedWords', 'StrainGainz', 'BudgetBlaze',
  'OzoneFan_', 'FlowerFinder_', 'VapeVerdict', 'edible_expert',
  'PotPatient', 'DabDetective',
];

const weedmapsUsernames = [
  'LocalBuddy420', 'DispensaryHunter', 'WeedMapsPro', 'NearbyNugs',
  'MapMyMeds', 'BudFinder_', 'CannaLocator', 'GreenMap23',
  'FindMyFlower', 'mmj_mapper', 'DispoReview_', 'HerbHunter',
  'NugNavigator', 'WeedSeeker_', 'MapMyDabs', 'CannaExplorer',
  'LocalLeaf420', 'DispoDeal', 'BudBrowser_', 'FindMyTerps',
  'GreenGuide_', 'HerbGPS', 'mmj_locator', 'NugQuest',
  'TreeTracker', 'CannaCrawler', 'WeedWatch_', 'MapMyGreen',
  'DispoFinder', 'BudMap420',
];

export interface Review {
  id: number;
  source: string;
  text: string;
  rating: number | null;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  date: string;
  location: string;
  state: string;
  brand: string | null;
  categories: string[];
  author: string;
  subreddit: string | null;
  helpful: number;
  title: string | null;
}

function generateReview(index: number): Review {
  const rng = createRng(index * 9973 + 42);

  // Source distribution: ~25% Reddit, ~35% Google, ~20% Leafly, ~20% Weedmaps
  const sourceRoll = rng();
  let source: string;
  if (sourceRoll < 0.25) source = 'Reddit';
  else if (sourceRoll < 0.60) source = 'Google Reviews';
  else if (sourceRoll < 0.80) source = 'Leafly';
  else source = 'Weedmaps';

  // Location
  const location = rngPick(rng, locations);

  // Sentiment distribution: ~40% positive, ~30% neutral, ~30% negative
  const sentRoll = rng();
  let sentiment: 'positive' | 'neutral' | 'negative';
  let templates: string[];
  if (sentRoll < 0.40) {
    sentiment = 'positive';
    templates = positiveTemplates;
  } else if (sentRoll < 0.70) {
    sentiment = 'neutral';
    templates = neutralTemplates;
  } else {
    sentiment = 'negative';
    templates = negativeTemplates;
  }

  // Brand: ~60% have a brand, ~40% null
  const brandRoll = rng();
  const brand = brandRoll < 0.60 ? rngPick(rng, brands) : null;
  const displayBrand = brand || rngPick(rng, brands);

  // Pick template and fill in
  const template = rngPick(rng, templates);
  const text = template.replace(/{brand}/g, displayBrand).replace(/{location}/g, location.name);

  // Sentiment score
  let sentimentScore: number;
  if (sentiment === 'positive') {
    sentimentScore = Math.round((0.4 + rng() * 0.6) * 100) / 100;
  } else if (sentiment === 'neutral') {
    sentimentScore = Math.round((-0.25 + rng() * 0.5) * 100) / 100;
  } else {
    sentimentScore = Math.round((-1.0 + rng() * 0.55) * 100) / 100;
  }

  // Rating (null for Reddit)
  let rating: number | null = null;
  if (source !== 'Reddit') {
    if (sentiment === 'positive') {
      rating = rng() < 0.7 ? 5 : 4;
    } else if (sentiment === 'neutral') {
      const rr = rng();
      if (rr < 0.5) rating = 3;
      else if (rr < 0.8) rating = 4;
      else rating = 2;
    } else {
      const rr = rng();
      if (rr < 0.5) rating = 1;
      else if (rr < 0.8) rating = 2;
      else rating = 3;
    }
  }

  // Date: Mar 2025 - Feb 2026
  const monthOffset = Math.floor(rng() * 12);
  const baseMonth = 2 + monthOffset;
  const year = baseMonth > 11 ? 2026 : 2025;
  const month = (baseMonth % 12) + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(rng() * daysInMonth) + 1;
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Categories: 1-3
  const numCats = rngInt(rng, 1, 3);
  const catsCopy = [...categories];
  for (let c = catsCopy.length - 1; c > 0; c--) {
    const j = Math.floor(rng() * (c + 1));
    [catsCopy[c], catsCopy[j]] = [catsCopy[j], catsCopy[c]];
  }
  const reviewCategories = catsCopy.slice(0, numCats);

  // Author
  let author: string;
  if (source === 'Reddit') {
    author = rngPick(rng, redditUsernames);
  } else if (source === 'Google Reviews') {
    author = rngPick(rng, googleUsernames);
  } else if (source === 'Leafly') {
    author = rngPick(rng, leaflyUsernames);
  } else {
    author = rngPick(rng, weedmapsUsernames);
  }

  // Subreddit (Reddit only)
  const stateSubreddits = subredditsByState[location.state] || ['r/trees', 'r/cannabis'];
  const subreddit = source === 'Reddit' ? rngPick(rng, stateSubreddits) : null;

  // Title (Reddit only, ~70% of the time)
  let title: string | null = null;
  if (source === 'Reddit' && rng() < 0.7) {
    const titleTemplate = rngPick(rng, redditTitles);
    title = titleTemplate.replace(/{brand}/g, displayBrand).replace(/{location}/g, location.name);
  }

  // Helpful count
  const helpful = Math.floor(rng() * (source === 'Reddit' ? 150 : 30));

  return {
    id: index + 1,
    source,
    text,
    rating,
    sentiment,
    sentimentScore,
    date,
    location: location.name,
    state: location.state,
    brand,
    categories: reviewCategories,
    author,
    subreddit,
    helpful,
    title,
  };
}

export const reviews: Review[] = Array.from({ length: 450 }, (_, i) => generateReview(i));
