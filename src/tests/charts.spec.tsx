import React from 'react';
import { render, screen } from '@testing-library/react';
import LineChartCard from '../components/Charts/LineChartCard';
import PieChartCard from '../components/Charts/PieChartCard';

describe('Charts', () => {
  it('renders LineChartCard with SVG', () => {
    render(<LineChartCard />);
    const svgElement = screen.getByRole('img');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders PieChartCard with SVG', () => {
    render(<PieChartCard />);
    const svgElement = screen.getByRole('img');
    expect(svgElement).toBeInTheDocument();
  });
});
