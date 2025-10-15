'use client';

import { AuthInitializer } from '@/shared/components/auth/AuthInitializer';

export default function PainelLayout({ children }) {
    return <AuthInitializer>{children}</AuthInitializer>;
}
