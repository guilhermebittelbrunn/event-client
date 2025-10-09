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
        } else {
            redirect(href);
        }
    };

    const redirectReplace = (href: string) => {
        if (isMounted) {
            router.replace(href);
        } else {
            redirect(href);
        }
    };

    const redirectWithDelay = (href: string, delay: number = 1000) => {
        if (isMounted) {
            setTimeout(() => {
                router.push(href);
            }, delay);
        } else {
            setTimeout(() => {
                redirect(href);
            }, delay);
        }
    };

    const conditionalRedirect = (condition: boolean, href: string) => {
        if (isMounted && condition) {
            router.push(href);
        } else {
            redirect(href);
        }
    };

    const goBack = () => {
        if (isMounted) {
            if (window.history.length > 1) {
                router.back(); // Navigate to the previous route
            } else {
                router.push('/'); // Redirect to home if no history exists
            }
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
        } else {
            redirect(window.location.href);
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
