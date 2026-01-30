import { EventDTO } from '@/shared/types/dtos';
import { createContext, useContext } from 'react';

interface EventPageContextData {
    event?: EventDTO;
}

export const EventPageContext = createContext<EventPageContextData | undefined>(undefined);

export const useEventPage = () => {
    const context = useContext(EventPageContext);
    if (!context) {
        throw new Error('useEventPage must be used within an EventPageProvider');
    }
    return context;
};

export const EventPageProvider = ({ children, event }: { children: React.ReactNode; event?: EventDTO }) => {
    return <EventPageContext.Provider value={{ event }}>{children}</EventPageContext.Provider>;
};
