export type TokenManager = {
  isExpired: (expiresAt?: number | null) => boolean;
  shouldRefresh: (expiresAt?: number | null, threshold?: number) => boolean;
  getTimeUntilExpiry: (expiresAt?: number | null) => number;
  scheduleRefresh?: (
    callback: () => void,
    expiresAt?: number | null,
  ) => () => void;
};
