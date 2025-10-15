import { filledArray, isEmpty } from '@/shared/utils/helpers/undefinedHelpers';

export class BaseService {
    protected buildQueryProperties(query?: Record<string, any>): string {
        if (!query || typeof query !== 'object') {
            return '';
        }

        return Object.entries(query)
            .flatMap(([key, value]: [string, any]) => {
                if (filledArray(value)) {
                    return `${key}=${value.join(',')}`;
                }
                if (!isEmpty(value) && !Array.isArray(value)) {
                    return `${key}=${encodeURIComponent(value)}`;
                }
                return [];
            })
            .join('&');
    }
}
