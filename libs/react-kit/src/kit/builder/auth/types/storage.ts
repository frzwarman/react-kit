export type AuthStorage<TSession> = {
  get: () => Promise<TSession | null> | TSession | null;
  set: (value: TSession | null) => Promise<void> | void;
  clear: () => Promise<void> | void;
};

export type StorageType = 'local' | 'session' | 'cookie' | 'memory';

export type StorageOptions = {
  key?: string;
  encrypt?: boolean;
  encryptionKey?: string;
  storage?: StorageType;
  cookieOptions?: {
    domain?: string;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
  };
};
