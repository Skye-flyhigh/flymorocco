import fs from "fs";
import path from "path";

const tmpDir = path.join(process.cwd(), "tmp");

fs.readdir(tmpDir, (err, files) => {
  if (err) {
    console.error("❌ Error reading tmp directory:", err);
    process.exit(1);
  }

  for (const file of files) {
    const filePath = path.join(tmpDir, file);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete ${file}:`, err);
      } else {
        console.log(`🧹 Deleted: ${file}`);
      }
    });
  }
});
