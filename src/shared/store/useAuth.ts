'use client';

import { createWithEqualityFn } from 'zustand/traditional';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { UserDTO } from '../types/dtos';
import { SignInRequest, SignInResponse, SignUpRequest, RefreshTokenResponse } from '@/lib/services/auth/types';
import { UserTokenPayload } from '../types/dtos/user/auth';
import { getTokenPayload, handleClientError } from '../utils';
import { setCookie, getCookie, removeCookie } from '../utils/helpers/cookies';
import client from '@/lib/clients/client';

export interface AuthState {
    user: UserDTO | null;
    isAuthenticated: boolean;

    isLoading: boolean;
    isInitialized: boolean;
    isSigningIn: boolean;
    isSigningUp: boolean;

    error: string | null;
}

interface AuthActions {
    signIn: (data: SignInRequest) => Promise<SignInResponse>;
    signUp: (data: SignUpRequest) => Promise<void>;
    signOut: () => void;

    initializeAuth: () => Promise<void>;
    refreshUser: () => Promise<void>;
    setUser: (user: UserDTO | null) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

const getTokensFromCookies = () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    return { accessToken, refreshToken };
};

const clearTokensFromCookies = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    isSigningIn: false,
    isSigningUp: false,
    error: null,
};

export const useAuth = createWithEqualityFn<AuthState & AuthActions>()(
    immer(
        subscribeWithSelector((set, get) => ({
            ...initialState,

            async signIn(data: SignInRequest) {
                set(state => {
                    state.isSigningIn = true;
                    state.error = null;
                });

                try {
                    const response: SignInResponse = await client.authService.signIn(data);
                    const { data: userData, meta } = response;
                    const { tokens } = meta;

                    setCookie('accessToken', tokens.accessToken, tokens.expiresIn);
                    if (tokens.refreshToken) {
                        setCookie('refreshToken', tokens.refreshToken, tokens.expiresIn);
                    }

                    set(state => {
                        state.user = userData;
                        state.isAuthenticated = true;
                        state.isSigningIn = false;
                        state.error = null;
                    });

                    return response;
                } catch (error) {
                    const errorMessage = handleClientError(error);

                    set(state => {
                        state.isSigningIn = false;
                        state.error = errorMessage;
                    });

                    throw new Error(errorMessage);
                }
            },

            async signUp(data: SignUpRequest) {
                set(state => {
                    state.isSigningUp = true;
                    state.error = null;
                });

                try {
                    await client.authService.signUp(data);

                    set(state => {
                        state.isSigningUp = false;
                        state.error = null;
                    });
                } catch (error) {
                    const errorMessage = handleClientError(error);

                    set(state => {
                        state.isSigningUp = false;
                        state.error = errorMessage;
                    });

                    throw new Error(errorMessage);
                }
            },

            signOut() {
                clearTokensFromCookies();

                set(state => {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.error = null;
                });

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                }
            },

            async initializeAuth() {
                if (get().isInitialized) return;

                set(state => {
                    state.isLoading = true;
                });

                try {
                    const { accessToken } = getTokensFromCookies();

                    // Se não tiver accessToken, verificar se há refreshToken no localStorage
                    // (pode ter sido salvo antes de ir para o Stripe)
                    if (!accessToken && typeof window !== 'undefined') {
                        const storedRefreshToken = localStorage.getItem('stripe_refresh_token');

                        if (storedRefreshToken) {
                            try {
                                // Criar uma requisição manual com o refreshToken do localStorage
                                // O interceptor do client só adiciona o refreshToken se estiver no cookie,
                                // então precisamos fazer a requisição manualmente
                                const response = await fetch('/api/v1/auth/refresh', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'refresh-token': storedRefreshToken,
                                    },
                                });

                                if (!response.ok) {
                                    throw new Error('Failed to refresh token');
                                }

                                const refreshResponse: RefreshTokenResponse = await response.json();
                                const { tokens } = refreshResponse.meta;

                                // Salvar novos tokens nos cookies com SameSite=Lax
                                setCookie('accessToken', tokens.accessToken, tokens.expiresIn);
                                if (tokens.refreshToken) {
                                    setCookie('refreshToken', tokens.refreshToken, tokens.expiresIn);
                                    // Atualizar o refreshToken no localStorage também
                                    localStorage.setItem('stripe_refresh_token', tokens.refreshToken);
                                }

                                // Obter dados do usuário
                                const payload = getTokenPayload<UserTokenPayload>(tokens.accessToken);
                                if (payload?.sub) {
                                    const { data: user } = await client.userService.findById(payload.sub);

                                    set(state => {
                                        state.user = user;
                                        state.isAuthenticated = true;
                                        state.isLoading = false;
                                        state.isInitialized = true;
                                    });

                                    return;
                                }
                            } catch (refreshError) {
                                console.error('[AUTH] Failed to refresh token:', refreshError);
                                // Limpar localStorage se refresh falhar
                                localStorage.removeItem('stripe_refresh_token');
                            }
                        }
                    }

                    if (!accessToken) {
                        set(state => {
                            state.isLoading = false;
                            state.isInitialized = true;
                        });
                        return;
                    }

                    const payload = getTokenPayload<UserTokenPayload>(accessToken);

                    if (!payload?.sub) {
                        clearTokensFromCookies();
                        set(state => {
                            state.isLoading = false;
                            state.isInitialized = true;
                        });
                        return;
                    }

                    const { data: user } = await client.userService.findById(payload.sub);

                    set(state => {
                        state.user = user;
                        state.isAuthenticated = true;
                        state.isLoading = false;
                        state.isInitialized = true;
                    });
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                    clearTokensFromCookies();

                    set(state => {
                        state.user = null;
                        state.isAuthenticated = false;
                        state.isLoading = false;
                        state.isInitialized = true;
                        state.error = 'Sessão expirada, faça login novamente';
                    });
                }
            },

            async refreshUser() {
                const { user } = get();
                if (!user?.id) return;

                try {
                    const { data: userData } = await client.userService.findById(user.id);
                    set(state => {
                        state.user = userData;
                    });
                } catch (error) {
                    console.error('Failed to refresh user:', error);
                }
            },

            setUser(user: UserDTO | null) {
                set(state => {
                    state.user = user;
                    state.isAuthenticated = !!user;
                });
            },

            setError(error: string | null) {
                set(state => {
                    state.error = error;
                });
            },

            clearError() {
                set(state => {
                    state.error = null;
                });
            },
        })),
    ),
);
