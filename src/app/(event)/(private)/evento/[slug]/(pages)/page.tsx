'use client';

import { Title, Box } from '@/shared/components/ui';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HookFormUnifiedPhotoInput } from '@/shared/components/hookForm';
import useEvent from '@/shared/context/EventContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { createMemoryRequestSchema, CreateMemorySchema } from '@/lib/services';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useApi } from '@/shared/hooks';
import { handleClientError } from '@/shared/utils';
import { CreateMemoryRequest } from '@/lib/services';
import { FormProvider } from '@/shared/components/hookForm';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { PreviewMemory } from '../(components)/PreviewMemory';
import { Fallback } from '@/shared/components/common/Fallback';

export default function SendPhotosPage() {
    const { client } = useApi();
    const { event } = useEvent();
    const { successAlert, errorAlert } = useAlert();

    const form = useForm({ resolver: yupResolver(createMemoryRequestSchema) });
    const { handleSubmit, reset, watch } = form;

    const uploadedImage = watch('image');

    const createMemoryMutation = useMutation({
        mutationFn: (data: CreateMemoryRequest) => client.memoryService.create(data),
        onSuccess: () => {
            successAlert('Memória salva com sucesso');
            reset();
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const onSubmit: SubmitHandler<CreateMemorySchema> = (data) => {
        createMemoryMutation.mutate({
            message: data.message,
            image: data?.image as File,
        });
    };

    return (
        /** @TODO - Melhorar o cálculo da altura */
        <Box
            type="secondary"
            className="h-screen flex flex-col touch-manipulation overflow-hidden overscroll-none"
        >
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
                        <Fallback condition={Boolean(event?.file && event?.file?.url)}>
                            <ResponsiveImage src={event?.file?.url} alt="Event image" width={12} height={12} />
                        </Fallback>
                        <Title className="text-xl font-bold text-matte-black dark:text-snow-white mb-8 text-center">
                            {event?.name}
                        </Title>

                        <div className="w-full max-w-md space-y-4 pb-4 flex-shrink-0 relative z-10">
                            <HookFormUnifiedPhotoInput
                                name="image"
                                cameraButtonProps={{
                                    className:
                                        'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 touch-manipulation active:scale-95 transition-transform',
                                }}
                                uploadButtonProps={{
                                    className:
                                        'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 touch-manipulation active:scale-95 transition-transform',
                                }}
                            />
                        </div>
                    </div>
                    {Boolean(uploadedImage) && <PreviewMemory isLoading={createMemoryMutation.isPending} />}
                </form>
            </FormProvider>
        </Box>
    );
}
