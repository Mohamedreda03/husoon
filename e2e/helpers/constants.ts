/**
 * Shared constants for E2E tests.
 */

export const TEST_USERS = {
  newUser: {
    name: 'New Test User',
    email: `newuser_${Date.now()}@example.com`,
    password: 'password123',
  },
  existingUser: {
    // This will be created dynamically during setup, or use a known seed
    name: 'Existing Test User',
    email: `existinguser_${Date.now()}@example.com`,
    password: 'password123',
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  SCHEDULE: '/schedule',
  TIMER: '/timer',
  STATS: '/stats',
  SETTINGS: '/settings'
};

export const SELECTORS = {
  // Shared selectors
  toasts: {
    success: '.bg-success, .text-success, [role="alert"]', // Adjust based on Sonner styles
    error: '.bg-error, .text-error',
  },
  
  // Specific page selectors could go here, but mostly they belong in POMs
};
