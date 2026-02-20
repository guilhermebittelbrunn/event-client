import { InputNumber as AntdInput, InputNumberProps as AntdInputProps } from 'antd';
import { cn } from '@/shared/utils/helpers/cn';
import { Label } from '../label';
import { ErrorBadge } from '../../ui';

export type InputDecimalProps = AntdInputProps & {
    label?: string;
    required?: boolean;
    error?: any;
    showErrorBadge?: boolean;
    currency?: boolean;
};

/** Formata número para BRL: 2 decimais, vírgula decimal, ponto milhar. Valor em reais. */
function formatBRL(value: string | number | null | undefined, withCurrency: boolean): string {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (Number.isNaN(num)) return '';
    const fixed = num.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const result = `${withThousands},${decPart}`;
    return withCurrency ? `R$ ${result}` : result;
}

/** Interpreta string como centavos: só dígitos, depois divide por 100. Retorna null se vazio. */
function parseCents(value: string | undefined): number | null {
    if (value === undefined || value === null) return null;
    const digits = value.replace(/\D/g, '');
    if (digits === '') return null;
    return parseInt(digits, 10) / 100;
}

export function InputDecimal({
    className,
    label,
    required,
    id,
    placeholder,
    size = 'large',
    error,
    showErrorBadge = true,
    currency = false,
    min,
    defaultValue,
    ...props
}: InputDecimalProps) {
    const formatter = (value: string | number | null | undefined) => formatBRL(value, currency);

    const parser: AntdInputProps<number>['parser'] = value => {
        const parsed = parseCents(value);
        if (parsed === null) return null as unknown as number;
        const minNum = min != null ? Number(min) : null;
        if (minNum !== null && parsed < minNum) return minNum as unknown as number;
        return parsed as unknown as number;
    };

    const defaultPlaceholder = currency ? 'R$ 0,00' : '0,00';
    const resolvedPlaceholder = placeholder ?? defaultPlaceholder;

    return (
        <>
            {label && (
                <Label required={required} htmlFor={id} className="text-matte-black dark:text-snow-white">
                    {label}
                </Label>
            )}

            <ErrorBadge hidden={!error || !showErrorBadge} message={error?.message || 'Campo inválido'}>
                <AntdInput
                    id={id}
                    size={size}
                    placeholder={resolvedPlaceholder}
                    precision={2}
                    min={min}
                    defaultValue={defaultValue}
                    formatter={formatter}
                    parser={parser}
                    className={cn(
                        `h-11 w-full rounded-lg border appearance-none border-gray-200 px-1 pt-0.5 text-md shadow-theme-xs bg-snow-white placeholder:text-gray-400 focus:outline-hidden focus:ring-3
                        dark:bg-matte-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800
                        dark:border-gray-700 `,
                        error && 'border-red-600 dark:border-red-900',
                        className,
                    )}
                    {...props}
                />
            </ErrorBadge>
        </>
    );
}
