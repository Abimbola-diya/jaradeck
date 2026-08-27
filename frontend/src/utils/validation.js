/**
 * Utility functions for validating Phone numbers and Email addresses.
 */

/**
 * Validates a phone number (Supports Nigerian 11-digit local '080...', '+234...' intl, and general intl formats)
 * @param {string} phone 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  const raw = phone.trim();
  const cleaned = raw.replace(/[\s\-\(\)]/g, '');

  // Must contain only digits and optional leading +
  if (!/^\+?\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only numbers.' };
  }

  // 1. Standard Nigerian 11-digit local format: starts with 0 and 10 digits (e.g. 08012345678, 09012345678, 070..., 081...)
  if (/^0[789][01]\d{8}$/.test(cleaned)) {
    return { isValid: true };
  }

  // 2. International Nigerian Format with +234 or 234 (e.g. +2348012345678, 2348012345678)
  if (/^(\+?234)[789][01]\d{8}$/.test(cleaned)) {
    return { isValid: true };
  }

  // 3. General 11-digit check for local phone numbers starting with 0
  if (cleaned.startsWith('0')) {
    if (cleaned.length === 11) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: `Local phone number must be 11 digits (e.g., 08012345678). You entered ${cleaned.length} digits.`,
    };
  }

  // 4. International format (+234...) check length
  if (cleaned.startsWith('+234') || cleaned.startsWith('234')) {
    const digitsOnly = cleaned.replace(/\+/g, '');
    if (digitsOnly.length === 13) { // 234 + 10 digits = 13 digits total
      return { isValid: true };
    }
    return {
      isValid: false,
      error: 'International number format should be +234 followed by 10 digits (e.g. +2348012345678).',
    };
  }

  // 5. Robust fallback for general international phone numbers (10 to 15 digits)
  const digitsOnly = cleaned.replace(/\+/g, '');
  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return { isValid: true };
  }

  return { isValid: false, error: 'Please enter a valid phone number (e.g., 08012345678 or +2348012345678).' };
}

/**
 * Validates Email address format (RFC 5322 compliance + real domain & Gmail specific validation)
 * @param {string} email 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic RFC 5322 structure check: username@domain.tld
  const standardEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!standardEmailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const [username, domain] = trimmed.split('@');

  // Prevent invalid punctuation in username
  if (username.includes('..') || username.startsWith('.') || username.endsWith('.')) {
    return { isValid: false, error: 'Email address contains invalid formatting.' };
  }

  // Gmail specific rules
  if (domain === 'gmail.com') {
    const cleanUsername = username.replace(/\./g, '');
    if (cleanUsername.length < 6 || cleanUsername.length > 30) {
      return { isValid: false, error: 'Gmail usernames must be between 6 and 30 characters.' };
    }
    if (!/^[a-z0-9.]+$/.test(username)) {
      return { isValid: false, error: 'Gmail usernames can only contain letters, numbers, and periods.' };
    }
  }

  // Ensure domain extension (TLD) is valid
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'Please enter a valid domain extension (e.g. .com or .ng).' };
  }

  return { isValid: true };
}

/**
 * Validates Password to ensure it meets strong security requirements
 * @param {string} password 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Please enter your password.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter.' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\|/~`]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character.' };
  }
  return { isValid: true };
}

/**
 * Validates Full Name
 * @param {string} name 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateFullName(name) {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Please enter your full name.' };
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    return { isValid: false, error: 'Please enter both your first and last name.' };
  }
  return { isValid: true };
}
