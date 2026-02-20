'use server';

import { unstable_cache } from 'next/cache';
import eventClient from '@/lib/clients/event';
import { EventDTO } from '@/shared/types/dtos';

const getCachedEvent = (slug: string) => {
    return unstable_cache(
        async (slug: string): Promise<EventDTO> => {
            return await eventClient.eventService.findBySlug(slug);
        },
        [`event-by-slug-${slug}`],
        {
            revalidate: 60 * 60 * 1, // 1 hour
        },
    )(slug);
};

export async function fetchEventBySlug(slug: string): Promise<EventDTO> {
    return await getCachedEvent(slug);
}
