export interface BaseDTO {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface PaginationRequest {
    page?: number;
    limit?: number;
    term?: string;
}

export interface PaginationRequestWithOrder<T extends object = object> extends PaginationRequest {
    order?: 'asc' | 'desc';
    orderBy?: keyof T;
}

export interface PaginationRequestWithOrderAndDate<T extends object = object>
    extends PaginationRequestWithOrder<T> {
    dateType?: keyof T;
    startDate?: Date;
    endDate?: Date;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export type RawId = string;

export type UpdateRequest<T> = Partial<Omit<T, 'id'>>;

export interface UpdateResponse {
    data: {
        id: RawId;
    };
}
