import { MemoryDTO } from '@/shared/types/dtos/memory/memory';
import { PaginationRequestWithOrder, UpdateRequest } from '@/shared/types/utils';

export interface CreateMemoryRequest {
    identifier?: string;
    description?: string;
    message?: string;
    image?: File;
}

export type UpdateMemoryRequest = UpdateRequest<CreateMemoryRequest>;

export interface UpdateMemoryBulkRequest {
    memories: UpdateMemoryRequest[];
}

export interface CreateMemoryResponse {
    data: MemoryDTO;
}

export interface ListPaginatedMemoryRequest extends PaginationRequestWithOrder<MemoryDTO> {
    eventId: string;
    hidden?: boolean;
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
