'use client';
import { Box } from '@/shared/components/ui/box';
import { FormProvider } from '@/shared/components/form';
import React, { useMemo, useEffect, useState } from 'react';
import { HookFormInput, HookFormInputPassword } from '@/shared/components/hookForm';
import { Button, Title } from '@/shared/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/shared/store/useAuth';
import { signInRequestSchema, SignInSchema } from '@/lib/services/auth/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import useAlert from '@/shared/hooks/useAlert';
import { handleClientError } from '@/shared/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import client from '@/lib/clients/client';
import { RefreshTokenResponse } from '@/lib/services/auth/types';
import { setCookie } from '@/shared/utils/helpers/cookies';
import { getTokenPayload } from '@/shared/utils/helpers/token';
import { UserTokenPayload } from '@/shared/types/dtos/user/auth';

export default function SignInForm() {
    const form = useForm({ resolver: yupResolver(signInRequestSchema) });
    const { handleSubmit } = form;
    const signIn = useAuth(state => state.signIn);
    const isSigningIn = useAuth(state => state.isSigningIn);
    const { successAlert, errorAlert } = useAlert();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAttemptingReauth, setIsAttemptingReauth] = useState(false);

    // Obter URL de redirecionamento dos query params
    const redirectUrl = useMemo(() => {
        const redirect = searchParams.get('redirect');
        const sessionId = searchParams.get('session_id');

        if (redirect) {
            // searchParams.get() já decodifica automaticamente
            return redirect;
        }

        return '/painel';
    }, [searchParams]);

    // Tentar reautenticar automaticamente se houver refreshToken no localStorage
    useEffect(() => {
        // Só executar no cliente
        if (typeof window === 'undefined') return;

        const attemptReauth = async () => {
            // Só tentar se não estiver autenticado e houver redirect param
            const redirect = searchParams.get('redirect');
            if (!redirect || isAttemptingReauth) {
                return;
            }

            // Verificar se já está autenticado
            const isAuthenticated = useAuth.getState().isAuthenticated;
            if (isAuthenticated) {
                return;
            }

            const storedRefreshToken = localStorage.getItem('stripe_refresh_token');
            if (!storedRefreshToken) {
                return;
            }

            setIsAttemptingReauth(true);

            try {
                const response = await fetch('/api/v1/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'refresh-token': storedRefreshToken,
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to refresh token: ${response.status} - ${errorText}`);
                }

                const refreshResponse: RefreshTokenResponse = await response.json();
                const { tokens } = refreshResponse.meta;

                setCookie('accessToken', tokens.accessToken, tokens.expiresIn);
                if (tokens.refreshToken) {
                    setCookie('refreshToken', tokens.refreshToken, tokens.expiresIn);
                    localStorage.setItem('stripe_refresh_token', tokens.refreshToken);
                }

                const payload = getTokenPayload<UserTokenPayload>(tokens.accessToken);
                if (payload?.sub) {
                    const { data: user } = await client.userService.findById(payload.sub);
                    useAuth.getState().setUser(user);
                    useAuth.getState().setError(null);
                    successAlert('Sessão restaurada automaticamente');
                    router.push(redirect);
                }
            } catch (error) {
                console.error('[LOGIN] Failed to reauthenticate:', error);
                localStorage.removeItem('stripe_refresh_token');
            } finally {
                setIsAttemptingReauth(false);
            }
        };

        attemptReauth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit: SubmitHandler<SignInSchema> = async data => {
        try {
            await signIn(data);
            successAlert('Login realizado com sucesso');
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('[LOGIN] Sign in error:', error);
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
