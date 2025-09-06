import React from 'react';
import { Box, Loading } from '@/shared/components/ui';
import { MemoryDTO } from '@/shared/types/dtos';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhotoItem } from '../PhotoItem';

interface PhotoGridProps {
    photos: MemoryDTO[];
    selectedPhotos: string[];
    isSelectMode: boolean;
    onSelectPhoto: (photoId: string) => void;
    onOpenModal?: (memory: MemoryDTO) => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoading?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
    photos,
    selectedPhotos,
    isSelectMode,
    onSelectPhoto,
    onOpenModal,
    hasMore = false,
    onLoadMore,
    isLoading = false,
}) => {
    const handlePhotoClick = (photo: MemoryDTO) => {
        if (isSelectMode) {
            onSelectPhoto(photo.id);
            return;
        }
        onOpenModal?.(photo);
    };

    return (
        <Box>
            <InfiniteScroll
                dataLength={photos.length}
                next={onLoadMore || (() => {})}
                hasMore={hasMore}
                loader={<></>}
                className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5"
            >
                {photos.map((photo) => (
                    <PhotoItem
                        key={photo.id}
                        photo={photo}
                        selectedPhotos={selectedPhotos}
                        isSelectMode={isSelectMode}
                        handlePhotoClick={handlePhotoClick}
                    />
                ))}
            </InfiniteScroll>

            {isLoading && (
                <div className="flex w-full justify-center py-8">
                    <Loading />
                </div>
            )}

            {photos.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma foto encontrada</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        As fotos aparecerão aqui quando forem adicionadas ao evento
                    </p>
                </div>
            )}
        </Box>
    );
};
