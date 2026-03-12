import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SentimentBadge from '../components/SentimentBadge';

describe('SentimentBadge', () => {
  it('renders capitalized sentiment text', () => {
    render(<SentimentBadge sentiment="positive" />);
    expect(screen.getByText('Positive')).toBeInTheDocument();
  });

  it('applies correct color for positive sentiment', () => {
    render(<SentimentBadge sentiment="positive" />);
    const badge = screen.getByText('Positive');
    expect(badge).toHaveStyle({ color: '#00a47c' });
  });

  it('applies correct color for negative sentiment', () => {
    render(<SentimentBadge sentiment="negative" />);
    const badge = screen.getByText('Negative');
    expect(badge).toHaveStyle({ color: '#d94040' });
  });

  it('applies correct color for mixed sentiment', () => {
    render(<SentimentBadge sentiment="mixed" />);
    const badge = screen.getByText('Mixed');
    expect(badge).toHaveStyle({ color: '#e8932c' });
  });

  it('applies correct color for neutral sentiment', () => {
    render(<SentimentBadge sentiment="neutral" />);
    const badge = screen.getByText('Neutral');
    expect(badge).toHaveStyle({ color: '#77868e' });
  });
});
