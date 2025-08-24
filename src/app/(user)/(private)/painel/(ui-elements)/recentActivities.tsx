import React from 'react';
import { Container } from '@/shared/components/ui/container';

const notificationsMock: any[] = [
    {
        title: 'Maria Silva aprovou a adoção de Luna',
        type: 'success',
        createdAt: new Date(),
        description: 'Hoje, 10:45',
    },
    {
        title: 'Pedro Alves adicionou um novo animal: Simba (Gato, 3 anos)',
        type: 'info',
        createdAt: new Date(),
        description: 'Hoje, 09:12',
    },
    {
        title: 'Ana Costa submeteu uma nova requisição de adoção',
        type: 'info',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: 'Ontem, 15:30',
    },
    {
        title: 'Carlos Mendes recusou a adoção de Thor',
        type: 'error',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: 'Ontem, 11:20',
    },
];

export default function RecentActivities() {
    return (
        <div className="col-span-12 space-y-5 sm:space-y-6">
            <Container title="Atividades Recentes">
                <div className="divide-y divide-gray-100">
                    {notificationsMock.map((notification, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <div>
                                <div className="font-medium text-md text-gray-900 max-sm:text-sm dark:text-white">
                                    {notification.title}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">{notification.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
