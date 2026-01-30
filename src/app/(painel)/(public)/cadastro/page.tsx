'use client';

import { SignUpSchema, signUpRequestSchema } from '@/lib/services/auth/schema';
import { FormProvider } from '@/shared/components/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HookFormInput, HookFormInputPassword } from '@/shared/components/hookForm';
import { Button, Title } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '@/shared/store/useAuth';
import useAlert from '@/shared/hooks/useAlert';
import { handleClientError } from '@/shared/utils';

export default function SignUpForm() {
    const form = useForm({ resolver: yupResolver(signUpRequestSchema) });
    const signUp = useAuth(state => state.signUp);
    const isSigningUp = useAuth(state => state.isSigningUp);
    const { successAlert, errorAlert } = useAlert();

    const onSubmit: SubmitHandler<SignUpSchema> = async data => {
        try {
            await signUp(data);
            successAlert('Cadastro realizado com sucesso');
            setTimeout(() => {
                window.location.href = '/entrar';
            }, 600);
        } catch (error) {
            errorAlert(handleClientError(error));
        }
    };

    return (
        <Box type="secondary" className="flex flex-col items-center justify-center">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush">
                            Qinstante
                        </Title>
                    </div>

                    <Box type="secondary" className="max-w-md gap-1">
                        <HookFormInput name="name" label="Nome" required />
                        <HookFormInput name="email" label="Email" required />
                        <HookFormInputPassword name="password" label="Senha" required />
                    </Box>

                    <Box type="secondary" className="max-w-md gap-2 mt-4 items-center justify-center">
                        <Button
                            loading={isSigningUp}
                            type="primary"
                            htmlType="submit"
                            className="py-6 text-lg w-full rounded-xl"
                        >
                            Cadastrar
                        </Button>
                    </Box>

                    <Link href="/entrar">
                        <Title className="text-sm">Já tem conta? Entre</Title>
                    </Link>
                </form>
            </FormProvider>
        </Box>
    );
}
