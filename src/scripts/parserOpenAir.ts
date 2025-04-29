import { Parser } from "@openaip/openair-parser";
import { writeFileSync } from "fs";

// 1. Configure the parser
const parser = new Parser({
  version: "2.0",
  allowedClasses: ["A", "B", "C", "D", "E", "F", "G", "P", "Q", "R"],
  allowedTypes: [],
  unlimited: 150,
  geometryDetail: 100,
  validateGeometry: false,
  fixGeometry: true,
  consumeDuplicateBuffer: 0,
  outputGeometry: "POLYGON",
  includeOpenair: false,
});

// 2. Parse your OpenAir file
const { success, error } = parser.parse("public/Morocco-OpenAir-FL190.txt");

if (success) {
  const geojson = parser.toGeojson();

  // 3. Save the result
  writeFileSync(
    "public/Morocco-GeoJSON-FL190.txt",
    JSON.stringify(geojson, null, 2),
  );

  console.log("✅ Successfully parsed OpenAIR to GeoJSON!");
} else {
  console.error("❌ Parsing error:", error.errorMessage);
}
