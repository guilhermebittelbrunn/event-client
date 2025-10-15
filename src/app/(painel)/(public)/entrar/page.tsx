'use client';
import { Box } from '@/shared/components/ui/box';
import { FormProvider } from '@/shared/components/form';
import React from 'react';
import { HookFormInput, HookFormInputPassword } from '@/shared/components/hookForm';
import { Button, Title } from '@/shared/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/shared/store/useAuth';
import { signInRequestSchema, SignInSchema } from '@/lib/services/auth/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import useAlert from '@/shared/hooks/useAlert';
import { useRouter } from 'next/navigation';
import { handleClientError } from '@/shared/utils';

export default function SignInForm() {
    const form = useForm({ resolver: yupResolver(signInRequestSchema) });
    const { handleSubmit } = form;
    const signIn = useAuth((state) => state.signIn);
    const isSigningIn = useAuth((state) => state.isSigningIn);
    const { successAlert, errorAlert } = useAlert();
    const router = useRouter();

    const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
        try {
            await signIn(data);
            successAlert('Login realizado com sucesso');
            router.push('/painel');
        } catch (error) {
            errorAlert(handleClientError(error));
        }
    };

    return (
        <Box type="secondary" className="flex flex-col items-center justify-center">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush">
                            Qinstante
                        </Title>
                    </div>

                    <Box type="secondary" className="max-w-md gap-1">
                        <HookFormInput name="email" label="Email" type="email" required />
                        <HookFormInputPassword name="password" label="Senha" required />
                    </Box>

                    <Box type="secondary" className="max-w-md gap-2 mt-4 items-center justify-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="py-6 text-lg w-full rounded-xl"
                            loading={isSigningIn}
                        >
                            Entrar
                        </Button>
                    </Box>
                </form>
            </FormProvider>

            <Link href="/cadastro">
                <Title className="text-sm">Não tem conta? Cadastre-se</Title>
            </Link>
        </Box>
    );
}
