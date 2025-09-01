'use client';
import usePagination from '@/shared/hooks/usePagination';
import { Table, TableProps } from '../table';
import { PaginationMeta } from '@/shared/types/utils';
import { useSearchParams } from 'next/navigation';
import { TablePaginationConfig } from 'antd';
import { useClientRouter } from '@/shared/hooks';

interface PaginationTableProps<T> extends TableProps<T> {
    data: T[];
    meta?: PaginationMeta;
    columns: any[];
    label?: string;
    isLoading: boolean;
}

export function PaginationTable<T>(props: PaginationTableProps<T>) {
    const searchParams = useSearchParams();
    const { currentPage, currentLimit } = usePagination();
    const router = useClientRouter();

    const { className, meta, label = 'registros', data, columns, isLoading, ...rest } = props;

    const handleTableChange = (pagination: TablePaginationConfig) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pagination.current?.toString() || '1');
        params.set('limit', pagination.pageSize?.toString() || '10');
        router.push(`?${params.toString()}`);
    };

    return (
        <Table
            className={className}
            dataSource={data}
            columns={columns}
            loading={isLoading}
            scroll={{ x: 'max-content' }}
            pagination={{
                position: ['bottomRight'],
                current: currentPage,
                pageSize: currentLimit,
                responsive: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} ${label}`,
                total: meta?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 25],
            }}
            onChange={handleTableChange}
            {...rest}
        />
    );
}
