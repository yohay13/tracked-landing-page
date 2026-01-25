'use client';

import { useEffect, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';

const MIXPANEL_TOKEN = 'your-mixpanel-token-here'; // Replace with real token in production

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize analytics on app mount
    analytics.init(MIXPANEL_TOKEN);
  }, []);

  return <>{children}</>;
}
