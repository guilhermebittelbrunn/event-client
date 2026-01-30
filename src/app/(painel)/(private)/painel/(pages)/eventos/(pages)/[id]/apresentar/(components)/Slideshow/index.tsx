'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

import { CloseOutlined, PauseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { MemoryDTO } from '@/shared/types/dtos';
import { cn } from '@/shared/utils';
import { useSlideshow } from '../../(hooks)/useSlideshow';

interface SlideshowProps {
    photos: MemoryDTO[];
    initialIndex?: number;
    onClose: () => void;
}

export function Slideshow({ photos, initialIndex = 0, onClose }: SlideshowProps) {
    const [mounted, setMounted] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);

    const {
        currentPhoto,
        currentIndex,
        totalPhotos,
        isPaused,
        speed,
        showControls,
        showCaption,
        next,
        previous,
        togglePause,
        increaseSpeed,
        decreaseSpeed,
        toggleCaption,
        showControlsTemporarily,
        markCurrentReady,
    } = useSlideshow({
        photos,
        initialIndex,
        onClose,
    });

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Sempre que mudar de foto, resetamos o estado local de loading/erro
    useEffect(() => {
        setIsImageLoading(true);
        setHasImageError(false);
    }, [currentPhoto?.id]);

    if (!mounted || !currentPhoto) {
        return null;
    }

    if (photos.length === 0) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
                <div className="text-white text-center">
                    <h2 className="text-2xl mb-4">Nenhuma foto disponível</h2>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-soft-gold text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        );
    }

    const handleMouseMove = () => {
        showControlsTemporarily();
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
        // Marca no store que a imagem atual já está carregada,
        // permitindo o timer automático avançar para a próxima somente depois disso.
        markCurrentReady();
    };

    const handleImageError = () => {
        setIsImageLoading(false);
        setHasImageError(true);
        // Mesmo em caso de erro, consideramos a imagem "pronta"
        // para que o timer possa seguir fluxo normal.
        markCurrentReady();
    };

    const speedDisplay = speed < 1 ? `${1 / speed}x` : `${speed}s`;

    const slideshowContent = (
        <div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={e => {
                // Navegação por clique nas bordas
                if (e.target === e.currentTarget) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const width = rect.width;
                    if (x < width / 3) {
                        previous();
                    } else if (x > (width * 2) / 3) {
                        next();
                    }
                }
            }}
        >
            {/* Imagem principal */}
            <div className="relative w-full h-full flex items-center justify-center">
                {isImageLoading && !hasImageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {hasImageError ? (
                    <div className="text-white text-center">
                        <p className="text-lg mb-4">Erro ao carregar imagem</p>
                        <button
                            onClick={next}
                            className="px-4 py-2 bg-soft-gold text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Próxima foto
                        </button>
                    </div>
                ) : (
                    currentPhoto.file?.url && (
                        <Image
                            src={currentPhoto.file.url}
                            alt={currentPhoto.description || `Foto ${currentIndex + 1}`}
                            fill
                            className={cn(
                                'object-contain transition-opacity duration-500',
                                isImageLoading ? 'opacity-0' : 'opacity-100',
                            )}
                            priority={currentIndex < 3}
                            quality={95}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            sizes="100vw"
                        />
                    )
                )}
            </div>

            {/* Controles */}
            <div
                className={cn(
                    'absolute inset-0 pointer-events-none transition-opacity duration-300',
                    showControls ? 'opacity-100' : 'opacity-0',
                )}
            >
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-all duration-200 pointer-events-auto"
                    aria-label="Fechar (ESC)"
                    title="Fechar (ESC)"
                >
                    <CloseOutlined className="text-xl" />
                </button>

                {/* Controles inferiores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 px-6 py-3 rounded-full pointer-events-auto">
                    {/* Botão Anterior */}
                    <button
                        onClick={previous}
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all duration-200"
                        aria-label="Foto anterior"
                        title="Anterior (←)"
                    >
                        <LeftOutlined className="text-lg" />
                    </button>

                    {/* Botão Pause/Play */}
                    <button
                        onClick={togglePause}
                        className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all duration-200"
                        aria-label={isPaused ? 'Continuar' : 'Pausar'}
                        title={isPaused ? 'Continuar (Espaço)' : 'Pausar (Espaço)'}
                    >
                        {isPaused ? <FaPlay className="text-md" /> : <PauseOutlined className="text-2xl" />}
                    </button>

                    {/* Botão Próxima */}
                    <button
                        onClick={next}
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all duration-200"
                        aria-label="Próxima foto"
                        title="Próxima (→)"
                    >
                        <RightOutlined className="text-lg" />
                    </button>

                    {/* Controles de Velocidade */}
                    <div className="flex items-center gap-2 px-4 border-l border-white/20">
                        <button
                            onClick={decreaseSpeed}
                            className="w-8 h-8 rounded bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-sm font-bold transition-all duration-200"
                            aria-label="Diminuir velocidade"
                            title="Diminuir velocidade (-)"
                        >
                            -
                        </button>
                        <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                            {speedDisplay}
                        </span>
                        <button
                            onClick={increaseSpeed}
                            className="w-8 h-8 rounded bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-sm font-bold transition-all duration-200"
                            aria-label="Aumentar velocidade"
                            title="Aumentar velocidade (+)"
                        >
                            +
                        </button>
                    </div>

                    {/* Botão Legenda */}
                    <button
                        onClick={toggleCaption}
                        className={cn(
                            'px-4 py-2 rounded bg-black/50 hover:bg-black/70 text-white text-sm font-medium transition-all duration-200',
                            showCaption && 'bg-soft-gold/80 hover:bg-soft-gold',
                        )}
                        aria-label="Alternar legenda"
                        title="Legendas (C)"
                    >
                        CC
                    </button>
                </div>

                {/* Indicador de posição */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm pointer-events-auto">
                    {currentIndex + 1} / {totalPhotos}
                </div>

                {/* Navegação lateral (setas grandes) */}
                {currentIndex > 0 && (
                    <button
                        onClick={previous}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-all duration-200 pointer-events-auto opacity-0 hover:opacity-100"
                        aria-label="Foto anterior"
                    >
                        <LeftOutlined className="text-3xl" />
                    </button>
                )}

                {currentIndex < totalPhotos - 1 && (
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-all duration-200 pointer-events-auto opacity-0 hover:opacity-100"
                        aria-label="Próxima foto"
                    >
                        <RightOutlined className="text-3xl" />
                    </button>
                )}
            </div>

            {/* Legenda */}
            {showCaption && currentPhoto.message && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-md w-full pointer-events-none text-yellow-300 bold">
                    <div className="bg-black/70 px-4 py-2 rounded-lg text-center">
                        <p className="text-base leading-relaxed">{currentPhoto.message}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return createPortal(slideshowContent, document.body);
}
