import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '..';

describe('EmptyState', () => {
  it('should render with provided message', () => {
    const { getByText } = render(<EmptyState message="No results found" />);
    
    expect(getByText('No results found')).toBeTruthy();
  });

  it('should display default styling', () => {
    const { getByTestId } = render(<EmptyState message="Test message" />);
    
    const container = getByTestId('empty-state-container');
    expect(container).toBeTruthy();
  });
});
