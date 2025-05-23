"use client";
import React, { useEffect, useState } from "react";
import zones from "@/data/CAA_Paragliding_Zones_SRZ.json"; // Adjust path to your JSON

// Group zones by province (region)
const groupByRegion = (zones: { region?: string; zoneName: string }[]) => {
  return zones.reduce((acc: Record<string, { zoneName: string }[]>, zone) => {
    const region = zone.region || "Unknown";
    if (!acc[region]) acc[region] = [];
    acc[region].push(zone);
    return acc;
  }, {});
};

const groupedZones = groupByRegion(zones);

export default function SiteSelector({
  selectionAction,
}: {
  selectionAction: (payload: { selectedZones: string[] }) => void;
}) {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const toggleZone = (zoneName: string) => {
    if (selectedZones.includes(zoneName)) {
      setSelectedZones(selectedZones.filter((z) => z !== zoneName));
    } else {
      setSelectedZones([...selectedZones, zoneName]);
    }
  };

  const selectRegion = (region: string) => {
    const regionZones = groupedZones[region].map(
      (zone: { zoneName: string }) => zone.zoneName,
    );
    const allSelected = regionZones.every((z: string) =>
      selectedZones.includes(z),
    );

    if (allSelected) {
      setSelectedZones(selectedZones.filter((z) => !regionZones.includes(z)));
    } else {
      const uniqueZones = Array.from(
        new Set([...selectedZones, ...regionZones]),
      );
      setSelectedZones(uniqueZones);
    }
  };

  useEffect(() => {
    selectionAction?.({ selectedZones });
  }, [selectionAction, selectedZones]);

  return (
    <section id="CAA-form-section">
      {Object.entries(groupedZones).map(([region, regionZones]) => (
        <fieldset key={region} className="CAA-form-fieldset">
          <legend className="CAA-form-legend">
            <input
              type="checkbox"
              className="checkbox bg-base-100"
              onChange={() => selectRegion(region)}
              checked={regionZones.every((z) =>
                selectedZones.includes(z.zoneName),
              )}
            />
            Region: {region}
          </legend>

          {regionZones.map((zone) => (
            <label key={zone.zoneName} className="CAA-form-label">
              <input
                type="checkbox"
                className="checkbox"
                value={zone.zoneName}
                onChange={() => toggleZone(zone.zoneName)}
                checked={selectedZones.includes(zone.zoneName)}
              />
              {zone.zoneName}
            </label>
          ))}
        </fieldset>
      ))}
    </section>
  );
}
