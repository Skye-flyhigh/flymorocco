"use client";
import { useEffect } from "react";

export default function TrustpilotWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional: Clean up on unmount if needed
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="trustpilot-widget"
      data-locale="en-GB"
      data-template-id="5419b6a8b0d04a076446a9ad"
      data-businessunit-id="63de251ee6b0890c92bcca91"
      data-style-height="24px"
      data-style-width="100%"
      data-min-review-count="3"
      data-style-alignment="center"
    >
      <a
        href="https://uk.trustpilot.com/review/flymorocco.info"
        target="_blank"
        rel="noopener noreferrer"
      >
        Trustpilot
      </a>
    </div>
  );
}