import { UserDTO, UserTypeEnum } from '@/shared/types/dtos';
import { PaginationRequest } from '@/shared/types/utils';

export interface FindUserByIdResponse {
    data: UserDTO;
}

export interface ListPaginatedUserRequest extends PaginationRequest {
    types?: UserTypeEnum[];
}
