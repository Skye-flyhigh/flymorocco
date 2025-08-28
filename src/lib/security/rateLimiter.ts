// Rate limiter with exponential backoff for vault authentication
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

// In-memory storage for serverless functions
// Note: This resets on cold starts, which is actually good for security
const attemptStore = new Map<string, AttemptRecord>();

// Clean up old records lazily (on each request)
function cleanupOldRecords(): void {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [ip, record] of attemptStore.entries()) {
    if (now - record.lastAttempt > oneHour) {
      attemptStore.delete(ip);
    }
  }
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  waitTime?: number;
  message?: string;
} {
  // Clean up expired records on each request (serverless-friendly)
  cleanupOldRecords();

  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    // First attempt - always allowed
    return { allowed: true };
  }

  // Calculate exponential backoff: 30s, 2min, 5min, 15min, 1hr
  const backoffTimes = [
    30 * 1000, // 30 seconds
    2 * 60 * 1000, // 2 minutes
    5 * 60 * 1000, // 5 minutes
    15 * 60 * 1000, // 15 minutes
    60 * 60 * 1000, // 1 hour
  ];

  const attemptIndex = Math.min(record.count - 1, backoffTimes.length - 1);
  const requiredWaitTime = backoffTimes[attemptIndex];
  const timeSinceLastAttempt = now - record.lastAttempt;

  if (timeSinceLastAttempt < requiredWaitTime) {
    const remainingWaitTime = requiredWaitTime - timeSinceLastAttempt;
    const waitMinutes = Math.ceil(remainingWaitTime / (60 * 1000));

    return {
      allowed: false,
      waitTime: remainingWaitTime,
      message: `Too many failed attempts. Try again in ${waitMinutes} minute${waitMinutes > 1 ? "s" : ""}.`,
    };
  }

  // Wait time has passed, allow the attempt
  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    attemptStore.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  } else {
    attemptStore.set(ip, {
      ...record,
      count: record.count + 1,
      lastAttempt: now,
    });
  }
}

export function recordSuccessfulAttempt(ip: string): void {
  // Clear the record on successful login
  attemptStore.delete(ip);
}

export function getRateLimitStatus(ip: string): {
  attempts: number;
  nextAllowedTime?: number;
} {
  const record = attemptStore.get(ip);

  if (!record) {
    return { attempts: 0 };
  }

  const backoffTimes = [
    30 * 1000,
    2 * 60 * 1000,
    5 * 60 * 1000,
    15 * 60 * 1000,
    60 * 60 * 1000,
  ];
  const attemptIndex = Math.min(record.count - 1, backoffTimes.length - 1);
  const requiredWaitTime = backoffTimes[attemptIndex];
  const nextAllowedTime = record.lastAttempt + requiredWaitTime;

  return {
    attempts: record.count,
    nextAllowedTime,
  };
}
