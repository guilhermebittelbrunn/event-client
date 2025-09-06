import { filledArray, isEmpty } from './undefinedHelpers';

export function buildQueryProperties(query?: Record<string, any>): string {
    if (!query || typeof query !== 'object') {
        return '';
    }

    return Object.entries(query)
        .flatMap(([key, value]: [string, any]) => {
            if (typeof value === 'object') {
                return `${key}=${buildQueryProperties(value)}`;
            }
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
