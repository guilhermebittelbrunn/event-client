'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { LoadingScreen } from '@/shared/components/ui';
import { Slideshow } from './(components)/Slideshow';
import useInfiniteMemoryQuery from '../detalhes/(hooks)/useInfiniteMemoryQuery';

export default function SlideshowPage() {
    const { id } = useParams() as { id: string };
    const searchParams = useSearchParams();
    const initialMemoryId = searchParams.get('initialMemoryId');

    const {
        data: infiniteData,
        isLoading,
        isError,
    } = useInfiniteMemoryQuery({
        eventId: id,
        limit: 1000,
        order: 'desc',
        orderBy: 'createdAt',
        hidden: false,
    });

    const photos = useMemo(() => infiniteData?.pages.flatMap(page => page?.data || []) || [], [infiniteData]);

    const initialIndex = useMemo(() => {
        if (!initialMemoryId || photos.length === 0) {
            return 0;
        }
        const index = photos.findIndex(photo => photo.id === initialMemoryId);
        return index >= 0 ? index : 0;
    }, [initialMemoryId, photos]);

    const handleClose = () => {
        window.close();
        // se window.close() não funcionar (alguns navegadores bloqueiam), redirecionar
        if (window.opener) {
            window.opener.focus();
        } else {
            window.location.href = `/painel/eventos/${id}/detalhes`;
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
                <LoadingScreen />
            </div>
        );
    }

    if (isError || photos.length === 0) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-2xl mb-4">
                        {isError ? 'Erro ao carregar fotos' : 'Nenhuma foto disponível'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-soft-gold text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        );
    }

    return <Slideshow photos={photos} initialIndex={initialIndex} onClose={handleClose} />;
}
