'use client';

import { Title, Button, Box } from '@/shared/components/ui';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HookFormTextArea, HookFormUnifiedPhotoInput } from '@/shared/components/hookForm';
import useEvent from '@/shared/context/EventContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { createMemoryRequestSchema, CreateMemorySchema } from '@/lib/services';
import { useMutation } from '@tanstack/react-query';
import { useAlert, useApi } from '@/shared/hooks';
import { handleClientError } from '@/shared/utils';
import { CreateMemoryRequest } from '@/lib/services';
import { FormProvider } from '@/shared/components/hookForm';

export default function SendPhotosPage() {
    const { client } = useApi();
    const { event } = useEvent();
    const { successAlert, errorAlert } = useAlert();

    const form = useForm({ resolver: yupResolver(createMemoryRequestSchema) });
    const { handleSubmit, reset } = form;

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
        <Box type="secondary" className="min-h-[calc(100vh-152.55px)] flex flex-col">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <Title className="text-xl font-bold text-matte-black dark:text-snow-white mb-8 text-center">
                            {event?.name}
                        </Title>

                        <div className="w-full max-w-md mb-8">
                            <HookFormTextArea
                                name="message"
                                label="Deixe uma mensagem (opcional)"
                                placeholder="Digite sua mensagem..."
                                className="w-full h-24 px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:border-transparent text-lg"
                                labelClassName="text-lg"
                            />
                        </div>

                        <div className="w-full max-w-md space-y-4">
                            <HookFormUnifiedPhotoInput
                                name="image"
                                cameraButtonProps={{
                                    className:
                                        'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3',
                                }}
                                uploadButtonProps={{
                                    className:
                                        'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3',
                                }}
                            />

                            <Button
                                disabled={createMemoryMutation.isPending}
                                loading={createMemoryMutation.isPending}
                                htmlType="submit"
                                type="secondary"
                                className="w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center bg-white gap-3"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Box>
    );
}
