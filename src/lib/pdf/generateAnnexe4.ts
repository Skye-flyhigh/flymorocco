import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import {
  FullFormSchemaType,
  GliderSchemaType,
} from "../validation/CaaFormdata";
import zones from "@/data/CAA_Paragliding_Zones_SRZ.json";
import path from "path";
import fs from "fs";
import { pdfFile } from "./annexeTypes";

export default async function generateAnnexe4(formData: FullFormSchemaType): Promise<pdfFile> {
  const participants = formData.participants;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const { width, height } = page.getSize();
  const fontSize = 12;
  let cursorY = height - 50; //Start of the page

  // Helper functions
  const formatDate = (date: Date) =>
    date ? date.toLocaleDateString("fr-FR") : "-";

  const ensureSpace = (spaceNeeded = 20): boolean => {
    if (cursorY - spaceNeeded < 50) {
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      page = newPage;
      pages.push(newPage);
      return true; // signal to reset cursorY externally
    }
    return false;
  };

  const writeCentered = (string: string, size?: number): number => {
    if (ensureSpace()) {
      cursorY = height - 50;
    }
    const textWidth = font.widthOfTextAtSize(string, size || fontSize);
    page.drawText(string, {
      x: (width - textWidth) / 2,
      y: cursorY,
      size: size || fontSize,
      font: boldFont,
    });
    return cursorY;
  };

  const writeLine = (string: string, x: number): number => {
    if (ensureSpace()) {
      cursorY = height - 50;
    }
    page.drawText(string, { x, y: cursorY, size: fontSize, font });
    cursorY -= 18;
    return cursorY;
  };

  function wrapText(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        line = testLine;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }

    if (line) lines.push(line);

    return lines;
  }

  const drawTableRow = (
    columns: string[],
    y: number,
    cellWidths: number[] = [190, 165, 140],
    font: PDFFont,
    xStart: number = 50,
    lineHeight: number = 14,
    padding: number = 10,
  ) => {
    let x = xStart;
    let maxLines = 1;

    const wrappedColumns = columns.map((text, i) => {
      const wrapped = wrapText(text, font, fontSize, cellWidths[i] - 8);
      if (wrapped.length > maxLines) maxLines = wrapped.length;
      return wrapped;
    });

    const cellHeight = lineHeight * maxLines + padding;
    if (ensureSpace(cellHeight)) {
      cursorY = height - 50;
      y = cursorY;
    }

    wrappedColumns.forEach((lines, i) => {
      const cellWidth = cellWidths[i];
      page.drawRectangle({
        x,
        y: y - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderWidth: 1,
        color: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
      });

      lines.forEach((line, index) => {
        page.drawText(line, {
          x: x + 5,
          y: y - lineHeight - index * lineHeight,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });

      x += cellWidth;
    });

    return y - cellHeight;
  };
  // ******** Start of PDF writing ************
  // Titles
  cursorY = writeCentered(`Annexe 4`, 16);
  cursorY -= 40;
  cursorY = writeCentered(
    `Formulaire de demande d'autorisation de survol et d'atterrissage`,
  );
  cursorY -= 20;
  cursorY = writeCentered(`Appareils non motorisés`);
  cursorY -= 40;

  // 1. Renseignement de l'organisateur
  cursorY = writeLine(`1. Renseignement de l'organisateur`, 50);
  cursorY -= 5;
  cursorY = writeLine(
    `Nom et prénom : ${formData.identification.lastName} ${formData.identification.firstName}`,
    50,
  );
  cursorY = writeLine(
    `N° du passeport ou CIN pour les nationaux : ${formData.identification.passportNumber}`,
    50,
  );
  cursorY = writeLine(
    `Nationalité : ${formData.identification.nationality}`,
    50,
  );
  cursorY = writeLine(`Coordonnée de contact :`, 50);
  cursorY = writeLine(`Téléphone : ${formData.contact.contactPhone}`, 120);
  cursorY = writeLine(`E-mail : ${formData.contact.contactEmail}`, 120);
  cursorY = writeLine(`Adresse : ${formData.contact.address}`, 120);
  cursorY -= 20;

  // 2. Liste des appareils
  cursorY = writeLine("2. Liste des appareils", 50);
  const appareilCellWidth = [90, 160, 95, 150];
  cursorY = drawTableRow(
    ["Type d'appareil", "Caractéristiques", "Validité assurance", "Couleurs"],
    cursorY,
    appareilCellWidth,
    boldFont,
  );
  if (formData.glider) {
    cursorY = drawTableRow(
      [
        "Parapente",
        `${formData.glider.gliderManufacturer} ${formData.glider.gliderModel} ${formData.glider.gliderSize}`,
        `${formatDate(formData.trip.insuranceValidity)}`,
        `${formData.glider.gliderColors}`,
      ],
      cursorY,
      appareilCellWidth,
      font,
    );
  }

  const renderAppareilRow = (
    manufacturer: string,
    model: string,
    size: string,
    colors: string,
    insuranceDate: Date,
  ) => {
    return drawTableRow(
      [
        "Parapente",
        `${manufacturer} ${model} ${size}`,
        formatDate(insuranceDate),
        colors,
      ],
      cursorY,
      appareilCellWidth,
      font,
    );
  };

  if (participants) {
    participants.forEach(
      ({
        insuranceValidity,
        glider,
      }: {
        insuranceValidity: Date;
        glider: GliderSchemaType;
      }) => {
        cursorY = renderAppareilRow(
          glider.gliderManufacturer,
          glider.gliderModel,
          glider.gliderSize,
          glider.gliderColors,
          insuranceValidity,
        );
      },
    );
  }
  cursorY -= 20;

  // 3 Liste des participants
  cursorY = writeLine("3. Liste des participants", 50);
  const paxCellWidth = [190, 165, 140];
  cursorY = drawTableRow(
    ["Nom et prénom", "N° passeport ou CIN", "Nationalité"],
    cursorY,
    paxCellWidth,
    boldFont,
  );
  cursorY = drawTableRow(
    [
      `${formData.identification.lastName} ${formData.identification.firstName}`,
      `${formData.identification.passportNumber}`,
      `${formData.identification.nationality}`,
    ],
    cursorY,
    paxCellWidth,
    font,
  );

  const renderParticipantRow = (
    fullName: string,
    passportNumber: string,
    nationality: string,
  ) => {
    return drawTableRow(
      [fullName, passportNumber, nationality],
      cursorY,
      paxCellWidth,
      font,
    );
  };

  if (participants) {
    participants.forEach(
      ({
        lastName,
        firstName,
        passportNumber,
        nationality,
      }: {
        lastName: string;
        firstName: string;
        passportNumber: string;
        nationality: string;
      }) => {
        const fullName = `${lastName} ${firstName}`;
        cursorY = renderParticipantRow(fullName, passportNumber, nationality);
      },
    );
  }
  cursorY -= 20;

  // 4. Programme détaillé des vols
  ensureSpace();
  cursorY = writeLine("4. Programme détaillé des vols", 50);

  type ProgrammeEntry = {
    date: string;
    site: string;
    coordinates: { lat: string[]; lon: string[] };
    province: string;
    altitude: string;
    details: string;
  };

  function drawProgrammeRow(entry: ProgrammeEntry, y: number): number {
    const cellWidths = [60, 80, 70, 70, 80, 60, 110];
    const xStart = 30;
    let x = xStart;
    let maxLines = 1;

    const fields = [
      wrapText(entry.date, font, fontSize - 1, cellWidths[0] - 8),
      wrapText(entry.site, font, fontSize - 1, cellWidths[1] - 8),
      entry.coordinates.lat,
      entry.coordinates.lon,
      wrapText(entry.province, font, fontSize - 1, cellWidths[4] - 8),
      wrapText(entry.altitude, font, fontSize - 1, cellWidths[5] - 8),
      wrapText(entry.details, font, fontSize - 1, cellWidths[6] - 8),
    ];

    // Track max lines in any cell for total row height
    fields.forEach((lines) => {
      if (lines.length > maxLines) maxLines = lines.length;
    });
    const cellHeight = 14 * maxLines + 5; // baseline + padding
    if (ensureSpace(cellHeight)) {
      cursorY = height - 50;
      y = cursorY;
    }

    fields.forEach((lines, i) => {
      const cellWidth = cellWidths[i];
      // Draw box
      page.drawRectangle({
        x,
        y: y - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(1, 1, 1),
      });

      // Draw multi-line text inside box
      lines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: x + 4,
          y: y - 14 - lineIndex * 12,
          size: fontSize - 1,
          font,
          color: rgb(0, 0, 0),
        });
      });

      x += cellWidth;
    });

    return y - cellHeight;
  }

  const programmeHeader: ProgrammeEntry = {
    date: "Dates",
    site: "Sites",
    coordinates: { lat: ["Latitudes"], lon: ["Longitudes"] },
    province: "Province",
    altitude: "Altitude Max",
    details: "Détails du site",
  };

  const entries: ProgrammeEntry[] = formData.siteSelection.reduce(
    (acc, site) => {
      const zone = zones.find((z) => z.zoneName === site);
      if (!zone) return acc;

      acc.push({
        date: `Du ${formatDate(formData.trip.startDate)} au ${formatDate(formData.trip.endDate)}`,
        site: site,
        coordinates: {
          lat: zone.coordinates.map((c) => c.lat),
          lon: zone.coordinates.map((c) => c.lon),
        },
        province: zone.region,
        altitude: zone.ceiling,
        details: zone.info,
      });

      return acc;
    },
    [] as ProgrammeEntry[],
  );

  cursorY = drawProgrammeRow(programmeHeader, cursorY);
  entries.forEach((entry) => (cursorY = drawProgrammeRow(entry, cursorY)));
  cursorY -= 20;

  // Footer of PDF: Pagination and "generated with flymorocco.info"
  // Add footer to each page before saving
  pages.forEach((p, index) => {
    const footerFontSize = 10;
    const footerText = `Page ${index + 1} / ${pages.length} – Generated with flymorocco.info`;
    const textWidth = font.widthOfTextAtSize(footerText, footerFontSize);

    p.drawText(footerText, {
      x: (width - textWidth) / 2,
      y: 20,
      size: footerFontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  // **************** PDF Save ******************
  const pdfBytes = await pdfDoc.save();
  // Output to a file in the tmp directory for testing
  const fileName = `annexe4-filled-${Date.now()}.pdf`;
  const filePath = path.join(process.cwd(), "tmp", fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, pdfBytes);

  console.log("✅ Annexe 4 PDF filled:", filePath);

  return {
    fileName,
    filePath,
  };
}
