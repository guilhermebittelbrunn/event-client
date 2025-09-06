import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { cn } from '@/shared/utils';
import { MemoryDTO } from '@/shared/types/dtos';
import { CheckCircleIcon } from '@/shared/icons';

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
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:opacity-70 transition-opacity duration-300"
            onClick={() => handlePhotoClick(photo)}
        >
            <div className="w-full h-full relative">
                <ResponsiveImage
                    src={photo.file?.url}
                    alt={`Foto ${photo.id}`}
                    width={200}
                    height={200}
                    className={cn('w-full h-full object-cover rounded-none', isSelected && 'opacity-40')}
                />
            </div>

            {isSelectMode && (
                <div
                    className={`absolute top-2 left-2 w-7 h-7 rounded-full border-2 flex items-center justify-center ${
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
