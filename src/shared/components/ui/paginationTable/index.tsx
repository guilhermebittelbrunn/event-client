'use client';
import { Table, TableProps } from '../table';
import { PaginationMeta } from '@/shared/types/utils';
import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface PaginationTableProps<T> extends TableProps<T> {
    data: T[];
    meta?: PaginationMeta;
    columns: any[];
    label?: string;
    isLoading: boolean;
    /**
     * Enable URL-based sorting (default: true)
     * When true, sorting state is synced with URL query params
     */
    useUrlSort?: boolean;
}

export function PaginationTable<T>(props: PaginationTableProps<T>) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get current values from URL
    const currentPage = Number(searchParams.get('page')) || 1;
    const currentLimit = Number(searchParams.get('limit')) || 10;
    const currentOrder = searchParams.get('order') || '';
    const currentOrderBy = searchParams.get('orderBy') || '';

    const {
        className,
        meta,
        label = 'registros',
        data,
        columns,
        isLoading,
        onChange,
        useUrlSort = true,
        ...rest
    } = props;

    // Track if component is mounted to prevent initial render issues
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    // Create sorted columns with current sort state
    const sortedColumns = useMemo(() => {
        if (!useUrlSort) {
            return columns;
        }

        return columns.map((col: any) => {
            if (!col.sorter) return col;

            // Set sortOrder based on URL params
            // If no order or orderBy in URL, don't apply any sort
            const isSorted =
                currentOrder && currentOrderBy && currentOrderBy === String(col.key || col.dataIndex);
            const sortOrder = isSorted ? (currentOrder === 'asc' ? 'ascend' : 'descend') : undefined;

            return {
                ...col,
                sortOrder,
            };
        });
    }, [columns, currentOrder, currentOrderBy, useUrlSort]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: any,
        sorter: SorterResult<T> | SorterResult<T>[],
        extra: any,
    ) => {
        if (!isMounted.current) {
            return;
        }

        // Only handle pagination and sort actions
        if (extra.action !== 'paginate' && extra.action !== 'sort') {
            onChange?.(pagination, filters, sorter, extra);
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        let hasChanges = false;

        // Handle pagination changes
        if (extra.action === 'paginate') {
            const newPage = pagination.current || 1;
            const newLimit = pagination.pageSize || 10;

            if (newPage !== currentPage) {
                params.set('page', String(newPage));
                hasChanges = true;
            }
            if (newLimit !== currentLimit) {
                params.set('limit', String(newLimit));
                hasChanges = true;
            }
        }

        // Handle sorting - only when action is 'sort'
        if (useUrlSort && !Array.isArray(sorter) && extra.action === 'sort') {
            if (sorter.order && sorter.columnKey) {
                // User clicked on a column to sort
                const newOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
                const newOrderBy = String(sorter.columnKey);

                if (newOrder !== currentOrder) {
                    params.set('order', newOrder);
                    hasChanges = true;
                }
                if (newOrderBy !== currentOrderBy) {
                    params.set('orderBy', newOrderBy);
                    hasChanges = true;
                }
            } else {
                // User clicked to remove sorting (third click)
                if (currentOrder) {
                    params.delete('order');
                    hasChanges = true;
                }
                if (currentOrderBy) {
                    params.delete('orderBy');
                    hasChanges = true;
                }
            }
        }

        // Only update URL if there are actual changes
        if (hasChanges) {
            router.push(`?${params.toString()}`);
        }

        // Call parent onChange if provided
        onChange?.(pagination, filters, sorter, extra);
    };

    return (
        <Table
            className={className}
            dataSource={data}
            columns={sortedColumns}
            loading={isLoading}
            rowKey={(record: any) => record.id || record.key || JSON.stringify(record)}
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
