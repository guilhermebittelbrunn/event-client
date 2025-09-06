import { MemoryDTO } from '@/shared/types/dtos/memory/memory';

export interface CreateMemoryRequest {
    identifier?: string;
    description?: string;
    message?: string;
    image?: File;
}

export interface CreateMemoryResponse {
    data: MemoryDTO;
}
