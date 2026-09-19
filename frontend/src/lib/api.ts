// Centralized API Base URL configuration for JaraDeck frontend
// Checks both VITE_API_BASE_URL and VITE_API_URL, defaulting to http://localhost:8000
const rawUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000';

// Strips trailing slashes to prevent malformed double-slash URLs like https://api.com//api/auth
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
