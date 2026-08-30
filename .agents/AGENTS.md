# Project Rules & Security Guidelines

## 1. Security-First Code Development & Vulnerability Prevention
- **No Hardcoded Credentials or Fallback Secrets**: Never hardcode API keys, JWT secrets, passwords, or tokens in source code files. Always load credentials securely from environment variables (`.env`).
- **Secure Authentication & Authorization**:
  - Enforce strict input validation, rate limiting, and brute-force protection on all auth endpoints (e.g. login, OTP verification, password resets).
  - Use cryptographically secure secret generators for OTPs and tokens (`secrets` module in Python).
  - Enforce explicit expiration, single-use invalidation, and rate limits on OTPs.
  - Always hash passwords using strong, adaptive algorithms before storage.
  - Secure JWTs with strong cryptographic keys and algorithms.
- **Defense in Depth & Input Sanitization**:
  - Always validate and sanitize user inputs on both frontend and backend to prevent SQL injection, XSS, SSRF, and parameter tampering.
  - Use parameterized queries or ORM abstractions for database interactions.
  - Return clear, non-leaking error messages to clients without revealing internal system details, stack traces, or exact account presence where sensitive.
