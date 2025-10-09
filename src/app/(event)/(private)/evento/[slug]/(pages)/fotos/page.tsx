'use client';

import { Title, Box, Paragraph } from '@/shared/components/ui';

import { useState, useMemo } from 'react';

import { useResponsiveLimit } from '@/shared/hooks';
import { MemoryDTO } from '@/shared/types/dtos';
import useInfiniteMemoryQuery from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(hooks)/useInfiniteMemoryQuery';
import useEvent from '@/shared/context/EventContext';
import { PhotoGrid } from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(components)/PhotoGrid';
import { MemoryModal } from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(components)/MemoryModal';
import { formatDate } from '@/shared/utils';
import { PhotoSkeleton } from '@/shared/components/common/PhotoSkeleton';

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
    });

    const { memories, total } = useMemo(() => {
        const memories = infiniteData?.pages.flatMap((page) => page?.data || []) || [];
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
            <Box type="secondary" className="p-4 mb-8 max-w-[800px] mx-auto">
                <Box type="secondary">
                    <div className="flex items-start justify-between">
                        <Box type="secondary" className="flex gap-2 flex-row justify-end items-end ">
                            <Box type="secondary" className="flex gap-2 justify-start items-start ">
                                <Paragraph className="text-md py-0">{event?.name}</Paragraph>
                                <Paragraph className="text-sm py-0">
                                    {formatDate(event?.startAt || new Date())}
                                </Paragraph>
                            </Box>
                            <Box type="secondary" className="flex gap-2 flex-row justify-end items-end ">
                                <Title primary className="text-lg inline">
                                    {total}
                                </Title>
                                <Title className="text-md inline">Fotos</Title>
                            </Box>
                        </Box>
                    </div>
                </Box>

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
