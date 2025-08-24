'use client';

import { notification } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification/interface';
import React, { createContext, useContext } from 'react';

interface AlertContextProps {
    successAlert: (message: string, title?: string) => void;
    infoAlert: (message: string, title?: string) => void;
    warningAlert: (message: string, title?: string) => void;
    errorAlert: (message: string, title?: string) => void;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const AlertContext = createContext({} as AlertContextProps);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (
        type: NotificationType,
        message: string,
        title?: string,
        placement?: NotificationPlacement,
    ) => {
        api[type]({
            message: title || 'Notificação',
            description: message,
            placement,
            showProgress: true,
            pauseOnHover: true,
            duration: 3,
        });
    };

    const successAlert = (message: string, title?: string) => {
        openNotification('success', message, title);
    };

    const infoAlert = (message: string, title?: string) => {
        openNotification('info', message, title);
    };

    const warningAlert = (message: string, title?: string) => {
        openNotification('warning', message, title);
    };

    const errorAlert = (message: string, title?: string) => {
        openNotification('error', message, title);
    };

    return (
        <AlertContext.Provider value={{ successAlert, infoAlert, warningAlert, errorAlert }}>
            {contextHolder}
            {children}
        </AlertContext.Provider>
    );
};

export default function useAlert(): AlertContextProps {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error('Alert must be used within a provider');
    }

    return context;
}
