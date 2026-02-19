import { createMetadata } from '@/shared/seo/metadata';

export const metadata = createMetadata({
    title: 'Entrar',
    description: 'Entrar no Qinstante',
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
