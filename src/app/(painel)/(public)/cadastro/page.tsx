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
import useAuth from '@/shared/context/AuthContext';

export default function SignUpForm() {
    const form = useForm({ resolver: yupResolver(signUpRequestSchema) });

    const { signUpMutation } = useAuth();

    const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
        signUpMutation.mutate(data);
    };

    return (
        <Box type="secondary" className="flex flex-col items-center justify-center">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-cursive">
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
                            loading={signUpMutation.isPending}
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
