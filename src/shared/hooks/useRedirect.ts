'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRedirect() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const redirect = (href: string) => {
        if (isMounted) {
            router.push(href);
        }
    };

    const redirectReplace = (href: string) => {
        if (isMounted) {
            router.replace(href);
        }
    };

    const redirectWithDelay = (href: string, delay: number = 1000) => {
        if (isMounted) {
            setTimeout(() => {
                router.push(href);
            }, delay);
        }
    };

    const conditionalRedirect = (condition: boolean, href: string) => {
        if (isMounted && condition) {
            router.push(href);
        }
    };

    const goBack = () => {
        if (isMounted) {
            router.back();
        }
    };

    const goForward = () => {
        if (isMounted) {
            router.forward();
        }
    };

    const refresh = () => {
        if (isMounted) {
            router.refresh();
        }
    };

    return {
        redirect,
        redirectReplace,
        redirectWithDelay,
        conditionalRedirect,
        goBack,
        goForward,
        refresh,
        isMounted,
    };
}
