import { cleanupOldTmpFiles } from "./cleanupTmpFile";

/**
 * Scheduled cleanup to run periodically
 * Call this from a cron job or server startup
 */
export async function scheduledTmpCleanup() {
  console.log("🕒 Starting scheduled tmp cleanup...");

  // Clean files older than 1 hour (in case of server crashes)
  await cleanupOldTmpFiles(60);

  console.log("✅ Scheduled tmp cleanup completed");
}

// For server startup - clean any old files on boot
export async function startupCleanup() {
  console.log("🚀 Server startup - cleaning old tmp files...");
  await cleanupOldTmpFiles(0); // Clean ALL files on startup
  console.log("✅ Startup cleanup completed");
}
