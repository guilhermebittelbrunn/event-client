'use client';

import { Box, BoxProps } from '@/shared/components/ui';
import { MemoryDTO } from '@/shared/types/dtos';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhotoItem } from '../PhotoItem';
import { useResponsiveLimit } from '@/shared/hooks';
import { PhotoSkeleton } from '@/shared/components/common/PhotoSkeleton';

interface PhotoGridProps {
    photos: MemoryDTO[];
    selectedPhotos: string[];
    isSelectMode: boolean;
    onSelectPhoto: (photoId: string) => void;
    onOpenModal?: (memory: MemoryDTO, allPhotos: MemoryDTO[]) => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoading?: boolean;
    boxProps?: Omit<BoxProps, 'children'>;
}

export const PhotoGrid: React.FC<PhotoGridProps> = (props) => {
    const {
        photos,
        selectedPhotos,
        isSelectMode,
        onSelectPhoto,
        onOpenModal,
        hasMore = false,
        onLoadMore,
        isLoading,
        boxProps,
    } = props;

    const limitByResolution = useResponsiveLimit({ mobile: 12, lg: 16, xl: 16 });

    const handlePhotoClick = (photo: MemoryDTO) => {
        if (isSelectMode) {
            onSelectPhoto(photo.id);
            return;
        }
        onOpenModal?.(photo, photos);
    };

    return (
        <Box {...boxProps}>
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
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5 mt-2">
                    {Array.from({ length: limitByResolution }).map((_, index) => (
                        <PhotoSkeleton key={index} />
                    ))}
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
