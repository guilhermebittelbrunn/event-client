import { AxiosError } from 'axios';
import FormattedError from './formattedError';

export function handleClientError(error: any): string {
    if (error instanceof FormattedError) {
        return error.message;
    }

    if (error instanceof AxiosError) {
        const message = error.response?.data?.message;
        if (message) {
            return Array.isArray(message) ? message.join(', ') : message;
        }

        if (error.response?.status) {
            return `${error.response.status} - ${error.response.statusText || 'Erro na requisição'}`;
        }

        return error.message || 'Erro na requisição';
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (error?.message) {
        return error.message;
    }

    console.error(`Error`, error);
    return 'Um erro inesperado aconteceu';
}
