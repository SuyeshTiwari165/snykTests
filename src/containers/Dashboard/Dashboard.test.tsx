import React from 'react';
import { render, screen } from '@testing-library/react';
import '../AdminPanel/PiiData/node_modules/@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';

describe('<Dashboard />', () => {
  test('it should mount', () => {
    render(<Dashboard />);
    
    const dashboard = screen.getByTestId('Dashboard');

    expect(dashboard).toBeInTheDocument();
  });
});