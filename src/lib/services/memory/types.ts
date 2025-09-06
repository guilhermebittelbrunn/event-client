import { MemoryDTO } from '@/shared/types/dtos/memory/memory';
import { PaginationRequestWithOrder } from '@/shared/types/utils';

export interface CreateMemoryRequest {
    identifier?: string;
    description?: string;
    message?: string;
    image?: File;
}

export interface CreateMemoryResponse {
    data: MemoryDTO;
}

export interface ListPaginatedMemoryRequest extends PaginationRequestWithOrder<MemoryDTO> {
    eventId: string;
}

export interface FindMemoryByIdResponse {
    data: MemoryDTO;
}

export interface FindMemoryByIdForGuestResponse {
    data: MemoryDTO;
}

export interface DownloadMemoriesRequest {
    memoryIds: string[];
}

export interface DownloadMemoriesResponse {
    data: Blob;
}
