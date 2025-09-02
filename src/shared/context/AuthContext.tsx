/* eslint-disable react-hooks/exhaustive-deps */
import { authService } from '@/lib/services';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import useAlert from '../hooks/useAlert';
import { useRedirect } from '../hooks/useRedirect';
import { getTokenPayload, handleClientError } from '../utils';
import { SignInRequest, SignInResponse, SignUpRequest } from '@/lib/services/auth/types';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserDTO } from '../types/dtos';
import { userService } from '@/lib/services/user';
import { LoadingScreen } from '../components/ui';
import { setCookie, removeCookie, getCookie } from '../utils/helpers/cookies';
import { usePathname } from 'next/navigation';
import { publicRoutes } from '@/middleware';
import { UserTokenPayload } from '../types/dtos/user/auth';

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

    const [authenticating, setAuthenticating] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    const { successAlert, errorAlert, warningAlert } = useAlert();
    const { redirectWithDelay, redirect } = useRedirect();

    const isPublicRoute = publicRoutes.find(({ path }) => path === pathname);
    const shouldShowLoading = !isClient || (!isPublicRoute && authenticating);

    const signOut = useCallback(() => {
        removeCookie('accessToken');
        removeCookie('refreshToken');

        setUser(undefined);
        redirect('/entrar');
    }, [redirect]);

    const signInMutation = useMutation({
        mutationFn(data: SignInRequest) {
            return authService.signIn(data);
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
        mutationFn(data: SignUpRequest) {
            return authService.signUp(data);
        },
        onSuccess: () => {
            successAlert('Cadastro realizado com sucesso');
            redirectWithDelay('/entrar', 600);
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const getUserMutation = useMutation({
        mutationFn: (id: string) => userService.findById(id),
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || isPublicRoute) return;

        const { accessToken: cookieAccessToken } = getTokensFromCookies();

        if (cookieAccessToken) {
            setAuthenticating(true);

            try {
                const { sub } = getTokenPayload<UserTokenPayload>(cookieAccessToken) || {};

                if (sub) {
                    getUserMutation.mutate(sub, {
                        onSuccess: ({ data }) => setUser(data),
                        onError: (error) => {
                            console.error('Failed to get user:', error);
                            warningAlert('Sessão expirada, faça login novamente');
                            signOut();
                        },
                    });
                } else {
                    throw new Error('Invalid token payload');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                warningAlert('Sessão expirada, faça login novamente');
                signOut();
            } finally {
                setAuthenticating(false);
            }
        } else {
            setAuthenticating(false);
        }
    }, [isClient, isPublicRoute]);

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
