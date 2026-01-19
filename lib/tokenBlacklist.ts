// In-memory token blacklist
// For production with multiple servers, use Redis or Firestore

interface BlacklistEntry {
  token: string;
  expiresAt: number;
}

const blacklist = new Map<string, BlacklistEntry>();

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of blacklist.entries()) {
    if (now > entry.expiresAt) {
      blacklist.delete(token);
    }
  }
}, 10 * 60 * 1000);

export function blacklistToken(token: string, expiresInMs: number = 3600000) {
  const expiresAt = Date.now() + expiresInMs;
  blacklist.set(token, { token, expiresAt });
}

export function isTokenBlacklisted(token: string): boolean {
  const entry = blacklist.get(token);
  if (!entry) return false;
  
  // Check if expired
  if (Date.now() > entry.expiresAt) {
    blacklist.delete(token);
    return false;
  }
  
  return true;
}

export function removeFromBlacklist(token: string): void {
  blacklist.delete(token);
}

// Get blacklist size (for monitoring)
export function getBlacklistSize(): number {
  return blacklist.size;
}
