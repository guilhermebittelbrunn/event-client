'use client';

import { useSearchParams } from 'next/navigation';

const usePagination = () => {
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentLimit = Number(searchParams.get('limit')) || 10;
    const currentTerm = searchParams.get('term') || undefined;

    return { currentPage, currentTerm, currentLimit };
};

export default usePagination;
