import client from '@/lib/client';
import ClientBase from '@/shared/client/base';
import { CreateEventRequest, CreateEventResponse } from './types';
import { formDataFromObject } from '@/shared/utils/helpers/formDataHelper';

export default class EventService {
    private readonly baseUrl = '/event';

    constructor(private readonly client: ClientBase) {}

    async create(dto: CreateEventRequest): Promise<CreateEventResponse> {
        const body: CreateEventRequest | FormData = formDataFromObject(dto);

        console.log('body :>> ', body);

        const { data } = await this.client.request<CreateEventResponse>(this.client.restClient, {
            url: `${this.baseUrl}`,
            method: 'POST',
            data: body,
        });

        console.log('data :>> ', data);

        return data;
    }

    async delete(id: string): Promise<void> {
        await this.client.request<void>(this.client.restClient, {
            url: `${this.baseUrl}/delete/${id}`,
            method: 'DELETE',
        });
    }
}

export const eventService = new EventService(client);
