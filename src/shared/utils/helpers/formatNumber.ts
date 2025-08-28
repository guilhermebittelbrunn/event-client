export function formatPrice(
    price: number | undefined,
    decimalScale = 2,
    locale = 'pt-BR',
    options?: Intl.NumberFormatOptions,
): string {
    return Intl.NumberFormat(locale, {
        style: 'decimal',
        currency: 'BRL',
        minimumFractionDigits: decimalScale,
        maximumFractionDigits: decimalScale,
        ...options,
    }).format(price || 0);
}

export function formatNumber(
    number: number | undefined,
    decimalScale = 2,
    locale = 'pt-BR',
    options?: Intl.NumberFormatOptions,
): string {
    return Intl.NumberFormat(locale, {
        style: 'decimal',
        maximumFractionDigits: decimalScale,
        ...options,
    }).format(number || 0);
}

export function roundTwoCases(value: number): number {
    return +`${Math.round(`${value}e+2` as never)}e-2`;
}

export function roundNoCases(value: number): number {
    return +`${Math.round(`${value}e+0` as never)}e-0`;
}

export function roundNumber1Decimal(value: number) {
    return +`${Math.round(`${value}e+1` as never)}e-1`;
}

export const roundValue = (value: number): number => {
    let cents = Number((value - Math.trunc(value)).toFixed(2));

    if (cents >= 0 && cents <= 0.49) {
        cents = 0;
    } else if (cents >= 0.5 && cents <= 0.9) {
        cents = 0.5;
    } else {
        cents = 1;
    }

    return Math.trunc(value) + cents;
};
