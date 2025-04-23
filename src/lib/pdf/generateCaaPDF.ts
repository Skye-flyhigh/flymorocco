import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { FormData } from "../validation/CaaFormdata";

export default async function generateCaaPDF(formData: FormData) {
  // Extract relevant fields
  const firstName = formData?.identification?.firstName || "";
  const lastName = formData?.identification?.lastName || "";
  const siteSelection = formData?.siteSelection || [];

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const fontSize = 12;
  let cursorY = height - 50;

  page.drawText(`Autorisation de Vol - CAA Maroc`, {
    x: 50,
    y: cursorY,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  cursorY -= 40;
  page.drawText(`Nom: ${lastName}`, {
    x: 50,
    y: cursorY,
    size: fontSize,
    font,
  });
  cursorY -= 20;
  page.drawText(`Prénom(s): ${firstName}`, {
    x: 50,
    y: cursorY,
    size: fontSize,
    font,
  });

  if (siteSelection && siteSelection.length > 0) {
    cursorY -= 40;
    page.drawText(`Sites sélectionnés:`, {
      x: 50,
      y: cursorY,
      size: fontSize,
      font,
    });
    siteSelection.forEach((site: string, index: number) => {
      cursorY -= 20;
      page.drawText(`- ${site}`, { x: 60, y: cursorY, size: fontSize, font });
    });
  }

  const pdfBytes = await pdfDoc.save();
  // Output to a file in the tmp directory for testing
  const outputPath = path.join(
    process.cwd(),
    "tmp",
    `caa-form-${Date.now()}.pdf`,
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pdfBytes);

  console.log("📄 PDF generated at:", outputPath);
}
