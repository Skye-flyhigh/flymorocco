import { SITE_NAME } from "@/data/metadata";

interface OgCardProps {
  title: string;
  subtitle: string;
  bgImageUrl: string | null;
  logoSrc: string | null;
}

export const OG_SIZE = { width: 1200, height: 630 };

export function createOgCard({ title, subtitle, bgImageUrl, logoSrc }: OgCardProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#1a1a1a",
      }}
    >
      {/* Background image */}
      {bgImageUrl && (
        <img
          src={bgImageUrl}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Content layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 50,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Top: Site branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {logoSrc && (
            <img
              src={logoSrc}
              style={{ width: 40, height: 40 }}
            />
          )}
          <span
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        {/* Bottom: Title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "white",
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 24,
              marginTop: 12,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
