import { AxiosInstance } from 'axios';

export default class WebhookService {
    private readonly baseUrl = '/webhook';

    constructor(private readonly client: AxiosInstance) {}

    async processPayment(dto: any): Promise<void> {
        await this.client.post<void>(`${this.baseUrl}/payment/process-payment`, dto);
    }
}
