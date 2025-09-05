/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import eventClient from '@/lib/clients/event';
import client from '@/lib/clients/client';

export enum ApiContext {
    COMMON = 'common',
    EVENT = 'event',
    PUBLIC = 'public',
}

export const useApi = () => {
    const pathName = usePathname();

    const getContext = () =>
        useCallback(() => {
            const prefix = pathName.split('/')[1];

            if (prefix === 'event') {
                return ApiContext.EVENT;
            }

            if (prefix === 'client') {
                return ApiContext.COMMON;
            }

            return ApiContext.PUBLIC;
        }, []);

    const context = useMemo(getContext(), [pathName, getContext]);

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
