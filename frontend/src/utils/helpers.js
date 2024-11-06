// helpers.js

// Validate email format
export const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return strongPasswordPattern.test(password);
};

// Format currency
export const formatCurrency = (amount, locale = 'en-US', currency = 'USD') => {
  if (typeof amount !== 'number') {
    throw new Error('Amount must be a number');
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Generate a random verification code
export const generateVerificationCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Debounce function to limit the rate of function calls
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Check if a value is empty
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '';
};

// Convert a string to title case
export const toTitleCase = (str) => {
  if (typeof str !== 'string') return ''; // Ensure input is a string
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Throttle function to limit the number of times a function can be called
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
