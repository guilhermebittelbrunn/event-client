import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { Polaroid } from '@/shared/components/common/Pollaroid';
import { MemoryDTO } from '@/shared/types/dtos';

interface MemoryModalProps {
    currentMemory: MemoryDTO;
    allPhotos: MemoryDTO[];
    onClose: () => void;
    onNavigate: (memory: MemoryDTO) => void;
    toolBar?: React.ReactNode;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
    currentMemory,
    allPhotos,
    onClose,
    onNavigate,
    toolBar,
}) => {
    const [mounted, setMounted] = useState(false);

    const { previousMemory, nextMemory, currentIndex } = useMemo(() => {
        const index = allPhotos.findIndex((photo) => photo.id === currentMemory.id);
        return {
            currentIndex: index,
            previousMemory: index > 0 ? allPhotos[index - 1] : undefined,
            nextMemory: index < allPhotos.length - 1 ? allPhotos[index + 1] : undefined,
        };
    }, [currentMemory.id, allPhotos]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft' && previousMemory) {
                onNavigate(previousMemory);
            } else if (e.key === 'ArrowRight' && nextMemory) {
                onNavigate(nextMemory);
            }
        };

        if (mounted) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [mounted, previousMemory, nextMemory, onClose, onNavigate]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (previousMemory) {
            onNavigate(previousMemory);
        }
    };

    const handleNext = () => {
        if (nextMemory) {
            onNavigate(nextMemory);
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Fechar modal"
            >
                <CloseOutlined className="text-lg" />
            </button>

            {previousMemory && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                    aria-label="Foto anterior"
                >
                    <LeftOutlined className="text-xl" />
                </button>
            )}

            <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center gap-4">
                <Polaroid memory={currentMemory} />

                {toolBar && (
                    <div className="flex items-center justify-center gap-4 border-2 border-soft-gold 2 px-2 py-1 rounded-full">
                        {toolBar}
                    </div>
                )}
            </div>

            {nextMemory && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                    aria-label="Próxima foto"
                >
                    <RightOutlined className="text-xl" />
                </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {currentIndex + 1} de {allPhotos.length}
                {previousMemory && ' ←'} {nextMemory && ' →'}
            </div>
        </div>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
};
