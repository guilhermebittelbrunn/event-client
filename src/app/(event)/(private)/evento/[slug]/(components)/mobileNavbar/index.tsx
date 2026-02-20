import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { CameraOutlined, PictureOutlined } from '@ant-design/icons';
import { cn } from '@/shared/utils';
import useEvent from '@/shared/context/EventContext';
import { usePathname } from 'next/navigation';
import { isBefore } from 'date-fns';

interface MobileNavbarProps {
    className?: string;
}

export default function MobileNavbar({ className = '' }: MobileNavbarProps) {
    const { event } = useEvent();
    const pathname = usePathname();

    const basePath = `/evento/${event?.slug}`;

    const navItems = useMemo(() => {
        const actions = [
            {
                icon: <PictureOutlined className="scale-150" />,
                path: `${basePath}/fotos`,
            },
        ];

        if (event?.endAt && isBefore(new Date(), event?.endAt)) {
            actions.push({
                icon: <CameraOutlined className="scale-150" />,
                path: basePath,
            });
        }

        return actions;
    }, [basePath, event]);

    const getAllPaths = useCallback(() => {
        return navItems.map(item => item.path);
    }, [navItems]);

    const isActive = useCallback(
        (path: string) => {
            // Exact match
            if (pathname === path) return true;

            // Check if current path is a child route
            if (pathname.startsWith(path + '/')) {
                // Check if there's a more specific path that also matches
                const allPaths = getAllPaths();
                const hasMoreSpecificMatch = allPaths.some(
                    otherPath =>
                        otherPath !== path &&
                        otherPath.length > path.length &&
                        (pathname === otherPath || pathname.startsWith(otherPath + '/')),
                );
                return !hasMoreSpecificMatch;
            }

            return false;
        },
        [pathname, getAllPaths],
    );

    return (
        <nav
            className={cn(
                `fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-matte-black border-t border-gray-200 dark:border-gray-700`,
                className,
            )}
        >
            <div className="flex justify-around items-center py-2">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                            isActive(item.path)
                                ? 'text-soft-gold dark:text-soft-gold-dark bg-snow-white dark:bg-soft-gold/[0.36] px-4'
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
