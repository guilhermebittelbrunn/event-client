'use client';

import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useAlert = () => {
    const { theme } = useTheme();
    const toastTheme = theme === 'dark' ? 'dark' : 'light';

    const openNotification = (type: NotificationType, message: string) => {
        toast[type](message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: toastTheme,
        });
    };

    const successAlert = (message: string) => {
        openNotification('success', message);
    };

    const infoAlert = (message: string) => {
        openNotification('info', message);
    };

    const warningAlert = (message: string) => {
        openNotification('warning', message);
    };

    const errorAlert = (message: string) => {
        openNotification('error', message);
    };

    return { successAlert, infoAlert, warningAlert, errorAlert };
};

export default useAlert;
