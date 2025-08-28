import { BaseDTO } from '../../utils';

export interface FileDTO extends BaseDTO {
    name: string;

    path: string;

    size: number;

    url: string;
}
