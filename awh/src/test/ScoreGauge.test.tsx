import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreGauge from '../components/ScoreGauge';

describe('ScoreGauge', () => {
  it('renders the score number', () => {
    render(<ScoreGauge score={72} />);
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('renders the score label', () => {
    render(<ScoreGauge score={72} />);
    expect(screen.getByText('Positive')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<ScoreGauge score={62} label="Overall" />);
    expect(screen.getByText('Overall')).toBeInTheDocument();
  });

  it('renders SVG elements', () => {
    const { container } = render(<ScoreGauge score={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });
});
