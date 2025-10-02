import axios from 'axios';

export default class FormattedError {
    public message: string;

    public status: number;

    constructor(error: unknown) {
        this.message = this.formatMessage(error);
        this.status = this.formatStatus(error);
    }

    static async create(error: unknown): Promise<FormattedError> {
        const formattedError = new FormattedError(error);

        if (formattedError.isBlobError(error)) {
            try {
                if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);
                    formattedError.message = errorData.message || 'Erro no download';
                }
            } catch {
                if (axios.isAxiosError(error)) {
                    formattedError.message = `${error.response?.status} - ${error.response?.statusText || 'Erro na requisição'}`;
                }
            }
        }

        return formattedError;
    }

    private isBlobError(error: unknown): boolean {
        return (
            axios.isAxiosError(error) &&
            error.config?.responseType === 'blob' &&
            error.response?.data instanceof Blob
        );
    }

    formatMessage(error: unknown): string {
        const fallbackMessage = 'Um erro inesperado aconteceu';

        if (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const responseError = error.response;

                    if (responseError.status === 413) {
                        return 'Tamanho do arquivo muito grande.';
                    }

                    if (responseError.data) {
                        if (responseError.data.message) {
                            if (Array.isArray(responseError.data.message)) {
                                return responseError.data.message.join(', ');
                            }
                            return responseError.data.message;
                        }

                        if (responseError.data.error) {
                            return responseError.data.error;
                        }

                        if (typeof responseError.data === 'string') {
                            return responseError.data;
                        }

                        if (typeof responseError.data === 'object') {
                            const errorText = JSON.stringify(responseError.data);
                            if (errorText !== '{}') {
                                return errorText;
                            }
                        }
                    }

                    return `${responseError.status} - ${responseError.statusText || 'Erro na requisição'}`;
                }

                return error.message || 'Erro na requisição';
            }

            if (error instanceof Error) {
                return error.message;
            }
        }

        console.error(error);

        return fallbackMessage;
    }

    formatStatus(error: unknown): number {
        const fallbackStatus = 500;

        if (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const responseError = error.response;

                    if (responseError.status) {
                        return responseError.status;
                    }
                }
            }
        }

        return fallbackStatus;
    }
}
