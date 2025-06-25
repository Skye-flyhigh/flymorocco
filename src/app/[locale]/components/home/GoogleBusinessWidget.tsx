"use client";
import { useLazyScript } from "./use-lazy-script";

export default function GoogleBusinessWidget() {
  const { loaded, elementRef } = useLazyScript(
    "//apps.elfsight.com/p/platform.js",
  );

  return (
    <article className="w-screen p-10">
      <div
        ref={elementRef}
        className="elfsight-app-0fdbf0ba-1c02-4baa-968f-9ae0e8228219"
        style={{ marginTop: "30px" }}
      >
        {!loaded ? "Loading Google Reviews..." : "Google"}
      </div>
    </article>
  );
}
