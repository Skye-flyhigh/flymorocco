"use client";

import { useEffect } from "react";
// Analytics functionality temporarily removed

interface SiteGuideTrackerProps {
  siteName: string;
}

export default function SiteGuideTracker({ siteName }: SiteGuideTrackerProps) {
  useEffect(() => {
    // Analytics tracking will be added later
    console.log("📊 Site guide view tracked:", siteName);
  }, [siteName]);

  return null; // This component doesn't render anything
}
