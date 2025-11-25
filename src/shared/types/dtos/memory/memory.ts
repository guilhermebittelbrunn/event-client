import { BaseDTO } from '../../utils';
import { FileDTO } from '../shared';

export interface MemoryDTO extends BaseDTO {
    eventId: string;

    fileId: string | null;

    identifier?: string;

    description?: string;

    message?: string;

    hidden?: boolean;

    file?: FileDTO;
}
