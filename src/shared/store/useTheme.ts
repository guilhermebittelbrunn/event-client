'use client';

import { createWithEqualityFn } from 'zustand/traditional';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
}

const initialState: ThemeState = {
    theme: 'light',
    toggleTheme: () => {},
};

export const useTheme = createWithEqualityFn<ThemeState>()(
    persist(
        immer(
            subscribeWithSelector((set) => ({
                ...initialState,

                toggleTheme: () => {
                    set((state) => {
                        const newTheme = state.theme === 'light' ? 'dark' : 'light';
                        state.theme = newTheme;

                        // Side effect: aplica classes no DOM
                        if (typeof window !== 'undefined') {
                            if (newTheme === 'dark') {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark');
                            }
                        }
                    });
                },
            })),
        ),
        {
            name: 'theme-store',
            storage: createJSONStorage(() => localStorage),
            // Aplica tema ao hidratar do localStorage
            onRehydrateStorage: () => (state) => {
                if (typeof window !== 'undefined' && state?.theme) {
                    if (state.theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },
        },
    ),
);

export const useThemeValue = () => useTheme((state) => state.theme);
