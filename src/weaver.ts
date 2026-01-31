import { initWeaver } from '@yohay13/weaver-sdk';

// Initialize Weaver analytics interception
export const weaver = initWeaver({
  apiKey: 'wvr_test_api_key_12345',
  apiUrl: 'https://d76aaa9884e2.ngrok-free.app',
  // Automatically intercept common analytics providers
  autoIntercept: true,
  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
});

export default weaver;
