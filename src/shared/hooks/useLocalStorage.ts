'use client';

import { useState, useEffect } from 'react';

function safeJsonParse<T>(value: string | null, defaultValue: T): T {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (error) {
        console.warn(`Failed to parse localStorage value for key: ${value}`, error);

        if (typeof defaultValue === 'string') {
            return value as T;
        }
        if (typeof defaultValue === 'number') {
            const num = Number(value);
            return isNaN(num) ? defaultValue : (num as T);
        }
        if (typeof defaultValue === 'boolean') {
            if (value === 'true') return true as T;
            if (value === 'false') return false as T;
            return defaultValue;
        }

        if (typeof value === typeof defaultValue) {
            return value as T;
        }

        return defaultValue;
    }
}

function safeJsonStringify<T>(value: T): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        console.warn('Failed to stringify value for localStorage:', error);

        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        try {
            return JSON.stringify(value, (key, val) => {
                if (val === undefined) return null;
                if (typeof val === 'function') return '[Function]';
                if (val instanceof Date) return val.toISOString();
                return val;
            });
        } catch {
            return String(value);
        }
    }
}

export default function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        try {
            const storedValue = localStorage.getItem(key);
            return safeJsonParse(storedValue, defaultValue);
        } catch (error) {
            console.warn(`Error reading from localStorage for key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const listener = (e: StorageEvent) => {
            if (e.storageArea === localStorage && e.key === key) {
                try {
                    const newValue = safeJsonParse(e.newValue, defaultValue);
                    setValue(newValue);
                } catch (error) {
                    console.warn(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', listener);

        return () => {
            window.removeEventListener('storage', listener);
        };
    }, [key, defaultValue]);

    const setValueInLocalStorage: React.Dispatch<React.SetStateAction<T>> = newValue => {
        setValue(currentValue => {
            const result = newValue instanceof Function ? newValue(currentValue) : newValue;

            if (typeof window !== 'undefined') {
                try {
                    const serializedValue = safeJsonStringify(result);
                    localStorage.setItem(key, serializedValue);
                } catch (error) {
                    console.error(`Error writing to localStorage for key "${key}":`, error);

                    try {
                        localStorage.setItem(key, String(result));
                    } catch (fallbackError) {
                        console.error(
                            `Fallback localStorage write also failed for key "${key}":`,
                            fallbackError,
                        );
                    }
                }
            }

            return result;
        });
    };

    return [value, setValueInLocalStorage];
}
