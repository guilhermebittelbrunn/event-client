'use client';

import { Label, Input } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/shared/icons';
import Link from 'next/link';
import React, { useState } from 'react';

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
                    <div className="mb-2 sm:mb-4  ">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Cadastrar
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Insira seu email e senha para cadastrar!
                        </p>
                    </div>
                    <div>
                        <form>
                            <div className="space-y-3 w-full">
                                <div className="gap-5 sm:grid-cols-2">
                                    {/* <!-- First Name --> */}
                                    <div className="sm:col-span-1">
                                        <Label>
                                            Nome<span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Insira seu nome"
                                        />
                                    </div>
                                </div>
                                {/* <!-- Email --> */}
                                <div>
                                    <Label>
                                        Email<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Insira seu email"
                                    />
                                </div>
                                {/* <!-- Password --> */}
                                <div>
                                    <Label>
                                        Senha<span className="text-error-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Insira sua senha"
                                            type={showPassword ? 'text' : 'password'}
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
                                {/* <!-- Checkbox --> */}
                                {/* <div className="flex items-center gap-3">
                                <Checkbox
                                    className="w-5 h-5"
                                    checked={isChecked}
                                    onChange={setIsChecked}
                                />
                                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                    Ao criar uma conta, você concorda com os{" "}
                                    <span className="text-gray-800 dark:text-white/90">
                                    Termos e Condições,
                                    </span>{" "}
                                    e nossa{" "}
                                    <span className="text-gray-800 dark:text-white">
                                    Política de Privacidade
                                    </span>
                                </p>
                                </div> */}
                                {/* <!-- Button --> */}
                                <Button className="w-full">Cadastrar</Button>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Já tem uma conta?
                                <Link
                                    href="/entrar"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    {' '}
                                    Entrar
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
