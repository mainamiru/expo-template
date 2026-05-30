import { AsyncStorage } from "expo-sqlite/kv-store";
import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | null = null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [value, setValue] = useState<T | null>(initialValue);

  const parseValue = (value: any) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  // Get item from local storage
  const getItemAsync = useCallback(async () => {
    try {
      setError(null);
      const value = await AsyncStorage.getItem(key);
      if (value) setValue(parseValue(value));
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setItemAsync = useCallback(
    async (value: T) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        setValue(value);
      } catch (error) {
        setError(error as Error);
      }
    },
    [key],
  );

  const deleteItemAsync = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      setError(error as Error);
    }
  }, [key, initialValue]);

  // Get item from local storage on mount
  useEffect(() => {
    getItemAsync();
  }, [key, getItemAsync]);

  return {
    error,
    value,
    isLoading,
    getItemAsync,
    setItemAsync,
    deleteItemAsync,
  };
}
