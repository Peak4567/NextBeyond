"use client";

import { useEffect, useState } from "react";

export interface ClientSiteSettings {
  site_title: string;
  site_description: string;
  navbar_logo: string;
  footer_logo: string;
  footer_description: string;
  footer_copyright: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_line: string;
  live_news_ticker: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<ClientSiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => setSettings(null));
  }, []);

  return settings;
}
