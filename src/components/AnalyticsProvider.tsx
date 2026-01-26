'use client';

import { useEffect, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';
import { initWeaver, track as weaverTrack, identify as weaverIdentify, page as weaverPage } from '@weaver/sdk';

const MIXPANEL_TOKEN = 'your-mixpanel-token-here'; // Replace with real token in production
const weaver = initWeaver({ apiKey: 'wvr_test_api_key_12345' });

export function track(event: string, props: object) {
  mixpanel.track(event, props);
  weaverTrack(event, props);
}

export function identify(user: object) {
  mixpanel.identify(user);
  weaverIdentify(user);
}

export function pageView(url: string) {
  mixpanel.track('Page View', { url });
  weaverPage(url);
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize analytics on app mount
    analytics.init(MIXPANEL_TOKEN);
  }, []);

  return <>{children}</>;
}
