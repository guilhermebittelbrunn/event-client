'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import {
    Container,
    LoadingScreen,
    Title,
    Paragraph,
    Button,
    Box,
    PopConfirm,
    Helper,
} from '@/shared/components/ui';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { useParams } from 'next/navigation';
import { Fallback } from '@/shared/components/common/Fallback';
import { DownloadOutlined, QrcodeOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { useClientRouter, useQRCode, useRedirect } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';
import Image from 'next/image';
import { useAlert } from '@/shared/hooks';
import { useEffect } from 'react';
import useFindEventById from '@/shared/hooks/useFindEventById';

const HelperSection = () => (
    <Box className="p-2">
        <Title className="text-lg font-semibold text-matte-black dark:text-snow-white mb-3">
            Como usar o QR Code
        </Title>
        <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                1. Faça o download do QR Code no formato desejado
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                2. Imprima e distribua pelos locais do seu evento
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                3. Os convidados escaneiam o QR Code para acessar o evento
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                4. As fotos serão automaticamente organizadas na sua conta
            </p>
        </div>
    </Box>
);

export default function EventAccessesPage() {
    const { id } = useParams() as { id: string };
    const { data: event, isPending } = useFindEventById(id);
    const { currentDomain } = useClientRouter();
    const { redirect } = useRedirect();
    const { successAlert, errorAlert } = useAlert();

    const qrCodeUrl = event?.guestAccess?.url
        ? `${currentDomain}/evento${event.guestAccess.url}`
        : `${currentDomain}/evento/${event?.slug}`;

    const {
        qrCodeDataUrl,
        isLoading: qrCodeLoading,
        downloadQRCode,
    } = useQRCode({
        text: qrCodeUrl,
        width: 256,
        height: 256,
    });

    const handleDownloadPNG = () => {
        const filename = `${event?.name?.toLowerCase().replace(/\s+/g, '-')}-qrcode.png`;
        downloadQRCode(filename);
    };

    const handleGoToQRCodeUrl = () => {
        redirect(qrCodeUrl);
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(qrCodeUrl);
            successAlert('URL copiada para a área de transferência!');
        } catch (err) {
            console.error('Erro ao copiar URL:', err);
        }
    };

    useEffect(() => {
        if (!isPending && !event) {
            errorAlert('Nenhum acesso encontrado para este evento');
            redirect('/painel/eventos');
        }
    }, [isPending, event, errorAlert, redirect]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Acessos"
                breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
            />
            <Container
                title="Acessos"
                subTitle={<Helper message={<HelperSection />} placement="left" />}
                className="mt-2"
            >
                <Fallback condition={!isPending} fallback={<LoadingScreen />}>
                    {event && (
                        <div className="space-y-6">
                            <Box className="p-6 bg-white dark:bg-matte-black rounded-lg shadow-sm">
                                <div className="flex flex-col md:flex-row gap-6 items-center ">
                                    <div className="flex-1 flex flex-col justify-center items-center gap-2 min-w-0">
                                        <Fallback condition={Boolean(event.file && event.file?.url)}>
                                            <ResponsiveImage
                                                src={event.file?.url}
                                                alt="Event image"
                                                width={12}
                                                height={12}
                                            />
                                        </Fallback>
                                        <Title className="text-2xl font-bold  mb-2">{event.name}</Title>

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

                            <Box className="p-6 bg-white dark:bg-matte-black rounded-lg shadow-sm">
                                <div className="space-y-6">
                                    <div className="flex justify-center">
                                        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                                            {qrCodeLoading ? (
                                                <div className="w-60 h-60 bg-gray-100 flex items-center justify-center rounded">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                                                </div>
                                            ) : qrCodeDataUrl ? (
                                                <Image
                                                    src={qrCodeDataUrl}
                                                    alt="QR Code do evento"
                                                    width={240}
                                                    height={240}
                                                    className="rounded"
                                                />
                                            ) : (
                                                <div className="w-60 h-60 bg-gray-100 flex items-center justify-center rounded">
                                                    <QrcodeOutlined className="text-6xl text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            onClick={handleDownloadPNG}
                                            loading={qrCodeLoading}
                                            disabled={!qrCodeDataUrl}
                                        >
                                            Download QR Code
                                        </Button>

                                        <Button
                                            className="px-10"
                                            type="secondary"
                                            icon={<CopyOutlined />}
                                            onClick={handleCopyUrl}
                                        >
                                            Copiar URL
                                        </Button>
                                    </div>

                                    <div className="text-center hover:cursor-pointer hover:opacity-80 transition-opacity duration-300">
                                        <PopConfirm
                                            title="Ir para o link do QRCode?"
                                            placement="bottom"
                                            onConfirm={handleGoToQRCodeUrl}
                                        >
                                            <div className="inline-flex items-center gap-2 p-3 ">
                                                <LinkOutlined className="text-soft-gold dark:text-soft-gold" />
                                                <Paragraph className="text-sm text-soft-gold dark:text-soft-gold font-mono break-all">
                                                    {qrCodeUrl}
                                                </Paragraph>
                                            </div>
                                        </PopConfirm>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    )}
                </Fallback>
            </Container>
        </>
    );
}
