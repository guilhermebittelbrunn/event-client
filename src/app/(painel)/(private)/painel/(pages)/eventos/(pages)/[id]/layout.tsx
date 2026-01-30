'use client';

import { Box, Button, Container, LoadingScreen, Title } from '@/shared/components/ui';
import useFindEventById from '@/shared/hooks/useFindEventById';
import { useParams } from 'next/navigation';
import { EventPageProvider } from '../../(store)/useEventPage';
import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useClientRouter } from '@/shared/hooks';
import { EventStatusEnum } from '@/shared/types/dtos';

const FORBIDDEN_PAGES_TO_ACCESS_WITH_PENDING_PAYMENT = ['/detalhes', '/apresentar', '/acessos'];

export default function EventLayout({ children }: { children: React.ReactNode }) {
    const { id } = useParams() as { id: string };
    const { data: event, isPending } = useFindEventById(id);
    const router = useClientRouter();

    if (isPending) {
        return <LoadingScreen />;
    }

    if (!event) {
        return (
            <>
                <PageBreadcrumb
                    pageTitle="Evento não encontrado"
                    breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
                />
                <Container>
                    <Box className="flex flex-col items-center justify-center py-12 space-y-6">
                        <CloseCircleOutlined className="text-6xl text-red-500" />
                        <Title className="text-xl font-bold text-neutral-800 dark:text-white">
                            Evento não encontrado
                        </Title>
                        <Button type="secondary" onClick={() => router.push('/painel/eventos')}>
                            Voltar para Eventos
                        </Button>
                    </Box>
                </Container>
            </>
        );
    }

    if (event.status === EventStatusEnum.PENDING_PAYMENT) {
        let isAccessDenied = false;

        FORBIDDEN_PAGES_TO_ACCESS_WITH_PENDING_PAYMENT.forEach(page => {
            if (window.location.pathname.includes(page)) {
                isAccessDenied = true;
            }
        });

        if (isAccessDenied) {
            window.location.href = `/painel/eventos/${event.id}/confirmar-pagamento`;
        }
    }

    return <EventPageProvider event={event}>{children}</EventPageProvider>;
}
