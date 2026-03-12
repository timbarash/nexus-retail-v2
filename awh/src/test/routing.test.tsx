import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('Routing', () => {
  it('renders Overview page at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
  });

  it('renders Scorecard page at /scorecard', () => {
    render(
      <MemoryRouter initialEntries={['/scorecard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Composite Scorecard' })).toBeInTheDocument();
  });

  it('renders State Analysis page at /states', () => {
    render(
      <MemoryRouter initialEntries={['/states']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'State Analysis' })).toBeInTheDocument();
  });

  it('renders Social Pulse page at /social', () => {
    render(
      <MemoryRouter initialEntries={['/social']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Social.*Reddit Pulse/ })).toBeInTheDocument();
  });

  it('renders News page at /news', () => {
    render(
      <MemoryRouter initialEntries={['/news']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /News.*Investor Sentiment/ })).toBeInTheDocument();
  });

  it('renders Methodology page at /methodology', () => {
    render(
      <MemoryRouter initialEntries={['/methodology']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Methodology' })).toBeInTheDocument();
  });

  it('renders Review Explorer page at /reviews', () => {
    render(
      <MemoryRouter initialEntries={['/reviews']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Review Explorer' })).toBeInTheDocument();
  });

  it('renders Location Insights page at /locations', () => {
    render(
      <MemoryRouter initialEntries={['/locations']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Location Insights' })).toBeInTheDocument();
  });

  it('renders Competitive Insights page at /competitive', () => {
    render(
      <MemoryRouter initialEntries={['/competitive']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Competitive Landscape' })).toBeInTheDocument();
  });

  it('renders sidebar navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Scorecard/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /State Analysis/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Social Pulse/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Review Explorer/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Location Insights/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Competitive/ })).toBeInTheDocument();
  });
});
