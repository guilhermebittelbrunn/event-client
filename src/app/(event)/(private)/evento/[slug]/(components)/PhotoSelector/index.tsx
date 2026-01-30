'use client';

import { CameraButton } from '../CameraButton';
import { GalleryButton } from '../GalleryButton';
import { useMemoryStore } from '@/shared/store/useMemory';

interface PhotoSelectorProps {
    disabled?: boolean;
}

export function PhotoSelector({ disabled = false }: PhotoSelectorProps) {
    const { image, isCapturing } = useMemoryStore(state => ({
        image: state.image,
        isCapturing: state.isCapturing,
    }));

    const isDisabled = disabled || !!image;

    return (
        <div className="w-full space-y-4">
            <CameraButton
                disabled={isDisabled}
                loading={isCapturing}
                className="w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 touch-manipulation active:scale-95 transition-transform"
            />

            <GalleryButton
                disabled={isDisabled}
                className='className="w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 touch-manipulation active:scale-95 transition-transform"'
            />
        </div>
    );
}
