'use client';

import { useEffect, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';
import { initWeaver, track as weaverTrack, identify as weaverIdentify, page as weaverPage } from '@weaver/sdk';

const MIXPANEL_TOKEN = 'your-mixpanel-token-here'; // Replace with real token in production
const weaver = initWeaver({ apiKey: 'wvr_test_api_key_12345' });

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize analytics on app mount
    analytics.init(MIXPANEL_TOKEN);
    weaverPage();
  }, []);

  analytics.track = (event: string, props: object) => {
    analytics.track(event, props);
    weaverTrack(event, props);
  };

  analytics.identify = (id: string, props: object) => {
    analytics.identify(id, props);
    weaverIdentify(id, props);
  };

  analytics.page = (page: string) => {
    analytics.page(page);
    weaverPage(page);
  };

  return <>{children}</>;
}
