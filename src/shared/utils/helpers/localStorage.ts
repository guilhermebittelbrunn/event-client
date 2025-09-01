import { EventDTO, UserDTO } from '@/shared/types/dtos';
import CryptoJS from 'crypto-js';
import storageKeys from './storageKeys';

function setItem(name: string, value: any) {
    const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        process.env.NEXT_PUBLIC_TOKEN_CRYPTO as string,
    );

    return sessionStorage.setItem(name, encryptedValue.toString());
}

function decryptLocalStorageData(data: string): any {
    try {
        const bytes = CryptoJS.AES.decrypt(data.toString(), process.env.NEXT_PUBLIC_TOKEN_CRYPTO as string);
        const bytesStr = bytes.toString(CryptoJS.enc.Utf8);

        if (!bytesStr) {
            return bytesStr;
        }

        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return decryptedData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getItem(name: string) {
    const rawValue = sessionStorage.getItem(name);

    if (rawValue) {
        return decryptLocalStorageData(rawValue);
    }

    return null;
}

function removeItem(name: string) {
    sessionStorage.removeItem(name);
}

const clearUser = () => {
    localStorage.removeItem(storageKeys.USER_ID);
};

const removeEvent = () => {
    localStorage.removeItem(storageKeys.EVENT_ID);
};

const setUser = (user: UserDTO) => {
    localStorage.setItem(storageKeys.USER_ID, JSON.stringify(user));
};

const setEvent = (event: EventDTO) => {
    localStorage.setItem(storageKeys.EVENT_ID, JSON.stringify(event));
};

const getUser = (): UserDTO | undefined => {
    const user = localStorage.getItem(storageKeys.USER_ID);

    if (!user) {
        return undefined;
    }

    const userData: UserDTO = JSON.parse(user);

    return userData;
};

const getEvent = (): EventDTO | undefined => {
    const event = localStorage.getItem(storageKeys.EVENT_ID);

    if (!event) {
        return undefined;
    }

    const eventData: EventDTO = JSON.parse(event);

    return eventData;
};

export const localStorage = {
    setItem,
    getItem,
    removeItem,
    setUser,
    getUser,
    clearUser,
    setEvent,
    getEvent,
    removeEvent,
};
