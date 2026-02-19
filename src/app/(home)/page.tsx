import { createMetadata } from '@/shared/seo/metadata';
import HomeComponent from './components/Home';
import qinstanteLogo from '@/assets/images/shared/qinstante.png';

export const metadata = createMetadata({
    title: 'QInstante',
    description: 'QInstante - Transforme seu evento em uma experiência ao vivo',
    image: qinstanteLogo.src,
});

export default function Home() {
    return <HomeComponent />;
}
