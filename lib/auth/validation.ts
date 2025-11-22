import { authConfig } from './config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  const { passwordRequirements } = authConfig;

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters`);
  }

  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('Phone number is required');
    return { isValid: false, errors };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Check if it's a valid phone number (10-15 digits)
  const phoneRegex = /^\+?[\d]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDateOfBirth(dob: string): ValidationResult {
  const errors: string[] = [];

  if (!dob) {
    errors.push('Date of birth is required');
    return { isValid: false, errors };
  }

  const date = new Date(dob);
  const today = new Date();

  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
    return { isValid: false, errors };
  }

  if (date > today) {
    errors.push('Date of birth cannot be in the future');
  }

  // Check minimum age (e.g., 5 years old)
  const minAge = 5;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - minAge);

  if (date > minDate) {
    errors.push(`Must be at least ${minAge} years old`);
  }

  // Check maximum age (e.g., 100 years old)
  const maxAge = 100;
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - maxAge);

  if (date < maxDate) {
    errors.push('Invalid date of birth');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (!value || value.trim() === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateOTP(otp: string): ValidationResult {
  const errors: string[] = [];

  if (!otp) {
    errors.push('OTP is required');
    return { isValid: false, errors };
  }

  if (otp.length !== authConfig.otpLength) {
    errors.push(`OTP must be ${authConfig.otpLength} digits`);
  }

  if (!/^\d+$/.test(otp)) {
    errors.push('OTP must contain only numbers');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
