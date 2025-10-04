'use client';

import React, { useRef, useCallback } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from '@/shared/components/ui';
import { cn } from '@/shared/utils/helpers/cn';
import { useMemoryStore } from '@/shared/store/useMemory';

interface GalleryButtonProps extends Omit<ButtonProps, 'onClick'> {
    onImageSelect?: (file: File) => void;
    disabled?: boolean;
}

export function GalleryButton({
    onImageSelect,
    disabled = false,
    className = '',
    ...buttonProps
}: GalleryButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setImage, compressImage, validateImage, setError } = useMemoryStore((state) => ({
        setImage: state.setImage,
        compressImage: state.compressImage,
        validateImage: state.validateImage,
        setError: state.setError,
    }));

    const handleGalleryClick = useCallback(() => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    }, [disabled]);

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                if (!validateImage(file)) {
                    setError('Formato de imagem inválido ou arquivo muito grande');
                    return;
                }

                // Comprimir imagem se for maior que 1MB
                if (file.size > 1024 * 1024) {
                    try {
                        const compressedFile = await compressImage(file);
                        setImage(compressedFile);
                        onImageSelect?.(compressedFile);
                    } catch (error) {
                        console.error('Erro ao comprimir imagem:', error);
                        setImage(file);
                        onImageSelect?.(file);
                    }
                } else {
                    setImage(file);
                    onImageSelect?.(file);
                }
            }

            // Limpa o input para permitir selecionar o mesmo arquivo novamente
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [setImage, compressImage, validateImage, setError, onImageSelect],
    );

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
                multiple={false}
            />

            <Button
                type="primary"
                icon={<UploadOutlined className="scale-125" />}
                onClick={handleGalleryClick}
                disabled={disabled}
                className={cn(
                    'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 transition-opacity duration-200 touch-manipulation active:scale-95',
                    className,
                    disabled && 'opacity-40 hover:opacity-40',
                )}
                {...buttonProps}
            >
                Carregar fotos
            </Button>
        </>
    );
}
