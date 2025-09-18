import { MemoryDTO } from '@/shared/types/dtos';
import { formatDate } from '@/shared/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PolaroidProps {
    memory: Partial<MemoryDTO>;
}

export function Polaroid({ memory }: PolaroidProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsRevealed(true), 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative">
            <div className="relative bg-white p-4 pb-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-1500 ease-out animate-float">
                <div className="relative bg-gray-100 p-2 shadow-inner">
                    <div className="relative w-80 h-80 overflow-hidden bg-matte-black">
                        <div
                            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                                isRevealed ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            <div className="w-full h-full bg-matte-black" />
                        </div>

                        <div
                            className={`absolute inset-0 transition-opacity duration-1500 ease-out ${
                                isRevealed ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {memory.file?.url && (
                                <div className="relative w-full h-full bg-white flex items-center justify-center">
                                    {memory.file.url.startsWith('blob:') ? (
                                        <Image
                                            src={memory.file.url}
                                            alt={memory.description || 'Memória especial'}
                                            className="max-w-full max-h-full object-contain"
                                            width={320}
                                            height={320}
                                        />
                                    ) : (
                                        <Image
                                            src={memory.file.url}
                                            alt={memory.description || 'Memória especial'}
                                            width={320}
                                            height={320}
                                            className="max-w-full max-h-full object-contain"
                                            unoptimized
                                            priority
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 px-2 w-80">
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
