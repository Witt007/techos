'use client';

import { useEffect } from 'react';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'techos_session_id';
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    window.localStorage.setItem(key, id);
  }
  return id;
}

export default function AnalyticsTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sessionId = getOrCreateSessionId();
    const path = window.location.pathname + window.location.search;
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const languages = navigator.languages;

    const payload = {
      sessionId,
      path,
      referrer,
      userAgent,
      screen: { width: screenWidth, height: screenHeight },
      timezone,
      language,
      languages,
      timestamp: new Date().toISOString(),
    };

    // Fire-and-forget, no await
    fetch('/api/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // ignore
    });
  }, []);

  return null;
}
