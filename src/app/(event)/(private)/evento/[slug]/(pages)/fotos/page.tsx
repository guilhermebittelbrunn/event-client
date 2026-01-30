'use client';

import { Title, Box } from '@/shared/components/ui';

import { useState, useMemo } from 'react';

import { useResponsiveLimit } from '@/shared/hooks';
import { MemoryDTO } from '@/shared/types/dtos';
import useInfiniteMemoryQuery from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(hooks)/useInfiniteMemoryQuery';
import useEvent from '@/shared/context/EventContext';
import { PhotoGrid } from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(components)/PhotoGrid';
import { MemoryModal } from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(components)/MemoryModal';
import { PhotoSkeleton } from '@/shared/components/common/PhotoSkeleton';
import { ProgressiveImage } from '@/shared/components/common/ProgressiveImage';

export default function PhotosPage() {
    const { event } = useEvent();

    const [openedMemory, setOpenedMemory] = useState<MemoryDTO | null>(null);
    const [allPhotos, setAllPhotos] = useState<MemoryDTO[]>([]);

    const limitByResolution = useResponsiveLimit({ mobile: 12, lg: 16, xl: 16 });

    const {
        data: infiniteData,
        isLoading: isLoadingMemory,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteMemoryQuery({
        eventId: event?.id,
        limit: limitByResolution,
        order: 'desc',
        orderBy: 'createdAt',
        hidden: false,
    });

    const { memories, total } = useMemo(() => {
        const memories =
            infiniteData?.pages.flatMap(page => page?.data.filter(memory => !memory.hidden) || []) || [];
        const total = infiniteData?.pages[0]?.meta?.total || 0;

        return { memories, total };
    }, [infiniteData]);

    const handleOpenModal = (memory: MemoryDTO, allPhotosArray: MemoryDTO[]) => {
        setOpenedMemory(memory);
        setAllPhotos(allPhotosArray);
    };

    const handleNavigateModal = (memory: MemoryDTO) => {
        setOpenedMemory(memory);
    };

    const handleCloseModal = () => {
        setOpenedMemory(null);
        setAllPhotos([]);
    };

    return (
        <>
            <Box type="secondary" className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex flex-row md:flex-row gap-2">
                    <div className="flex justify-center md:justify-start">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                {event?.file?.url ? (
                                    <ProgressiveImage
                                        src={event.file.url}
                                        alt={`Capa do evento ${event?.name}`}
                                        className="w-full h-full object-cover"
                                        containerClassName="w-full h-full"
                                        showSkeleton={true}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        <svg
                                            className="w-12 h-12"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center md:text-left">
                        <Title className="text-lg text-start font-semibold">{event?.name}</Title>
                        <div className="py-1 text-center w-10/12 bg-soft-gold dark:bg-soft-gold-dark text-white rounded-md font-bold text-sm">
                            {`${total} fotos`}
                        </div>
                    </div>
                </div>

                {isLoadingMemory ? (
                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5 mt-2">
                        {Array.from({ length: limitByResolution }).map((_, index) => (
                            <PhotoSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <PhotoGrid
                        photos={memories}
                        onOpenModal={handleOpenModal}
                        hasMore={hasNextPage || false}
                        onLoadMore={fetchNextPage}
                        isLoading={isFetchingNextPage || isLoadingMemory}
                        boxProps={{ type: 'secondary', className: 'py-4 my-4' }}
                    />
                )}
            </Box>

            {openedMemory && (
                <MemoryModal
                    currentMemory={openedMemory}
                    allPhotos={allPhotos}
                    onNavigate={handleNavigateModal}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
