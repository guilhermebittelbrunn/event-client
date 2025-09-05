'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState, useEffect } from 'react';
import eventClient from '@/lib/clients/event';
import client from '@/lib/clients/client';

export enum ApiContext {
    COMMON = 'common',
    EVENT = 'event',
    PUBLIC = 'public',
}

export const useApi = () => {
    const pathName = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getContext = useCallback(() => {
        if (!isClient) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                const prefix = currentPath.split('/')[1];

                if (prefix === 'evento') {
                    return ApiContext.EVENT;
                }
                if (prefix === 'painel') {
                    return ApiContext.COMMON;
                }
            }
            return ApiContext.PUBLIC;
        }

        if (!pathName) {
            return ApiContext.PUBLIC;
        }

        const prefix = pathName.split('/')[1];

        if (prefix === 'evento') {
            return ApiContext.EVENT;
        }

        if (prefix === 'painel') {
            return ApiContext.COMMON;
        }

        return ApiContext.PUBLIC;
    }, [isClient, pathName]);

    const context = useMemo(() => getContext(), [getContext]);

    const clientByContext = useMemo(() => {
        if (context === ApiContext.EVENT) {
            return eventClient;
        }

        if (context === ApiContext.COMMON) {
            return client;
        }

        return client;
    }, [context]);

    return { client: clientByContext, context };
};

export default useApi;
