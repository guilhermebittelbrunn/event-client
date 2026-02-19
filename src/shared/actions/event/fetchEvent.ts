'use server';

import { unstable_cache } from 'next/cache';
import eventClient from '@/lib/clients/event';
import { EventDTO } from '@/shared/types/dtos';

const getCachedEvent = unstable_cache(
    async (slug: string): Promise<EventDTO> => {
        return await eventClient.eventService.findBySlug(slug);
    },
    ['event-by-slug'],
    {
        revalidate: 60 * 60 * 1, // 1 hour
    },
);

export async function fetchEventBySlug(slug: string): Promise<EventDTO> {
    return getCachedEvent(slug);
}
