'use client';

import { Title, Box } from '@/shared/components/ui';
import React, { useCallback } from 'react';
import useEvent from '@/shared/context/EventContext';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useApi } from '@/shared/hooks';
import { handleClientError } from '@/shared/utils';
import { CreateMemoryRequest } from '@/lib/services';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { PhotoSelector } from '../(components)/PhotoSelector';
import { MemoryPreview } from '../(components)/MemoryPreview';
import { useMemoryStore } from '@/shared/store/useMemory';
import { Alert } from '@/shared/components/form';

export default function SendPhotosPage() {
    const { client } = useApi();
    const { event } = useEvent();
    const { successAlert, errorAlert } = useAlert();

    const { isUploading, startUpload, completeUpload, resetMemory, setError, error } = useMemoryStore(
        (state) => ({
            isUploading: state.isUploading,
            startUpload: state.startUpload,
            completeUpload: state.completeUpload,
            resetMemory: state.resetMemory,
            setError: state.setError,
            error: state.error,
        }),
    );

    const createMemoryMutation = useMutation({
        mutationFn: (data: CreateMemoryRequest) => client.memoryService.create(data),
        onSuccess: () => {
            successAlert('Memória salva com sucesso');
            completeUpload();
        },
        onError: (error) => {
            const errorMessage = handleClientError(error);
            errorAlert(errorMessage);
            setError(errorMessage);
        },
    });

    const handleSubmit = useCallback(
        (data: { image: File; message: string }) => {
            startUpload();
            createMemoryMutation.mutate({
                message: data.message,
                image: data.image,
            });
        },
        [startUpload, createMemoryMutation],
    );

    const handleCancel = useCallback(() => {
        resetMemory();
    }, [resetMemory]);

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
                <div className="w-40 h-40">
                    <ResponsiveImage src={event?.file?.url} alt="Event image" width={40} height={40} />
                </div>
                <Title className="text-xl font-bold text-matte-black dark:text-snow-white mb-8 text-center">
                    {event?.name}
                </Title>

                {error && (
                    <div className="py-2">
                        <Alert message={error} type="error" />
                    </div>
                )}

                <div className="w-full max-w-md space-y-4 pb-4 flex-shrink-0 relative z-10">
                    <PhotoSelector disabled={isUploading} />
                </div>
            </div>

            <MemoryPreview
                isLoading={createMemoryMutation.isPending}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
