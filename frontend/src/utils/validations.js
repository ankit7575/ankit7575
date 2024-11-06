// validations.js

// Constants for regex patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/; // Format: (123) 456-7890
const urlPattern = /^(ftp|http|https):\/\/[^\s]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD

// Validate email format
export const validateEmail = (email) => {
    return emailPattern.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
    const isLengthValid = password.length >= 6; // Adjust length as needed
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = isLengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return {
        isValid,
        errors: {
            length: isLengthValid,
            upperCase: hasUpperCase,
            lowerCase: hasLowerCase,
            number: hasNumber,
            specialChar: hasSpecialChar,
        },
    };
};

// Validate required fields
export const validateRequired = (value) => {
    return value.trim() !== '';
};

// Validate phone number format (US example)
export const validatePhoneNumber = (phone) => {
    return phonePattern.test(phone);
};

// Validate that two values match (e.g., password and confirm password)
export const validateMatch = (value1, value2) => {
    return value1 === value2;
};

// Validate a URL format
export const validateURL = (url) => {
    return urlPattern.test(url);
};

// Validate a number within a specific range
export const validateNumberInRange = (number, min, max) => {
    return typeof number === 'number' && number >= min && number <= max; // Ensure input is a number
};

// Validate if a string is a valid date
export const validateDate = (dateString) => {
    const isValidFormat = datePattern.test(dateString);
    const date = new Date(dateString);
    return isValidFormat && !isNaN(date.getTime());
};

// Validate a string's length
export const validateStringLength = (value, minLength, maxLength) => {
    const isLengthValid = value.length >= minLength && value.length <= maxLength;
    return {
        isValid: isLengthValid,
        length: value.length,
        minLength,
        maxLength,
    };
};
