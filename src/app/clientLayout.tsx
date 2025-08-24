'use client';

import { useTheme } from '@/shared/context/ThemeContext';
import { ConfigProvider, theme as themeAntd } from 'antd';
import ptBR from 'antd/locale/pt_BR';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const { defaultAlgorithm, darkAlgorithm } = themeAntd;

    const customTheme = {
        token: {
            colorPrimary: '#3C50E0',
            colorBgContainer: theme === 'dark' ? '#191F2D' : '#FFFFFF',
            colorBgElevated: theme === 'dark' ? '#191F2D' : '#FFFFFF',
            colorText: theme === 'dark' ? '#E2E8F0' : '#191F2D',
            colorTextSecondary: theme === 'dark' ? '#191F2D' : '#64748B',
            colorBorder: theme === 'dark' ? '#191F2D' : '#E2E8F0',
            borderColor: theme === 'dark' ? '#1F2938' : '#E2E8F0',
            colorBorderSecondary: theme === 'dark' ? '#191F2D' : '#F1F5F9',
            colorFill: theme === 'dark' ? '#191F2D' : '#F8FAFC',
            colorFillSecondary: theme === 'dark' ? '#191F2D' : '#F1F5F9',
            colorBgLayout: theme === 'dark' ? '#191F2D' : '#F8FAFC',
            borderRadius: 6,
            colorSuccess: '#10B981',
            colorWarning: '#F59E0B',
            colorError: '#EF4444',
            colorInfo: '#3C50E0',
        },
        components: {
            Table: {
                headerBg: theme === 'dark' ? '#1b2330' : '#E2E8F0',
                borderColor: theme === 'dark' ? '#1F2938' : '#E2E8F0',
            },
            Input: {
                colorBgContainer: theme === 'dark' ? '#191F2D' : '#FFFFFF',
                algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                colorText: theme === 'dark' ? '#E2E8F0' : '#191F2D',
                colorTextSecondary: theme === 'dark' ? '#191F2D' : '#64748B',
                colorBorder: theme === 'dark' ? '#374151' : '#E2E8F0',
                colorBorderSecondary: theme === 'dark' ? '#191F2D' : '#F1F5F9',
                colorFill: theme === 'dark' ? '#191F2D' : '#F8FAFC',
            },
            Select: {
                colorBgContainer: theme === 'dark' ? '#191F2D' : '#FFFFFF',
                algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                colorText: theme === 'dark' ? '#E2E8F0' : '#191F2D',
                colorTextSecondary: theme === 'dark' ? '#191F2D' : '#64748B',
                colorBorder: theme === 'dark' ? '#374151' : '#E2E8F0',
                colorBorderSecondary: theme === 'dark' ? '#191F2D' : '#F1F5F9',
                colorFill: theme === 'dark' ? '#191F2D' : '#F8FAFC',
            },
            Upload: {
                colorBgContainer: theme === 'dark' ? '#191F2D' : '#FFFFFF',
                algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                colorText: theme === 'dark' ? '#E2E8F0' : '#191F2D',
                colorTextSecondary: theme === 'dark' ? '#191F2D' : '#64748B',
                colorBorder: theme === 'dark' ? '#374151' : '#E2E8F0',
            },
        },
    };

    return (
        <ConfigProvider
            locale={ptBR}
            theme={{
                algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                ...customTheme,
            }}
        >
            {children}
        </ConfigProvider>
    );
}
