"use client";

import { useEffect } from "react";
import { trackSiteGuideView } from "@/lib/analytics";

interface SiteGuideTrackerProps {
  siteName: string;
}

export default function SiteGuideTracker({ siteName }: SiteGuideTrackerProps) {
  useEffect(() => {
    trackSiteGuideView(siteName);
  }, [siteName]);

  return null; // This component doesn't render anything
}
