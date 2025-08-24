'use client';
import { Button } from '@/shared/components/ui';
import { Label } from '@/shared/components/form';
import Input from '@/shared/components/form/customInput/InputField';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/shared/icons';
import Link from 'next/link';
import React, { useState } from 'react';

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon />
                    Voltar para a página inicial
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-2 sm:mb-4">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Entrar
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Insira seu email e senha para entrar!
                        </p>
                    </div>
                    <div>
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{' '}
                                    </Label>
                                    <Input placeholder="info@gmail.com" type="email" />
                                </div>
                                <div>
                                    <Label>
                                        Senha <span className="text-error-500">*</span>{' '}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Insira sua senha"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button className="w-full">Entrar</Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Não tem uma conta? {''}
                                <Link
                                    href="/cadastro"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Cadastrar
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
