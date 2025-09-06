import { useState, useEffect } from 'react';

interface ResponsiveLimitConfig {
    mobile: number;
    lg: number;
    xl: number;
}

const defaultConfig: ResponsiveLimitConfig = {
    mobile: 9,
    lg: 12,
    xl: 15,
};

export const useResponsiveLimit = (config: ResponsiveLimitConfig = defaultConfig) => {
    const [limit, setLimit] = useState(config.mobile);

    useEffect(() => {
        const updateLimit = () => {
            const width = window.innerWidth;

            if (width >= 1280) {
                // xl: 1280px+
                setLimit(config.xl);
            } else if (width >= 1024) {
                // lg: 1024px+
                setLimit(config.lg);
            } else {
                // mobile: <1024px
                setLimit(config.mobile);
            }
        };

        updateLimit();

        window.addEventListener('resize', updateLimit);

        return () => window.removeEventListener('resize', updateLimit);
    }, [config]);

    return limit;
};

export default useResponsiveLimit;
