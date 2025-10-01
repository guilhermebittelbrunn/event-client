import React from 'react';
import { Box, Paragraph, Title } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';
import { EventDTO } from '@/shared/types/dtos';

interface EventHeaderProps {
    event: EventDTO;
    photoCount: number;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ event, photoCount }) => {
    return (
        <Box>
            <div className="flex items-start justify-between">
                <Box className="flex flex-col justify-start items-start gap-0">
                    <Title className="text-md text-matte-black dark:text-white">Gerenciando fotos</Title>
                    <Box className="flex gap-2 flex-row justify-end items-end ">
                        <Box className="flex gap-2 justify-start items-start ">
                            <Paragraph className="text-md py-0">{event.name}</Paragraph>
                            <Paragraph className="text-sm py-0">{formatDate(event.startAt)}</Paragraph>
                        </Box>
                        <Box className="flex gap-2 flex-row justify-end items-end ">
                            <Title primary className="text-lg inline">
                                {photoCount}
                            </Title>
                            <Title className="text-md inline">Fotos</Title>
                        </Box>
                    </Box>
                </Box>
            </div>
        </Box>
    );
};
