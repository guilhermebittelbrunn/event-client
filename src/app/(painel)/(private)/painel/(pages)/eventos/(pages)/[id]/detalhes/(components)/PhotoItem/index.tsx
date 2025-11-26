import { cn } from '@/shared/utils';
import { MemoryDTO } from '@/shared/types/dtos';
import { CheckCircleIcon, EyeCloseIcon } from '@/shared/icons';
import { ProgressiveImage } from '@/shared/components/common/ProgressiveImage';

interface PhotoItemProps {
    photo: MemoryDTO;
    selectedPhotos: string[];
    isSelectMode: boolean;
    handlePhotoClick: (photo: MemoryDTO) => void;
}

export const PhotoItem = ({ photo, selectedPhotos, isSelectMode, handlePhotoClick }: PhotoItemProps) => {
    const isSelected = selectedPhotos.includes(photo.id);

    return (
        <div
            key={photo.id}
            className={cn(
                'relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-opacity duration-300 hover:cursor-pointer',
                isSelected && 'opacity-40',
                !isSelectMode && 'hover:opacity-60',
            )}
            onClick={() => handlePhotoClick(photo)}
        >
            {photo.hidden && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <EyeCloseIcon className="text-white text-sm scale-150" />
                </div>
            )}

            <ProgressiveImage
                src={photo.file?.url}
                alt={`Foto ${photo.id}`}
                className={cn('rounded-lg', isSelected && 'opacity-40')}
                containerClassName="w-full h-full"
            />

            {isSelectMode && (
                <div
                    className={`absolute top-2 left-2 w-[28px] h-[28px] rounded-full border-1 flex items-center justify-center scale-75 ${
                        isSelected
                            ? 'bg-soft-gold border-soft-gold shadow-lg transition-all duration-200 ease-in-out'
                            : 'bg-white border-gray-300 dark:bg-gray-300 shadow-lg dark:border-stone-700 transition-all duration-200 ease-in-out'
                    }`}
                >
                    {isSelected && <CheckCircleIcon className="w-6 h-6 text-white" />}
                </div>
            )}
        </div>
    );
};
