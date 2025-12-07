import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthStorage } from '../../types';
import { createMemoryStorage } from './memory';
import { SimpleEncryption } from './encryption';

export type NativeStorageOptions<T> = {
  key: string;
  serialize?: (value: T | null) => Promise<string | null> | string | null;
  deserialize?: (value: string | null) => Promise<T | null> | T | null;
  encrypt?: boolean;
  encryptionKey?: string;
};

/**
 * Creates AsyncStorage adapter for React Native
 * Uses @react-native-async-storage/async-storage
 */
export const createNativeStorage = <T>(
  options: NativeStorageOptions<T>,
): AuthStorage<T> => {
  const fallback = createMemoryStorage<T>();
  const encryption =
    options.encrypt && options.encryptionKey
      ? new SimpleEncryption(options.encryptionKey)
      : null;

  const defaultSerialize = async (value: T | null): Promise<string | null> => {
    if (value === null) return null;
    const json = JSON.stringify(value);
    return encryption ? await encryption.encrypt(json) : json;
  };

  const defaultDeserialize = async (
    value: string | null,
  ): Promise<T | null> => {
    if (!value) return null;
    try {
      const decrypted = encryption ? await encryption.decrypt(value) : value;
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  };

  const serialize = options.serialize
    ? async (value: T | null) => {
        const result = await options.serialize?.(value);
        return result ?? null;
      }
    : defaultSerialize;

  const deserialize = options.deserialize
    ? async (value: string | null) => {
        const result = await options.deserialize?.(value);
        return result ?? null;
      }
    : defaultDeserialize;

  return {
    get: async () => {
      try {
        const raw = await AsyncStorage.getItem(options.key);
        const value = await deserialize(raw);
        fallback.set(value);
        return value;
      } catch (error) {
        console.warn('[auth2][storage] Failed to read from AsyncStorage', error);
        return fallback.get();
      }
    },
    set: async (value) => {
      try {
        const serialized = await serialize(value);
        if (serialized === null) {
          await AsyncStorage.removeItem(options.key);
        } else {
          await AsyncStorage.setItem(options.key, serialized);
        }
        fallback.set(value);
      } catch (error) {
        console.warn('[auth2][storage] Failed to write to AsyncStorage', error);
        fallback.set(value);
      }
    },
    clear: async () => {
      try {
        await AsyncStorage.removeItem(options.key);
      } catch (error) {
        console.warn('[auth2][storage] Failed to clear AsyncStorage', error);
      } finally {
        fallback.clear();
      }
    },
  };
};
