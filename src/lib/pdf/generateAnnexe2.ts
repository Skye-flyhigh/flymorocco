import * as fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { FormData } from "../validation/CaaFormdata";

export default async function generateAnnexe2(formData: FormData) {
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

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(
    process.cwd(),
    "tmp",
    `annexe2-filled-${Date.now()}.pdf`,
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pdfBytes);

  console.log("✅ Annexe 2 PDF filled:", outputPath);
}
