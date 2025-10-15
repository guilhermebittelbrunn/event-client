'use client';

import { useSidebar } from '@/shared/context/SidebarContext';
import { MemoryDTO } from '@/shared/types/dtos';
import { cn, formatDate } from '@/shared/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PolaroidProps {
    memory: Partial<MemoryDTO>;
    priority?: boolean;
}

/**
 * @TODO: change this priority to true in the future, after the blur image is implemented
 */
export function Polaroid({ memory, priority = false }: PolaroidProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [hasImageError, setHasImageError] = useState(false);
    const { isMobile } = useSidebar();

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 300);

        return () => clearTimeout(timer);
    }, [memory]);

    return (
        <div className="relative">
            <div className="relative bg-white p-4 pb-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-1500 ease-out animate-float">
                <div className="relative bg-gray-100 p-2 shadow-inner">
                    <div
                        className={cn(
                            'relative w-[40vw] h-[50vh] overflow-hidden bg-matte-black',
                            isMobile && 'w-80 h-80',
                        )}
                    >
                        {/* Polaroid reveal effect (black layer) */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                                isRevealed ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            <div className="w-full h-full bg-matte-black" />
                        </div>

                        {/* Image container */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-1500 ease-out ${
                                isRevealed ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {memory.file?.url ? (
                                <div className="relative w-full h-full bg-white flex items-center justify-center">
                                    {/* Loading skeleton */}
                                    {isImageLoading && !hasImageError && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                                                    style={{ backgroundSize: '200% 100%' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Error state */}
                                    {hasImageError && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                            <svg
                                                className="w-16 h-16 mb-2 opacity-50"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-sm">Erro ao carregar imagem</span>
                                        </div>
                                    )}

                                    {/* Actual image */}
                                    {!hasImageError && (
                                        <Image
                                            src={memory.file.url}
                                            alt={memory.description || 'Memória especial'}
                                            width={320}
                                            height={320}
                                            className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${
                                                isImageLoading ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            priority={priority}
                                            loading={priority ? 'eager' : 'lazy'}
                                            quality={100}
                                            onLoad={() => setIsImageLoading(false)}
                                            onError={() => {
                                                setIsImageLoading(false);
                                                setHasImageError(true);
                                            }}
                                            sizes="(max-width: 768px) 100vw, 320px"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-white flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <svg
                                            className="w-16 h-16 mx-auto mb-2 opacity-50"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-sm">Sem imagem</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cn('mt-4 px-2 w-[40vw]', isMobile && 'w-80')}>
                    <div className="text-center mb-2">
                        <p className="text-sm text-gray-600 font-mono">
                            {formatDate(memory.createdAt || new Date())}
                        </p>
                    </div>

                    {memory?.description && (
                        <div className="text-center mb-2">
                            <p className="text-sm text-gray-800 leading-relaxed">{memory.description}</p>
                        </div>
                    )}

                    {memory?.message && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600 italic">&quot;{memory.message}&quot;</p>
                        </div>
                    )}
                </div>
            </div>

            {/* decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-60 animate-float-delayed" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-200 rounded-full opacity-60 animate-float-delayed-2" />
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-200 rounded-full opacity-40 animate-float-delayed-3" />
        </div>
    );
}
