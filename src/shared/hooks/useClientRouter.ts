'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useClientRouter() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const push = (href: string) => {
        if (isMounted) {
            router.push(href);
        }
    };

    const replace = (href: string) => {
        if (isMounted) {
            router.replace(href);
        }
    };

    const back = () => {
        if (isMounted) {
            router.back();
        }
    };

    const forward = () => {
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
        ...router,
        push,
        replace,
        back,
        forward,
        refresh,
        isMounted,
    };
}
