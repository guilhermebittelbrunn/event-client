import FormattedError from './formattedError';

export function handleClientError(error: any): string {
    if (error instanceof FormattedError) {
        return error.message;
    }
    console.error(`Error`, error);
    return 'Um erro inesperado aconteceu';
}
