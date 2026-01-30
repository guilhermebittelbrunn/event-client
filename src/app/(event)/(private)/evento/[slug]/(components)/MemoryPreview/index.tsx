'use client';

import React, { useCallback } from 'react';
import { Polaroid } from '@/shared/components/common/Pollaroid';
import { Button } from '@/shared/components/ui';
import { useMemoryStore } from '@/shared/store/useMemory';
import useMemory from '@/shared/store/useMemory';
import { TextArea } from '@/shared/components/form';

interface MemoryPreviewProps {
    isLoading?: boolean;
    onSubmit?: (data: { image: File; message: string }) => void;
    onCancel?: () => void;
}

export function MemoryPreview({ isLoading = false, onSubmit, onCancel }: MemoryPreviewProps) {
    const { image, imageUrl, message, showPreview, cancelProcess } = useMemoryStore(state => ({
        image: state.image,
        imageUrl: state.imageUrl,
        message: state.message,
        showPreview: state.showPreview,
        cancelProcess: state.cancelProcess,
    }));

    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onCancel?.();
                cancelProcess();
            }
        },
        [onCancel, cancelProcess],
    );

    const handleSubmit = useCallback(() => {
        if (image) {
            onSubmit?.({ image, message });
        }
    }, [image, message, onSubmit]);

    const handleCancel = useCallback(() => {
        onCancel?.();
        cancelProcess();
    }, [onCancel, cancelProcess]);

    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        useMemory.setState({ message: e.target.value });
    }, []);

    if (!showPreview || !image || !imageUrl) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl overflow-hidden touch-none overscroll-none"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md flex flex-col h-full py-4 px-4">
                <div className="flex-1 flex items-center justify-center min-h-0 py-4">
                    <Polaroid
                        memory={{
                            message,
                            description: '',
                            file: imageUrl
                                ? {
                                      id: 'temp-file',
                                      name: 'uploaded-image',
                                      path: '',
                                      size: 0,
                                      url: imageUrl,
                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString(),
                                  }
                                : undefined,
                        }}
                    />
                </div>

                <div className="w-full flex flex-col gap-4 flex-shrink-0 pb-safe-offset-4">
                    <TextArea
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Deixe uma mensagem (opcional)"
                        className="w-full h-18 px-3 py-3 border rounded-lg resize-none focus:ring-2 focus:border-transparent text-lg touch-manipulation"
                        rows={2}
                        maxLength={200}
                    />

                    <div className="flex flex-col gap-2">
                        <Button
                            disabled={isLoading}
                            loading={isLoading}
                            onClick={handleSubmit}
                            type="primary"
                            className="w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 touch-manipulation active:scale-95 transition-transform relative z-10"
                        >
                            Salvar
                        </Button>

                        <Button
                            type="secondary"
                            onClick={handleCancel}
                            className="w-full p-6 text-lg font-medium rounded-lg flex items-center bg-white gap-3 touch-manipulation active:scale-95 transition-transform relative z-10"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
