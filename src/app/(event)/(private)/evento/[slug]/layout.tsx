import { Metadata } from 'next';
import { createMetadata } from '@/shared/seo/metadata';
import { fetchEventBySlug } from '@/shared/actions/event/fetchEvent';
import SlugLayoutClient from './SlugLayoutClient';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const event = await fetchEventBySlug(slug);

    return createMetadata({
        title: event?.name,
        description: `Participe do evento ${event?.name ?? 'QInstante'}`,
        image: event?.file?.url,
    });
}

export default function EventSlugLayout({ children }: { children: React.ReactNode }) {
    return <SlugLayoutClient>{children}</SlugLayoutClient>;
}
