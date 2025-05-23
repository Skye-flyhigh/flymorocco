"use client";

import { SiteMeta, siteMeta } from "@/lib/validation/siteMeta";
import { LeafletMouseEvent, Path, StyleFunction } from "leaflet";
import { Link2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  FeatureCollection,
  Feature,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);

export default function SiteMapContainer({
  zoom,
  lat,
  lon,
}: {
  zoom: number;
  lat: number;
  lon: number;
}) {
  const t = useTranslations("siteGuides");
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);
  const [airspaceToggle, setAirspaceToggle] = useState<boolean>(false);

  useEffect(() => {
    fetch("/Morocco-GeoJSON-FL190.txt")
      .then((res) => res.json())
      .then((data) => setGeojsonData(data))
      .catch((err) => console.error("Error loading Airspaces GeoJSON:", err));
  }, []);

  type AirspaceClass =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "G"
    | "P"
    | "R"
    | "Q"
    | "UNCLASSIFIED";
  type AirspaceType =
    | "P"
    | "R"
    | "Q"
    | "CTR"
    | "GSEC"
    | "SRZ"
    | "MTMA"
    | "TRA"
    | "UNCLASSIFIED";
  const colorClass: Record<AirspaceClass, string> = {
    A: "#b3e8ff",
    B: "#73b4ff",
    C: "#73a6ff",
    D: "#6a3d9a",
    E: "#b3ff87",
    G: "#73ffb0",
    P: "#e31a1c",
    R: "#ff8e42",
    Q: "#fcd142",
    UNCLASSIFIED: "#bdbdbd",
  };
  const colorType: Record<AirspaceType, string> = {
    P: "#e31a1c",
    R: "#ff8e42",
    Q: "#fcd142",
    CTR: "#1f78b4",
    GSEC: "#ff8ce4",
    SRZ: "#f5457c",
    MTMA: "#ffd736",
    TRA: "#f9ff3d",
    UNCLASSIFIED: "#bdbdbd",
  };

  type AirspaceFeature = Feature<
    Geometry,
    {
      name: string;
      class?: AirspaceClass;
      type?: AirspaceType;
      upperCeiling?: { value: number; unit: string };
      lowerCeiling?: { value: number; unit: string };
    }
  >;

  const filteredData = airspaceToggle
    ? {
        ...geojsonData,
        features: geojsonData?.features.filter(
          (f) => f?.properties?.type === "GSEC",
        ),
      }
    : geojsonData;

  function defaultStyle(feature: AirspaceFeature) {
    const airspaceClass =
      feature?.properties?.class || ("UNCLASSIFIED" as AirspaceClass);
    const airspaceType =
      feature?.properties?.type || ("UNCLASSIFIED" as AirspaceType);

    let pickedColor = "";
    if (feature?.properties?.type !== "UNCLASSIFIED") {
      pickedColor = colorType[airspaceType];
    } else {
      pickedColor = colorClass[airspaceClass];
    }
    return {
      color: pickedColor || "#fff",
      weight: 2,
      fillOpacity: 0.3,
    };
  }

  interface StyledLayer extends Path {
    initialStyle?: {
      color?: string;
      fillColor?: string;
      fillOpacity?: number;
    };
  }

  function onEachFeature(feature: AirspaceFeature, layer: Path) {
    const initialStyle = {
      color: layer.options.color,
      fillColor: layer.options.fillColor,
      fillOpacity: layer.options.fillOpacity,
    };
    (layer as StyledLayer).initialStyle = initialStyle;

    layer.bindPopup(`
            <strong>${feature.properties?.name}</strong></br>
            Class: ${feature.properties?.class || "UNCLASSIFIED"}</br>
            Upper limit: ${feature.properties?.upperCeiling?.value} ${feature.properties?.upperCeiling?.unit}</br>
            Lower limit: ${feature.properties?.lowerCeiling?.value} ${feature.properties?.lowerCeiling?.unit}
            `);

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        e.target.setStyle({
          color: "#38bdf8", // Tailwind 'sky-400' color or any you like
          fillOpacity: 0.4,
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        const targetLayer = e.target as Path;
        const original = (targetLayer as StyledLayer).initialStyle;
        if (!original) return;
        targetLayer.setStyle(original);
      },
    });
  }

  return (
    <div className=" h-[700px] sm:w-[600px] md:w-[800px] w-[350px]rounded-lg shadow z-0 relative">
      <div
        id="legend"
        aria-label="Map Legend"
        className="legend text-base-content absolute top-4 right-4 z-[1000] rounded-lg bg-radial from-base-100 to-base-200 shadow-lg h-fit w-fit p-5"
      >
        <h2 className="font-semibold w-fit">Legend (up to FL190)</h2>
        <div
          id="legend-content"
          className="text-sm grid grid-cols-[120px_40px] items-center gap-2 p-2"
        >
          <p>Airspaces</p>
          <label className="toggle text-base-content">
            <input
              type="checkbox"
              onClick={() =>
                airspaceToggle
                  ? setAirspaceToggle(false)
                  : setAirspaceToggle(true)
              }
            />
            <svg
              aria-label="enabled"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="4"
                fill="none"
                stroke="currentColor"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </g>
            </svg>
            <svg
              aria-label="disabled"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </label>
          <p>Paragliding sites</p>
          <MapPin />
          <p>Paragliding zones</p>
          <div
            className="h-6 w-10"
            style={{
              border: "3px solid #ff8ce4",
              backgroundColor: "#ff8ce4",
              opacity: 0.4,
            }}
          ></div>
        </div>
      </div>

      <MapContainer
        center={[lat, lon]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-[700px] md:w-[800px] sm:w-[600px] w-[350px] rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(siteMeta).map((site: SiteMeta) => (
          <Marker key={site.slug} position={[site.lat, site.lon]}>
            <Popup>
              <Link
                href={`/site-guides/${site.slug}`}
                className="flex items-center justify-center"
              >
                <Link2 />
                {t(`${site.slug}.name`)}
              </Link>
            </Popup>
          </Marker>
        ))}
        {geojsonData && (
          <GeoJSON
            key={airspaceToggle ? "gsec-only" : "all-airspaces"} // ← Force refresh
            data={filteredData as FeatureCollection}
            style={defaultStyle as StyleFunction}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
