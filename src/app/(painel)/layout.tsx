'use client';

import { AuthProvider } from '@/shared/context/AuthContext';

export default function PainelLayout({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
