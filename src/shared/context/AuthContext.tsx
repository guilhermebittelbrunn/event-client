import { authService } from '@/lib/services';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import useAlert from '../hooks/useAlert';
import { useRedirect } from '../hooks/useRedirect';
import { handleClientError } from '../utils';
import { SignInRequest, SignInResponse, SignUpRequest } from '@/lib/services/auth/types';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import client from '@/lib/client';
import { UserDTO } from '../types/dtos';
import { userService } from '@/lib/services/user';
import { localStorage } from '../utils/helpers/localStorage';
import { LoadingScreen } from '../components/ui';
import useLocalStorage from '../hooks/useLocalStorage';
import { setCookie, removeCookie } from '../utils/helpers/cookies';
import { isTokenExpired } from '../utils/helpers/token';
import { usePathname } from 'next/navigation';
import { publicRoutes } from '@/middleware';

interface AuthContextData {
    authenticating: boolean;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user?: UserDTO;
    accessToken?: string;

    signInMutation: UseMutationResult<SignInResponse, any, SignInRequest, unknown>;
    signUpMutation: UseMutationResult<UserDTO, any, SignUpRequest, unknown>;

    signOut(): void;
    refreshTokens(): Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDTO | undefined>(undefined);
    const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');
    const [authenticating, setAuthenticating] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const hasInitialized = useRef(false);
    const pathname = usePathname();

    const { successAlert, errorAlert, warningAlert } = useAlert();
    const { redirectWithDelay, redirect } = useRedirect();

    const isPublicRoute = publicRoutes.find((route) => route.path === pathname);

    const shouldShowLoading = !isClient || (!isPublicRoute && (authenticating || !isInitialized));

    const refreshTokenMutation = useMutation({
        mutationFn: authService.refreshToken,
        onSuccess: ({ meta }) => {
            const { accessToken, refreshToken } = meta.tokens;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken || '');
            setAccessToken(accessToken);

            // client.setHeaders({
            //     Authorization: `Bearer ${accessToken}`,
            //     'Refresh-Token': `${refreshToken}`,
            // });
        },
        onError: (error) => {
            console.warn('Failed to refresh tokens:', error);
            signOut();
        },
    });

    const signInMutation = useMutation({
        mutationFn(data: SignInRequest) {
            return authService.signIn(data);
        },
        onSuccess: ({ data: userData, meta }: SignInResponse) => {
            const { tokens } = meta;

            localStorage.setUser(userData);
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            setUser(userData);
            setAccessToken(tokens.accessToken);

            setCookie('accessToken', tokens.accessToken, tokens.expiresIn);

            client.setHeaders({
                Authorization: `Bearer ${tokens.accessToken}`,
                'Refresh-Token': `${tokens.refreshToken}`,
            });

            successAlert('Login realizado com sucesso');
            redirect('/painel');
        },
        onError: (error) => {
            errorAlert(handleClientError(error));
        },
    });

    const signUpMutation = useMutation({
        mutationFn(data: SignUpRequest) {
            return authService.signUp(data);
        },
        onSuccess: () => {
            successAlert('Cadastro realizado com sucesso');
            redirectWithDelay('/entrar', 600);
        },
        onError: (error) => {
            errorAlert(handleClientError(error));
        },
    });

    const getUserMutation = useMutation({
        mutationFn: (id: string) => userService.findById(id),
        onError: (error) => {
            console.warn('Failed to get user:', error);
            signOut();
        },
    });

    const signOut = useCallback(() => {
        client.logout();
        localStorage.clearUser();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(undefined);
        setAccessToken('');
        removeCookie('accessToken');
        redirect('/');
    }, [setAccessToken, redirect]);

    const refreshTokens = useCallback(async () => {
        try {
            const currentAccessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (currentAccessToken && refreshToken) {
                await refreshTokenMutation.mutateAsync(refreshToken);
            } else {
                warningAlert('Sessão expirada, faça login novamente');
                signOut();
            }
        } catch (error) {
            console.warn('Error refreshing tokens:', error);
            signOut();
        }
    }, [refreshTokenMutation, signOut, warningAlert]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || hasInitialized.current) return;

        if (isPublicRoute) {
            setIsInitialized(true);
            return;
        }

        (async () => {
            hasInitialized.current = true;
            setAuthenticating(true);

            try {
                const userId = localStorage.getUser()?.id;
                const currentAccessToken = localStorage.getItem('accessToken');

                if (userId && currentAccessToken && !isTokenExpired(currentAccessToken)) {
                    const { data } = await getUserMutation.mutateAsync(userId);
                    setUser(data);
                    setAccessToken(currentAccessToken);
                }
            } catch (error) {
                console.warn('Failed to restore session:', error);
                warningAlert('Sessão expirada, faça login novamente');
                signOut();
            } finally {
                setAuthenticating(false);
                setIsInitialized(true);
            }
        })();
    }, [isClient, isPublicRoute, getUserMutation, signOut, setAccessToken, warningAlert, pathname]);

    useEffect(() => {
        if (user) {
            localStorage.setUser(user);
        }
    }, [user]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('token-expired', refreshTokens);

            return () => {
                window.removeEventListener('token-expired', refreshTokens);
            };
        }
    }, [refreshTokens]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: Boolean(user),
                authenticating,
                isInitialized,
                signInMutation,
                signUpMutation,
                signOut,
                refreshTokens,
                user,
                accessToken,
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
