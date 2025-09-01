import axios from 'axios';

export default class FormattedError {
    public message: string;

    public status: number;

    constructor(error: unknown) {
        this.message = this.formatMessage(error);
        this.status = this.formatStatus(error);
    }

    formatMessage(error: unknown): string {
        const fallbackMessage = 'Um erro inesperado aconteceu';

        if (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const responseError = error.response;

                    if (responseError.data && responseError.data.message) {
                        if (Array.isArray(responseError.data.message)) {
                            return responseError.data.message.join(', ');
                        }
                        return responseError.data.message;
                    }

                    return `${responseError.status} - ${responseError.statusText}`;
                }
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
