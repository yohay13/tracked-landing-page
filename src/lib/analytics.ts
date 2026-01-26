// Centralized Analytics Service - Mock Mixpanel Implementation
// Replace with real Mixpanel SDK in production

import { track as weaverTrack } from '@weaver/sdk';

type EventPropertyValue = string | number | boolean | null | EventPropertyValue[] | { [key: string]: EventPropertyValue };
type EventProperties = Record<string, EventPropertyValue>;

interface AnalyticsUser {
  id?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private initialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(type: string, data: unknown): void {
    // In production, this would send to Mixpanel
    console.log(`[Mixpanel ${type}]`, JSON.stringify(data, null, 2));
  }

  init(token: string): void {
    if (this.initialized) return;

    this.log('INIT', { token, timestamp: new Date().toISOString() });
    this.initialized = true;
    weaverTrack('Mixpanel Initialized', { token, timestamp: new Date().toISOString() });
  }

  identify(userId: string, traits?: AnalyticsUser): void {
    this.userId = userId;
    this.log('IDENTIFY', {
      userId,
      traits,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    });
    weaverTrack('User Identified', {
      userId,
      traits,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  track(eventName: string, properties?: EventProperties): void {
    const payload = {
      event: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : null,
      },
    };
    this.log('TRACK', payload);
    weaverTrack(eventName, payload.properties);
  }

  // Page view tracking
  pageView(pageName: string, properties?: EventProperties): void {
    this.track('Page Viewed', {
      pageName,
      ...properties,
    });
  }

  reset(): void {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.log('RESET', { newSessionId: this.sessionId });
    weaverTrack('Analytics Reset', { newSessionId: this.sessionId });
  }
}

// Singleton instance
export const analytics = new Analytics();

// Event name constants for consistency
export const EVENTS = {
  // Landing page
  LANDING_PAGE_VIEWED: 'Landing Page Viewed',
  CTA_CLICKED: 'CTA Clicked',

  // Quiz flow
  QUIZ_STARTED: 'Quiz Started',
  QUIZ_STEP_VIEWED: 'Quiz Step Viewed',
  QUIZ_ANSWER_SELECTED: 'Quiz Answer Selected',
  QUIZ_STEP_COMPLETED: 'Quiz Step Completed',
  QUIZ_COMPLETED: 'Quiz Completed',
  QUIZ_ABANDONED: 'Quiz Abandoned',

  // Plan selection
  PLANS_VIEWED: 'Plans Viewed',
  PLAN_SELECTED: 'Plan Selected',
  PLAN_CHANGED: 'Plan Changed',

  // Cart
  CART_VIEWED: 'Cart Viewed',
  ITEM_ADDED_TO_CART: 'Item Added to Cart',
  ITEM_REMOVED_FROM_CART: 'Item Removed from Cart',
  CART_UPDATED: 'Cart Updated',
  CHECKOUT_STARTED: 'Checkout Started',
  CHECKOUT_COMPLETED: 'Checkout Completed',

  // General
  BUTTON_CLICKED: 'Button Clicked',
  ERROR_OCCURRED: 'Error Occurred',
}
