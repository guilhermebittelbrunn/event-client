'use client';

import { FormProvider } from '@/shared/components/form';
import { HookFormInput, HookFormInputPassword } from '@/shared/components/hookForm';
import { Button, Title } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpForm() {
    const form = useForm();
    const { handleSubmit } = form;

    const onSubmit = (data) => {
        console.log(data);
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
                        <HookFormInput name="name" label="Nome" required />
                        <HookFormInput name="email" label="Email" required />
                        <HookFormInputPassword name="password" label="Senha" required />
                    </Box>

                    <Box type="secondary" className="max-w-md gap-2 mt-4 items-center justify-center">
                        <Button type="primary" htmlType="submit" className="py-6 text-lg w-full rounded-xl">
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
