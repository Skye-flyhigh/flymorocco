import fs from "fs/promises";
import path from "path";

const tmpDir = path.join(process.cwd(), "tmp");

async function cleanTmpDirectory() {
  try {
    // Check if tmp directory exists
    try {
      await fs.access(tmpDir);
    } catch {
      console.log("📁 No tmp directory found, nothing to clean");
      return;
    }

    const files = await fs.readdir(tmpDir);
    
    if (files.length === 0) {
      console.log("✨ tmp directory is already clean");
      return;
    }

    console.log(`🧹 Cleaning ${files.length} file(s) from tmp directory...`);

    const deletePromises = files.map(async (file) => {
      const filePath = path.join(tmpDir, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          await fs.unlink(filePath);
          console.log(`🗑️  Deleted: ${file}`);
        } else if (stats.isDirectory()) {
          await fs.rmdir(filePath, { recursive: true });
          console.log(`📂 Deleted directory: ${file}`);
        }
      } catch (err) {
        console.error(`❌ Failed to delete ${file}:`, err);
      }
    });

    await Promise.all(deletePromises);
    console.log("✅ tmp directory cleanup completed");
    
  } catch (err) {
    console.error("❌ Error during tmp cleanup:", err);
    process.exit(1);
  }
}

// Run the cleanup
cleanTmpDirectory();
