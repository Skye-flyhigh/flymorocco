import * as fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { pdfFile } from "./annexeTypes";

type MinimalAnnexe2 = {
  identification: { firstName: string; lastName: string };
  contact: { contactEmail: string };
};

export default async function generateAnnexe2(
  formData: MinimalAnnexe2,
): Promise<pdfFile> {
  const { firstName, lastName } = formData.identification;
  const fullName = `${firstName} ${lastName}`;
  const todayStr = new Date().toLocaleDateString("fr-FR");

  const templatePath = path.join(
    process.cwd(),
    "public/pdf/Annexe2_Template.pdf",
  );
  const formPdfBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  form.getTextField("dhFormfield-5634315313").setText(fullName);
  form.getTextField("dhFormfield-5634315328").setText(todayStr);

  form.flatten(); // makes fields non-editable

  const fileName = `annexe2-filled-${Date.now()}.pdf`;
  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(process.cwd(), "tmp", fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, pdfBytes);

  console.log("✅ Annexe 2 PDF filled:", filePath);

  return {
    fileName,
    filePath,
  };
}
