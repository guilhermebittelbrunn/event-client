/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import useAlert from '../hooks/useAlert';
import { useRedirect } from '../hooks/useRedirect';
import { getTokenPayload, handleClientError } from '../utils';
import { SignInRequest, SignInResponse, SignUpRequest } from '@/lib/services/auth/types';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserDTO } from '../types/dtos';
import { LoadingScreen } from '../components/ui';
import { setCookie, removeCookie, getCookie } from '../utils/helpers/cookies';
import { usePathname } from 'next/navigation';
import { publicRoutes } from '@/middleware';
import { UserTokenPayload } from '../types/dtos/user/auth';
import client from '@/lib/clients/client';

interface AuthContextData {
    authenticating: boolean;
    isAuthenticated: boolean;
    user?: UserDTO;

    signInMutation: UseMutationResult<SignInResponse, any, SignInRequest, unknown>;
    signUpMutation: UseMutationResult<UserDTO, any, SignUpRequest, unknown>;

    signOut(): void;
}

const AuthContext = createContext({} as AuthContextData);

const getTokensFromCookies = () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    return { accessToken, refreshToken };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDTO | undefined>(undefined);

    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    const { successAlert, errorAlert, warningAlert } = useAlert();
    const { redirectWithDelay, redirect } = useRedirect();

    const isPublicRoute = publicRoutes.find(({ path }) => path === pathname);

    const signOut = useCallback(() => {
        removeCookie('accessToken');
        removeCookie('refreshToken');

        setUser(undefined);
        redirect('/entrar');
    }, [redirect]);

    const signInMutation = useMutation({
        mutationFn(data: SignInRequest) {
            return client.authService.signIn(data);
        },
        onSuccess: ({ data: userData, meta }: SignInResponse) => {
            const { tokens } = meta;

            setCookie('accessToken', tokens.accessToken, tokens.expiresIn);
            if (tokens.refreshToken) {
                setCookie('refreshToken', tokens.refreshToken, tokens.expiresIn);
            }

            setUser(userData);
            successAlert('Login realizado com sucesso');
            redirect('/painel');
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const signUpMutation = useMutation({
        mutationFn: (data: SignUpRequest) => client.authService.signUp(data),
        onSuccess: () => {
            successAlert('Cadastro realizado com sucesso');
            redirectWithDelay('/entrar', 600);
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const getUserMutation = useMutation({
        mutationFn: (id: string) => client.userService.findById(id),
    });

    const handleInvalidAccess = () => {
        warningAlert('Sessão expirada, faça login novamente');
        signOut();
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        console.log('Autenticando usuário...');

        if (!isClient || isPublicRoute) return;

        const { accessToken: cookieAccessToken } = getTokensFromCookies();
        console.log('cookieAccessToken :>> ', cookieAccessToken);

        const { sub } = getTokenPayload<UserTokenPayload>(cookieAccessToken) || {};

        console.log('sub :>> ', sub);

        (async () => {
            if (sub) {
                await getUserMutation.mutateAsync(sub, {
                    onSuccess: ({ data }) => setUser(data),
                    onError: (error) => {
                        console.error('Failed to get user:', error);
                        handleInvalidAccess();
                    },
                });
                return;
            }

            console.log('logout');
            handleInvalidAccess();
        })();
    }, [isClient, isPublicRoute]);

    const authenticating = getUserMutation.isPending || signInMutation.isPending;
    const shouldShowLoading = !isClient || (!isPublicRoute && authenticating);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: Boolean(user),
                authenticating,
                signInMutation,
                signUpMutation,
                signOut,
                user,
            }}
        >
            {shouldShowLoading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
