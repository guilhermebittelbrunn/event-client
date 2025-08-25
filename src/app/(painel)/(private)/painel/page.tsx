'use client';

import { Title, AddButton } from '@/shared/components/ui';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { EditFilled } from '@ant-design/icons';
import React from 'react';

// Mock de dados
const mockData = {
    data: {
        id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
        userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
        fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
        name: 'festival',
        slug: 'brava-fest7',
        status: 'draft',
        description: 'descrição qualquer',
        startAt: '2025-08-01T02:11:46.241Z',
        endAt: '2025-08-30T02:11:46.241Z',
        createdAt: '2025-08-25T01:20:05.917Z',
        updatedAt: '2025-08-25T01:20:05.917Z',
        deletedAt: null,
        config: {
            id: 'e585303c-c69e-4561-9500-312b00e265e6',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            primaryColor: '#000000',
            secondaryColor: '#000000',
            primaryContrast: '#ffffff',
            secondaryContrast: '#000000',
            backgroundColor: '#ffffff',
            backgroundContrast: '#f2f2f2',
            textColorPrimary: '#000000',
            textColorSecondary: '#000000',
            welcomeMessage: 'Bem-vindo ao nosso evento!',
        },
        guestAccess: {
            id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
            type: 'guest',
            createdAt: '2025-08-25T01:20:05.924Z',
            updatedAt: '2025-08-25T01:20:05.924Z',
            deletedAt: null,
        },
        file: {
            id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            size: 10288,
            url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
            createdAt: '2025-08-25T01:20:05.911Z',
            updatedAt: '2025-08-25T01:20:05.911Z',
            deletedAt: null,
        },
    },
};

const otherEvents = [
    {
        id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
        userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
        fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
        name: 'Reveillon 2026',
        slug: 'reveillon-2026',
        status: 'draft',
        description: 'descrição qualquer',
        startAt: '2025-08-01T02:11:46.241Z',
        endAt: '2025-08-30T02:11:46.241Z',
        createdAt: '2025-08-25T01:20:05.917Z',
        updatedAt: '2025-08-25T01:20:05.917Z',
        deletedAt: null,
        config: {
            id: 'e585303c-c69e-4561-9500-312b00e265e6',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            primaryColor: '#000000',
            secondaryColor: '#000000',
            primaryContrast: '#ffffff',
            secondaryContrast: '#000000',
            backgroundColor: '#ffffff',
            backgroundContrast: '#f2f2f2',
            textColorPrimary: '#000000',
            textColorSecondary: '#000000',
            welcomeMessage: 'Bem-vindo ao nosso evento!',
        },
        guestAccess: {
            id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
            type: 'guest',
            createdAt: '2025-08-25T01:20:05.924Z',
            updatedAt: '2025-08-25T01:20:05.924Z',
            deletedAt: null,
        },
        file: {
            id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            size: 10288,
            url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
            createdAt: '2025-08-25T01:20:05.911Z',
            updatedAt: '2025-08-25T01:20:05.911Z',
            deletedAt: null,
        },
    },
    {
        id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
        userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
        fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
        name: 'Festa do João',
        slug: 'festa-do-joao',
        status: 'draft',
        description: 'descrição qualquer',
        startAt: '2025-08-01T02:11:46.241Z',
        endAt: '2025-08-01T02:11:46.241Z',
        createdAt: '2025-08-25T01:20:05.917Z',
        updatedAt: '2025-08-25T01:20:05.917Z',
        deletedAt: null,
        config: {
            id: 'e585303c-c69e-4561-9500-312b00e265e6',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            primaryColor: '#000000',
            secondaryColor: '#000000',
            primaryContrast: '#ffffff',
            secondaryContrast: '#000000',
            backgroundColor: '#ffffff',
            backgroundContrast: '#f2f2f2',
            textColorPrimary: '#000000',
            textColorSecondary: '#000000',
            welcomeMessage: 'Bem-vindo ao nosso evento!',
        },
        guestAccess: {
            id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
            eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
            type: 'guest',
            createdAt: '2025-08-25T01:20:05.924Z',
            updatedAt: '2025-08-25T01:20:05.924Z',
            deletedAt: null,
        },
        file: {
            id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
            size: 10288,
            url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
            createdAt: '2025-08-25T01:20:05.911Z',
            updatedAt: '2025-08-25T01:20:05.911Z',
            deletedAt: null,
        },
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const calculateDaysLeft = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const EventCard = ({ event, detailed = false }: { event: any; detailed?: boolean }) => {
    const daysLeft = calculateDaysLeft(event.startAt);

    return (
        <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl shadow-lg p-4 flex gap-4">
            {detailed && (
                <div className="flex-shrink-0">
                    <ResponsiveImage
                        src={event.file.url}
                        alt={event.name}
                        width={120}
                        height={120}
                        className="w-30 h-30 object-cover rounded-lg"
                    />
                </div>
            )}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-neutral-800 dark:text-white text-lg mb-1">
                            {event.name}
                        </h3>
                        <EditFilled size={24} className="text-soft-gold dark:text-soft-gold-dark" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(event.startAt)}</p>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-soft-gold dark:text-soft-gold-dark text-sm">350</span>
                        <span className="dark:text-snow-white text-sm"> fotos</span>
                    </div>
                    <div>
                        <span className="text-soft-gold dark:text-soft-gold-dark text-sm">{daysLeft}</span>
                        <span className="dark:text-snow-white text-sm"> dias de armazenamento</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <div className="min-h-screen bg-snow-white dark:bg-matte-black">
            <div className="p-4 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Title className="text-xl font-bold text-neutral-800 dark:text-white">
                            Próximo evento
                        </Title>
                        <AddButton type="primary">Novo evento</AddButton>
                    </div>

                    <EventCard event={mockData.data} detailed />
                </div>

                <div className="space-y-4">
                    <Title className="text-xl font-bold text-neutral-800 dark:text-white">Outros eventos</Title>

                    <div className="space-y-3">
                        {otherEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
