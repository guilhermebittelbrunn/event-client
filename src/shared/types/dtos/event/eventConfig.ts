import { BaseDTO } from '../../utils';

export interface EventConfigDTO extends BaseDTO {
    eventId: string;

    primaryColor: string;

    secondaryColor: string;

    primaryContrast: string;

    secondaryContrast: string;

    backgroundColor: string;

    backgroundContrast: string;

    textColorPrimary: string;

    textColorSecondary: string;

    welcomeMessage: string;
}
