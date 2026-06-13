import { Metadata } from 'next';
import { createMetadata } from '@/shared/seo/metadata';
import { fetchEventBySlug } from '@/shared/actions/event/fetchEvent';
import SlugLayoutClient from './SlugLayoutClient';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Eventos são privados (acesso por token): sempre noindex. O try/catch garante que,
    // mesmo se o backend falhar ao buscar o evento, a página ainda saia com noindex + OG
    // (em vez de derrubar a metadata inteira).
    let eventName: string | undefined;
    let eventImage: string | undefined;
    try {
        const event = await fetchEventBySlug(slug);
        eventName = event?.name;
        eventImage = event?.file?.url;
    } catch {
        // silencioso: cai no fallback abaixo
    }

    return createMetadata({
        title: eventName ?? 'Evento',
        description: `Envie e veja as fotos do evento ${eventName ?? ''} em tempo real no Qinstante.`.trim(),
        image: eventImage,
        // Mantemos title/OG para o preview ao compartilhar o link, mas barramos a indexação.
        noindex: true,
    });
}

export default function EventSlugLayout({ children }: { children: React.ReactNode }) {
    return <SlugLayoutClient>{children}</SlugLayoutClient>;
}
