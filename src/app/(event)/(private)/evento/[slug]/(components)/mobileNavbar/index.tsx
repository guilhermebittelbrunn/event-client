import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CameraOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { cn } from '@/shared/utils';

interface MobileNavbarProps {
    className?: string;
}

export default function MobileNavbar({ className = '' }: MobileNavbarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            icon: <HomeOutlined className="scale-150" />,
            path: '/',
            active: pathname === '/',
        },
        {
            icon: <CameraOutlined className="scale-150" />,
            path: '/evento',
            active: pathname.startsWith('/evento'),
        },
        {
            icon: <UserOutlined className="scale-150" />,
            path: '/entrar',
            active: pathname === '/entrar' || pathname === '/cadastrar',
        },
    ];

    return (
        <nav
            className={cn(
                `fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-matte-black border-t border-gray-200 dark:border-gray-700`,
                className,
            )}
        >
            <div className="flex justify-around items-center py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                            item.active
                                ? 'text-soft-gold dark:text-soft-gold-dark bg-blue-50 dark:bg-soft-gold/20 px-4'
                                : 'text-gray-600 dark:text-gray-400 hover:text-soft-gold dark:hover:text-soft-gold-dark'
                        }`}
                    >
                        <div className="mb-1">{item.icon}</div>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
