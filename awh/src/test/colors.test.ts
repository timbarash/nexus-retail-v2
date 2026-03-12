import { describe, it, expect } from 'vitest';
import { getScoreColor, getSentimentColor, getScoreLabel } from '../utils/colors';

describe('getScoreColor', () => {
  it('returns green for scores >= 65', () => {
    expect(getScoreColor(65)).toBe('#00a47c');
    expect(getScoreColor(80)).toBe('#00a47c');
    expect(getScoreColor(100)).toBe('#00a47c');
  });

  it('returns amber for scores >= 50 and < 65', () => {
    expect(getScoreColor(50)).toBe('#e8932c');
    expect(getScoreColor(64)).toBe('#e8932c');
  });

  it('returns red for scores < 50', () => {
    expect(getScoreColor(0)).toBe('#d94040');
    expect(getScoreColor(49)).toBe('#d94040');
  });
});

describe('getSentimentColor', () => {
  it('returns correct colors for each sentiment', () => {
    expect(getSentimentColor('positive')).toBe('#00a47c');
    expect(getSentimentColor('mixed')).toBe('#e8932c');
    expect(getSentimentColor('negative')).toBe('#d94040');
  });

  it('returns gray for neutral or unknown', () => {
    expect(getSentimentColor('neutral')).toBe('#77868e');
    expect(getSentimentColor('unknown')).toBe('#77868e');
  });
});

describe('getScoreLabel', () => {
  it('returns correct labels for score ranges', () => {
    expect(getScoreLabel(80)).toBe('Strong');
    expect(getScoreLabel(70)).toBe('Positive');
    expect(getScoreLabel(55)).toBe('Mixed');
    expect(getScoreLabel(40)).toBe('Weak');
    expect(getScoreLabel(20)).toBe('Poor');
  });
});
