// import { intervalToDuration } from 'date-fns';

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        ...options,
    };

    if (typeof date === 'string' || typeof date === 'number') {
        return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
    }

    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(date);
}

export function formatDateTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        ...options,
    };

    if (typeof date === 'string' || typeof date === 'number') {
        return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
    }

    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(date).replace(/,/g, '');
}

export function formatTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        ...options,
    };

    if (typeof date === 'string' || typeof date === 'number') {
        return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
    }

    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(date);
}

// const safeTimeView = (time: number | undefined) => {
//   if (!time) {
//     return '00';
//   }

//   if (time < 10) {
//     return `0${time}`;
//   }

//   return time.toString();
// };

// export function formatTimeDiff(right: Date, left: Date): string {
//   const {
//     hours = 0,
//     minutes = 0,
//     seconds = 0,
//     days = 0,
//   } = intervalToDuration({
//     start: left,
//     end: right,
//   });

//   return `${safeTimeView(hours + days * 24)}:${safeTimeView(minutes)}:${safeTimeView(seconds)}`;
// }

export function weekdayMatches(weekday: number, toCompare = new Date().getDay()) {
    return weekday === toCompare;
}
