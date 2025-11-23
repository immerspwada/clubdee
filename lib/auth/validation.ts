import { authConfig } from './config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('กรุณากรอกอีเมล');
    return { isValid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
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
    errors.push('กรุณากรอกรหัสผ่าน');
    return { isValid: false, errors };
  }

  if (password.length < passwordRequirements.minLength) {
    errors.push(`รหัสผ่านต้องมีอย่างน้อย ${passwordRequirements.minLength} ตัวอักษร`);
  }

  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว');
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว');
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');
  }

  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('กรุณากรอกเบอร์โทรศัพท์');
    return { isValid: false, errors };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Check if it's a valid phone number (10-15 digits)
  const phoneRegex = /^\+?[\d]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    errors.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDateOfBirth(dob: string): ValidationResult {
  const errors: string[] = [];

  if (!dob) {
    errors.push('กรุณากรอกวันเกิด');
    return { isValid: false, errors };
  }

  const date = new Date(dob);
  const today = new Date();

  if (isNaN(date.getTime())) {
    errors.push('รูปแบบวันที่ไม่ถูกต้อง');
    return { isValid: false, errors };
  }

  if (date > today) {
    errors.push('วันเกิดต้องไม่เกินวันปัจจุบัน');
  }

  // Check minimum age (e.g., 5 years old)
  const minAge = 5;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - minAge);

  if (date > minDate) {
    errors.push(`ต้องมีอายุอย่างน้อย ${minAge} ปี`);
  }

  // Check maximum age (e.g., 100 years old)
  const maxAge = 100;
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - maxAge);

  if (date < maxDate) {
    errors.push('วันเกิดไม่ถูกต้อง');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (!value || value.trim() === '') {
    errors.push(`กรุณากรอก${fieldName}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateOTP(otp: string): ValidationResult {
  const errors: string[] = [];

  if (!otp) {
    errors.push('กรุณากรอกรหัส OTP');
    return { isValid: false, errors };
  }

  if (otp.length !== authConfig.otpLength) {
    errors.push(`รหัส OTP ต้องมี ${authConfig.otpLength} หลัก`);
  }

  if (!/^\d+$/.test(otp)) {
    errors.push('รหัส OTP ต้องเป็นตัวเลขเท่านั้น');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
