// frontend/src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation links', () => {
  render(<App />);
  const browseLink = screen.getByText(/Browse Listings/i);
  const adminLink = screen.getByText(/Admin Panel/i);
  expect(browseLink).toBeInTheDocument();
  expect(adminLink).toBeInTheDocument();
});
