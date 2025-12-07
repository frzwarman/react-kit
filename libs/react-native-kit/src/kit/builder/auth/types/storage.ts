export type AuthStorage<TSession> = {
  get: () => Promise<TSession | null> | TSession | null;
  set: (value: TSession | null) => Promise<void> | void;
  clear: () => Promise<void> | void;
};

export type StorageType = 'native' | 'memory';

export type StorageOptions = {
  key?: string;
  encrypt?: boolean;
  encryptionKey?: string;
  storage?: StorageType;
};
