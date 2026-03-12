export function getScoreColor(score: number): string {
  if (score >= 65) return '#00a47c';
  if (score >= 50) return '#e8932c';
  return '#d94040';
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return '#00a47c';
    case 'mixed':
      return '#e8932c';
    case 'negative':
      return '#d94040';
    default:
      return '#77868e';
  }
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong';
  if (score >= 65) return 'Positive';
  if (score >= 50) return 'Mixed';
  if (score >= 35) return 'Weak';
  return 'Poor';
}

export const colors = {
  opalNavy: '#153f66',
  sapphireBlue: '#0075e0',
  dutchieGreen: '#00a47c',
  gray50: '#f6f6f6',
  gray100: '#e3e7e9',
  gray200: '#c4cdd1',
  gray300: '#77868e',
  gray400: '#4a5459',
  gray500: '#2c3236',
  amber: '#e8932c',
  red: '#d94040',
};
