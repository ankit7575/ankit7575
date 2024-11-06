import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders Sign Up page', () => {
  render(
    <Router>
      <App />
    </Router>
  );

  // Check if the Sign Up page is rendered by looking for specific text
  const signUpElement = screen.getByText(/sign up/i);
  expect(signUpElement).toBeInTheDocument();

  // Additional assertions
  const emailInput = screen.getByPlaceholderText(/email/i); // Example for an email input
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByPlaceholderText(/password/i); // Example for a password input
  expect(passwordInput).toBeInTheDocument();

  const submitButton = screen.getByRole('button', { name: /register/i }); // Example for the submit button
  expect(submitButton).toBeInTheDocument();
});
