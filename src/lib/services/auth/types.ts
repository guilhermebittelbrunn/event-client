import { UserDTO } from '@/shared/types/dtos';
import { TokenDTO } from '@/shared/types/dtos/user/auth';

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export type SignUpResponse = {
    data: {
        user: UserDTO;
    };
};

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    data: {
        user: UserDTO;
        tokens: TokenDTO;
    };
}
