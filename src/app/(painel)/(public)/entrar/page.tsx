'use client';
import { Box } from '@/shared/components/ui/box';
import { FormProvider } from '@/shared/components/form';
import React from 'react';
import { HookFormInput, HookFormInputPassword } from '@/shared/components/hookForm';
import { Button, Title } from '@/shared/components/ui';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import useAlert from '@/shared/context/AlertContext';
import { useRedirect } from '@/shared/hooks';

export default function SignInForm() {
    const form = useForm();
    const { successAlert } = useAlert();
    const { handleSubmit } = form;
    const { redirect } = useRedirect();

    const onSubmit = (data) => {
        console.log(data);
        successAlert('Login realizado com sucesso');
        redirect('/painel');
    };

    return (
        <Box type="secondary" className="flex flex-col items-center justify-center">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-cursive">
                            Qinstante
                        </Title>
                    </div>

                    <Box type="secondary" className="max-w-md gap-1">
                        <HookFormInput name="email" label="Email" type="email" required />
                        <HookFormInputPassword name="password" label="Senha" required />
                    </Box>

                    <Box type="secondary" className="max-w-md gap-2 mt-4 items-center justify-center">
                        <Button type="primary" htmlType="submit" className="py-6 text-lg w-full rounded-xl">
                            Entrar
                        </Button>
                    </Box>

                    <Link href="/cadastro">
                        <Title className="text-sm">Não tem conta? Cadastre-se</Title>
                    </Link>
                </form>
            </FormProvider>
        </Box>
    );
}
