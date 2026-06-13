import { createMetadata } from '@/shared/seo/metadata';
import JsonLd from '@/shared/seo/JsonLd';
import { faqSchema, softwareApplicationSchema } from '@/shared/seo/structuredData';
import HomeComponent from './components/Home';
import qinstanteLogo from '@/assets/images/shared/qinstante.png';

export const metadata = createMetadata({
    title: 'QInstante — Fotos colaborativas para casamentos e eventos',
    image: qinstanteLogo.src,
    description: 'QInstante - Transforme seu evento em uma experiência ao vivo',
    path: '/',
});

export default function Home() {
    return (
        <>
            <JsonLd data={[softwareApplicationSchema, faqSchema]} />
            <HomeComponent />
        </>
    );
}
