'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircleOutlined } from '@ant-design/icons';

import { Title, Container, Box, Button, Paragraph, Loading } from '@/shared/components/ui';
import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { formatDate } from '@/shared/utils/helpers/date';
import { formatPrice } from '@/shared/utils/helpers/formatNumber';
import { EventDTO, EventStatusEnum } from '@/shared/types/dtos';
import useAlert from '@/shared/hooks/useAlert';
import useFindPendingPaymentEvent from './(hooks)/useFindPendingPaymentEvent';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEventPage } from '../../../(store)/useEventPage';

export default function ConfirmPaymentPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { errorAlert } = useAlert();

    const { event: defaultEvent } = useEventPage();
    const { data: pendingEvent, isLoading } = useFindPendingPaymentEvent(id);

    const event = (pendingEvent || defaultEvent) as EventDTO;
    const isPendingPayment = event?.status === EventStatusEnum.PENDING_PAYMENT;

    const handlePay = async () => {
        if (!id) {
            errorAlert('ID do evento não encontrado.');
            return;
        }

        if (event?.payment?.paymentUrl) {
            window.location.href = event.payment?.paymentUrl;
        }
    };

    useEffect(() => {
        if (event?.status && event.status === EventStatusEnum.PUBLISHED) {
            setTimeout(() => {
                router.push(`/painel/eventos/${id}/acessos`);
            }, 2000);
        }
    }, [event?.status, router, id]);

    if (event?.status === EventStatusEnum.PUBLISHED) {
        return (
            <>
                <PageBreadcrumb
                    pageTitle="Pagamento Confirmado"
                    breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
                />
                <Container>
                    <Box className="flex flex-col items-center justify-center py-12 space-y-6">
                        <CheckCircleOutlined className="text-6xl text-green-500" />
                        <Title className="text-2xl font-bold text-neutral-800 dark:text-white text-center">
                            Pagamento Confirmado!
                        </Title>
                        <Paragraph className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                            Seu pagamento foi confirmado com sucesso. O evento está ativo e pronto para uso.
                        </Paragraph>
                        <Button type="primary" onClick={() => router.push(`/painel/eventos/${id}/acessos`)}>
                            Ver Acessos do Evento
                        </Button>
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle="Confirmar Pagamento"
                breadcrumbItems={[
                    { label: 'Eventos', href: '/painel/eventos' },
                    { label: event.name, href: `/painel/eventos/${id}/editar` },
                ]}
            />
            <Container title="Confirmar Pagamento do Evento">
                <Box className="space-y-6">
                    <Box className="space-y-4">
                        <Box className=" bg-white  dark:bg-matte-black rounded-lg">
                            <div className="flex flex-col md:flex-row gap-6 items-center ">
                                <div className="flex-1 flex flex-col justify-center items-center gap-2 min-w-0">
                                    {event.file?.url && (
                                        <div className="w-24 h-24">
                                            <ResponsiveImage
                                                src={event.file?.url}
                                                alt={`imagem do evento ${event.name}`}
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                    )}
                                    <Title className="text-2xl font-bold">{event.name}</Title>

                                    {event.description && (
                                        <Paragraph className="text-gray-600 dark:text-gray-400 mb-3">
                                            {event.description}
                                        </Paragraph>
                                    )}

                                    <div className="flex flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Data:</span>
                                            <span>{formatDate(event.startAt)}</span>
                                        </div>
                                        {event.endAt && event.endAt !== event.startAt && (
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">até:</span>
                                                <span>{formatDate(event.endAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Box>

                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <Title className="text-md font-semibold text-gray-700 dark:text-gray-300">
                                Valor do Pagamento
                            </Title>
                            <Paragraph className="text-xl font-bold text-soft-gold dark:text-soft-gold-dark ">
                                {formatPrice((event.payment?.amount ?? 0) / 100)}
                            </Paragraph>

                            {isPendingPayment && (
                                <div className=" border-gray-200 dark:border-gray-700 pt-2">
                                    <Box className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Loading size="large" />
                                        <Paragraph className="text-sm">
                                            Aguardando confirmação do pagamento...
                                        </Paragraph>
                                    </Box>
                                </div>
                            )}
                        </div>
                    </Box>

                    <Box className="flex flex-col  pt-4 border-t border-gray-200 dark:border-gray-700 items-center">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handlePay}
                            loading={isLoading}
                            disabled={!isPendingPayment}
                            className="w-2/3 md:w-1/2"
                        >
                            <Box type="primary" className="flex flex-row items-center justify-center gap-2">
                                <span>Pagar</span>
                                <FaExternalLinkAlt />
                            </Box>
                        </Button>
                        <Paragraph className="text-xs text-center text-gray-500 dark:text-gray-500">
                            Você será redirecionado para a página segura do Stripe para concluir o pagamento.
                        </Paragraph>
                        \
                    </Box>
                </Box>
            </Container>
        </>
    );
}
