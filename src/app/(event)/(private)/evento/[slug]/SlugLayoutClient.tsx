'use client';

import useEvent from '@/shared/context/EventContext';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function SlugLayoutClient({ children }: { children: React.ReactNode }) {
    const { slug } = useParams() as { slug: string };
    const pathname = usePathname();
    const { event } = useEvent();

    useEffect(() => {
        if (event && slug !== event?.slug) {
            const urlParts = pathname.split('/');
            const slugIndex = urlParts.findIndex(
                (part, index) => index > 0 && urlParts[index - 1] === 'evento' && part === slug,
            );

            if (slugIndex !== -1) {
                urlParts[slugIndex] = event.slug;
                const newPathname = urlParts.join('/');
                window.history.replaceState({}, '', newPathname);
            }
        }
    }, [slug, event, pathname]);

    return <>{children}</>;
}
