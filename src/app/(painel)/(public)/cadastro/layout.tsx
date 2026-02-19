import { createMetadata } from '@/shared/seo/metadata';

export const metadata = createMetadata({
    title: 'Cadastrar',
    description: 'Cadastrar no Qinstante',
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
