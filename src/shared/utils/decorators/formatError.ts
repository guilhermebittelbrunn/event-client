import FormattedError from '../helpers/formattedError';

/**
 * Gets the error that was thrown by the request and format it into a {@link FormattedError}
 */
export function FormatError() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                throw new FormattedError(error);
            }
        };

        return descriptor;
    };
}
