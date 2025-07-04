import fs from "fs/promises";

/**
 * Safely delete a temporary file after use
 */
export async function cleanupTmpFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️ Cleaned up tmp file: ${filePath}`);
  } catch (error) {
    // File might already be deleted or not exist - not critical
    console.warn(`⚠️ Could not cleanup tmp file ${filePath}:`, error);
  }
}

/**
 * Delete all files older than specified minutes in tmp directory
 */
export async function cleanupOldTmpFiles(
  maxAgeMinutes: number = 30,
): Promise<void> {
  try {
    const tmpDir = "./tmp";
    const files = await fs.readdir(tmpDir);
    const now = Date.now();

    const cleanupPromises = files.map(async (file) => {
      const filePath = `${tmpDir}/${file}`;
      try {
        const stats = await fs.stat(filePath);
        const ageMinutes = (now - stats.mtime.getTime()) / (1000 * 60);

        if (ageMinutes > maxAgeMinutes) {
          await fs.unlink(filePath);
          console.log(
            `🗑️ Cleaned up old tmp file: ${file} (${Math.round(ageMinutes)}min old)`,
          );
        }
      } catch (err) {
        console.warn(`⚠️ Error checking tmp file ${file}:`, err);
      }
    });

    await Promise.all(cleanupPromises);
  } catch (error) {
    console.warn("⚠️ Error during old tmp file cleanup:", error);
  }
}
