import type { TokenManager } from '../types';

/**
 * Default token manager implementation
 * Handles token expiration checks and refresh scheduling
 */
export function createTokenManager(config?: {
  refreshThreshold?: number; // seconds before expiry to trigger refresh
}): TokenManager {
  const refreshThreshold = config?.refreshThreshold ?? 300; // default 5 minutes

  const isExpired = (expiresAt?: number | null): boolean => {
    if (!expiresAt) return false;
    return Date.now() >= expiresAt;
  };

  const shouldRefresh = (
    expiresAt?: number | null,
    threshold?: number,
  ): boolean => {
    if (!expiresAt) return false;
    const thresholdMs = (threshold ?? refreshThreshold) * 1000;
    return Date.now() >= expiresAt - thresholdMs;
  };

  const getTimeUntilExpiry = (expiresAt?: number | null): number => {
    if (!expiresAt) return Infinity;
    const timeLeft = expiresAt - Date.now();
    return Math.max(0, timeLeft);
  };

  const scheduleRefresh = (
    callback: () => void,
    expiresAt?: number | null,
  ): (() => void) => {
    if (!expiresAt) return () => {};

    const timeUntilRefresh = expiresAt - Date.now() - refreshThreshold * 1000;

    if (timeUntilRefresh <= 0) {
      callback();
      return () => {};
    }

    const timeoutId = setTimeout(callback, timeUntilRefresh);
    return () => clearTimeout(timeoutId);
  };

  return {
    isExpired,
    shouldRefresh,
    getTimeUntilExpiry,
    scheduleRefresh,
  };
}
