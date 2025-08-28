'use client';

import { useState, useEffect } from 'react';

export default function useLocalStorage<T>(
    key: string,
    defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        const storedValue = localStorage.getItem(key);
        return storedValue === null ? defaultValue : JSON.parse(storedValue);
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const listener = (e: StorageEvent) => {
            if (e.storageArea === localStorage && e.key === key) {
                setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
            }
        };
        window.addEventListener('storage', listener);

        return () => {
            window.removeEventListener('storage', listener);
        };
    }, [key, defaultValue]);

    const setValueInLocalStorage: React.Dispatch<React.SetStateAction<T>> = (newValue) => {
        setValue((currentValue) => {
            const result = newValue instanceof Function ? newValue(currentValue) : newValue;
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(result));
            }
            return result;
        });
    };

    return [value, setValueInLocalStorage];
}
