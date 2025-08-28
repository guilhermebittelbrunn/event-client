/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authService } from '@/lib/services';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import useAlert from './useAlert';
import { useRedirect } from './useRedirect';
import { handleClientError } from '../utils';
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '@/lib/services/auth/types';
import { createContext, useContext, useEffect, useState } from 'react';
import client from '@/lib/client';
import { UserDTO } from '../types/dtos';
import { userService } from '@/lib/services/user';
import { localStorage } from '../utils/helpers/localStorage';
import { LoadingScreen } from '../components/ui';

interface AuthContextData {
    authenticating: boolean;
    isAuthenticated: boolean;
    user?: UserDTO;
    signInMutation: UseMutationResult<SignInResponse, any, SignInRequest, unknown>;
    signUpMutation: UseMutationResult<UserDTO, any, SignUpRequest, unknown>;
    signOut(): void;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDTO | undefined>(undefined);
    const [authenticating, setAuthenticating] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const { successAlert, errorAlert, warningAlert } = useAlert();
    const { redirectWithDelay, redirect, isMounted } = useRedirect();

    const signInMutation = useMutation({
        mutationFn(data: SignInRequest) {
            setAuthenticating(true);
            return authService.signIn(data);
        },
        onSuccess: ({ data }: SignInResponse) => {
            localStorage.setUser(data.user);
            setUser(data.user);
            successAlert('Login realizado com sucesso');
            redirectWithDelay('/painel', 300);
            setAuthenticating(false);
        },
        onError: (error) => {
            setAuthenticating(false);
            errorAlert(handleClientError(error));
        },
    });

    const signUpMutation = useMutation({
        mutationFn(data: SignUpRequest) {
            setAuthenticating(true);
            return authService.signUp(data);
        },
        onSuccess: () => {
            successAlert('Cadastro realizado com sucesso');
            redirectWithDelay('/entrar', 600);
            setAuthenticating(false);
        },
        onError: (error) => {
            setAuthenticating(false);
            errorAlert(handleClientError(error));
        },
    });

    const signOut = () => {
        console.log('signOut');
        client.removeHeader('Authorization');
        client.removeHeader('Refresh');
        localStorage.clearUser();
        setUser(undefined);
        setAuthenticating(false);
        redirect('/');
    };

    const getUserMutation = useMutation({
        mutationFn(id: string) {
            return userService.findById(id);
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const userId = localStorage.getUser()?.id;

        if (userId) {
            (async () => {
                try {
                    const user = await getUserMutation.mutateAsync(userId);
                    console.log('user :>> ', user);
                    setUser(user.data);
                } catch (error) {
                    warningAlert('Sessão expirada, faça login novamente');
                    signOut();
                } finally {
                    setAuthenticating(false);
                }
            })();
        } else {
            setAuthenticating(false);
        }
    }, [isClient]);

    useEffect(() => {
        if (user) {
            localStorage.setUser(user);
        }
    }, [user]);

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
            {!isClient || authenticating ? <LoadingScreen loading={authenticating} /> : children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('Auth must be used within a provider');
    }

    return context;
}
