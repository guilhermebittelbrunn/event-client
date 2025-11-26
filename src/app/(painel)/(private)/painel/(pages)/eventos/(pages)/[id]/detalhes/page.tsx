'use client';

import { Title, LoadingScreen, Container, Box, Modal, Paragraph, Loading } from '@/shared/components/ui';

import { useState, useMemo } from 'react';

import useFindEventById from '@/shared/hooks/useFindEventById';
import { useParams } from 'next/navigation';
import { useResponsiveLimit } from '@/shared/hooks';
import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { EventHeader } from './(components)/EventHeader';
import { ActionBar } from './(components)/ActionBar';
import { PhotoGrid } from './(components)/PhotoGrid';
import { MemoryDTO } from '@/shared/types/dtos';
import { useMemoryCrud } from '@/shared/hooks/useMemoryCrud';
import { useQueryClient } from '@tanstack/react-query';
import { MemoryModal } from './(components)/MemoryModal';
import useInfiniteMemoryQuery, { INFINITE_MEMORY_QUERY_KEY } from './(hooks)/useInfiniteMemoryQuery';

const LoadingContainer = () => {
    return (
        <div className="flex w-full justify-center py-8">
            <Loading />
        </div>
    );
};

export default function DetailsPage() {
    const { id } = useParams() as { id: string };
    const queryClient = useQueryClient();

    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [openedMemory, setOpenedMemory] = useState<MemoryDTO | null>(null);
    const [allPhotos, setAllPhotos] = useState<MemoryDTO[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: event, isPending } = useFindEventById(id);
    const { deleteBulkMemoryMutation, downloadMemoryMutation, changeBulkMemoryVisibilityMutation } =
        useMemoryCrud();

    const limitByResolution = useResponsiveLimit({ mobile: 9, lg: 12, xl: 15 });

    const {
        data: infiniteData,
        isLoading: isLoadingMemory,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteMemoryQuery({
        eventId: id,
        limit: limitByResolution,
        order: 'desc',
        orderBy: 'createdAt',
    });

    const { memories, total } = useMemo(() => {
        const memories = infiniteData?.pages.flatMap((page) => page?.data || []) || [];
        const total = infiniteData?.pages[0]?.meta?.total || 0;

        return { memories, total };
    }, [infiniteData]);

    const selectedPhotosToAction = useMemo(() => {
        if (openedMemory) {
            return [openedMemory.id];
        }
        return selectedPhotos;
    }, [selectedPhotos, openedMemory]);

    const handleSelectPhoto = (photoId: string) => {
        if (isSelectMode) {
            setSelectedPhotos((prev) =>
                prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId],
            );
        }
    };

    const handleToggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        setSelectedPhotos([]);
    };

    const handleDeletePhotos = async () => {
        await deleteBulkMemoryMutation.mutateAsync(selectedPhotosToAction);
        queryClient.invalidateQueries({ queryKey: [INFINITE_MEMORY_QUERY_KEY] });
        setSelectedPhotos([]);
        setShowDeleteModal(false);
        setOpenedMemory(null);
        setIsSelectMode(false);
    };

    const handleDownloadPhotos = async () => {
        await downloadMemoryMutation.mutateAsync({ memoryIds: selectedPhotosToAction });
        setSelectedPhotos([]);
        setIsSelectMode(false);
    };

    const handleChangeVisibility = async (status: boolean) => {
        const payload = selectedPhotosToAction.map((id) => ({ id, hidden: !status }));
        await changeBulkMemoryVisibilityMutation.mutateAsync({ memories: payload });

        queryClient.invalidateQueries({ queryKey: [INFINITE_MEMORY_QUERY_KEY] });
        setSelectedPhotos([]);
        setIsSelectMode(false);
        setOpenedMemory(null);
    };

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

    const handleStartSlideshow = () => {
        const initialMemoryId = selectedPhotosToAction[0];
        const url = `/painel/eventos/${id}/apresentar${initialMemoryId ? `?initialMemoryId=${initialMemoryId}` : ''}`;
        window.open(url, '_blank', 'fullscreen=yes');
    };

    if (isPending) {
        return <LoadingScreen />;
    }

    if (!event) {
        return (
            <Container>
                <Box className="flex flex-col items-center justify-center py-12">
                    <Title className="text-xl font-bold text-neutral-800 dark:text-white">
                        Evento não encontrado
                    </Title>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle="Fotos"
                breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
            />
            <Container>
                <EventHeader event={event} photoCount={total} />

                {downloadMemoryMutation.isPending ? (
                    <LoadingContainer />
                ) : (
                    <>
                        <ActionBar
                            isSelectMode={isSelectMode}
                            selectedCount={selectedPhotos.length}
                            onToggleSelect={handleToggleSelectMode}
                            onDelete={() => setShowDeleteModal(true)}
                            onDownload={handleDownloadPhotos}
                            onChangeVisibility={handleChangeVisibility}
                            onStartSlideshow={handleStartSlideshow}
                        />
                        <PhotoGrid
                            photos={memories}
                            selectedPhotos={selectedPhotos}
                            isSelectMode={isSelectMode}
                            onSelectPhoto={handleSelectPhoto}
                            onOpenModal={handleOpenModal}
                            hasMore={hasNextPage || false}
                            onLoadMore={fetchNextPage}
                            isLoading={isFetchingNextPage || isLoadingMemory}
                        />
                    </>
                )}
            </Container>

            {openedMemory && (
                <MemoryModal
                    currentMemory={openedMemory}
                    allPhotos={allPhotos}
                    onNavigate={handleNavigateModal}
                    onClose={handleCloseModal}
                    toolBar={
                        <ActionBar
                            single
                            hidden={openedMemory.hidden}
                            isSelectMode={isSelectMode}
                            selectedCount={selectedPhotos.length}
                            onToggleSelect={handleToggleSelectMode}
                            onDelete={() => setShowDeleteModal(true)}
                            onDownload={handleDownloadPhotos}
                            onChangeVisibility={handleChangeVisibility}
                            onStartSlideshow={handleStartSlideshow}
                        />
                    }
                />
            )}

            {showDeleteModal && (
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeletePhotos}
                    cancelText="Cancelar"
                    title="Deletar fotos"
                    type="primary"
                    size="small"
                    className="-z-999999"
                >
                    {deleteBulkMemoryMutation.isPending ? (
                        <LoadingContainer />
                    ) : (
                        <Paragraph className="text-md text-center p-0">
                            Tem certeza que deseja deletar {selectedPhotosToAction.length} fotos selecionadas?
                        </Paragraph>
                    )}
                </Modal>
            )}
        </>
    );
}
