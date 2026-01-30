'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo, useEffect, useState } from 'react';
import usePagination from './usePagination';

export interface QueryParamConfig {
    key: string;
    defaultValue?: string | string[] | number | boolean;
    initialValue?: string | string[] | number | boolean;
    multiple?: boolean;
    type?: 'string' | 'number' | 'boolean';
}

export interface UseQueryParamsProps {
    params?: QueryParamConfig[];
}

const useQueryParams = (props?: UseQueryParamsProps) => {
    const { params = [] } = props || {};
    const searchParams = useSearchParams();
    const router = useRouter();
    const [initialized, setInitialized] = useState(false);
    const { currentPage, currentLimit, currentTerm } = usePagination();

    // Create a map for quick lookup of param configs
    const paramConfigMap = useMemo(() => {
        const map = new Map<string, QueryParamConfig>();
        params.forEach(param => {
            map.set(param.key, param);
        });
        return map;
    }, [params]);

    // Apply initial values on first render if URL params are empty
    useEffect(() => {
        if (initialized) return;

        const hasInitialValues = params.some(p => p.initialValue !== undefined);
        if (!hasInitialValues) {
            setInitialized(true);
            return;
        }

        const updates: Record<string, any> = {};
        let needsUpdate = false;

        params.forEach(param => {
            if (param.initialValue === undefined) return;

            const currentValue = param.multiple ? searchParams.getAll(param.key) : searchParams.get(param.key);

            // Only apply initial value if URL param is null (doesn't exist)
            // Don't apply if it's an empty string - that's intentional
            if (currentValue === null || (Array.isArray(currentValue) && currentValue.length === 0)) {
                updates[param.key] = param.initialValue;
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                newParams.delete(key);
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        newParams.set(key, value.join(','));
                    }
                } else if (value !== '' && value !== null && value !== undefined) {
                    newParams.set(key, String(value));
                }
            });
            router.replace(`?${newParams.toString()}`);
        }

        setInitialized(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized]);

    /**
     * Parse a value based on its type
     */
    const parseValue = useCallback((value: string, type?: 'string' | 'number' | 'boolean') => {
        if (!type || type === 'string') return value;
        if (type === 'number') return Number(value);
        if (type === 'boolean') return value === 'true';
        return value;
    }, []);

    /**
     * Get a single param value from URL
     */
    const getParam = useCallback(
        (key: string) => {
            const config = paramConfigMap.get(key);
            const isMultiple = config?.multiple || false;
            const type = config?.type || 'string';
            const defaultValue = config?.defaultValue;

            if (isMultiple) {
                const value = searchParams.get(key);
                if (!value) {
                    return defaultValue !== undefined ? defaultValue : [];
                }
                // Split by comma and parse each value
                return value.split(',').map(v => parseValue(v.trim(), type));
            } else {
                const value = searchParams.get(key);
                if (value === null) {
                    return defaultValue !== undefined ? defaultValue : undefined;
                }
                return parseValue(value, type);
            }
        },
        [searchParams, paramConfigMap, parseValue],
    );

    /**
     * Set a param value in URL
     */
    const setParam = useCallback(
        (key: string, value: string | string[] | number | boolean | null | undefined) => {
            const params = new URLSearchParams(searchParams.toString());

            // Always delete existing params with this key first
            params.delete(key);

            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    // For arrays, join with comma into a single param
                    if (value.length > 0) {
                        params.set(key, value.join(','));
                    }
                } else {
                    params.set(key, String(value));
                }
            }

            router.push(`?${params.toString()}`);
        },
        [searchParams, router],
    );

    /**
     * Set multiple params at once
     */
    const setParams = useCallback(
        (updates: Record<string, string | string[] | number | boolean | null | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());
            let hasChanges = false;

            Object.entries(updates).forEach(([key, value]) => {
                const currentValue = params.get(key);

                // Delete existing params with this key first
                params.delete(key);

                if (value !== null && value !== undefined && value !== '') {
                    if (Array.isArray(value)) {
                        // For arrays, join with comma into a single param
                        if (value.length > 0) {
                            const newValue = value.join(',');
                            if (currentValue !== newValue) {
                                hasChanges = true;
                            }
                            params.set(key, newValue);
                        } else if (currentValue !== null) {
                            hasChanges = true;
                        }
                    } else {
                        const newValue = String(value);
                        if (currentValue !== newValue) {
                            hasChanges = true;
                        }
                        params.set(key, newValue);
                    }
                } else if (currentValue !== null) {
                    // Removing a parameter that existed
                    hasChanges = true;
                }
            });

            // Only update URL if there are actual changes
            if (hasChanges) {
                router.push(`?${params.toString()}`);
            }
        },
        [searchParams, router],
    );

    /**
     * Remove a param from URL
     */
    const removeParam = useCallback(
        (key: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(key);
            router.push(`?${params.toString()}`);
        },
        [searchParams, router],
    );

    /**
     * Get all configured params as an object
     */
    const getAllParams = useCallback(() => {
        const result: Record<string, any> = {};
        params.forEach(config => {
            result[config.key] = getParam(config.key);
        });
        return result;
    }, [params, getParam]);

    /**
     * Get params formatted for API requests (removes undefined/null values)
     * Returns a memoized object to prevent unnecessary re-renders
     */
    const getApiParams = useCallback(() => {
        const allParams = getAllParams();
        const result: Record<string, any> = {};

        Object.entries(allParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value) && value.length === 0) return;
                result[key] = value;
            }
        });

        return result;
    }, [getAllParams]);

    /**
     * Reset all params to default values
     */
    const resetParams = useCallback(() => {
        const defaults: Record<string, any> = {};
        params.forEach(config => {
            if (config.defaultValue !== undefined) {
                defaults[config.key] = config.defaultValue;
            }
        });
        setParams(defaults);
    }, [params, setParams]);

    // Create a stable dependency key based on actual URL values
    const urlKey = useMemo(() => {
        return params.map(p => `${p.key}=${searchParams.get(p.key) || ''}`).join('&');
    }, [params, searchParams]);

    // Memoize apiParams based on actual URL values to prevent unnecessary re-renders
    const apiParams = useMemo(() => {
        const result: Record<string, any> = {};

        params.forEach(config => {
            const value = config.multiple
                ? (() => {
                      const val = searchParams.get(config.key);
                      if (!val) return config.defaultValue !== undefined ? config.defaultValue : [];
                      return val.split(',').map(v => parseValue(v.trim(), config.type));
                  })()
                : (() => {
                      const val = searchParams.get(config.key);
                      if (val === null)
                          return config.defaultValue !== undefined ? config.defaultValue : undefined;
                      return parseValue(val, config.type);
                  })();

            // Only include non-empty values
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) result[config.key] = value;
                } else {
                    result[config.key] = value;
                }
            }
        });

        return result;
    }, [urlKey, params, parseValue]);

    return {
        getParam,
        setParam,
        setParams,
        removeParam,
        getAllParams,
        getApiParams,
        apiParams,
        resetParams,
        currentPage,
        currentLimit,
        currentTerm,
    };
};

export default useQueryParams;
