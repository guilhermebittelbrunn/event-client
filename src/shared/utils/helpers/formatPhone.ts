import applyStringMask from './applyStringMask';

export const PHONE_MASKS = {
    cellphone: '(__) _ ____-____',
    telephone: '(__) ____-____',
    freeDirectDialingPhone: '____ ___ ____',
};

export default function formatPhone(phone: string): string {
    return phone.length > 10
        ? phone.startsWith('0800')
            ? applyStringMask(phone, PHONE_MASKS.freeDirectDialingPhone)
            : applyStringMask(phone, PHONE_MASKS.cellphone)
        : applyStringMask(phone, PHONE_MASKS.telephone);
}
