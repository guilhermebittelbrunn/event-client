import React from 'react';
import { Box, Button } from '@/shared/components/ui';
import { TrashBinIcon, DownloadIcon } from '@/shared/icons';
import { cn } from '@/shared/utils';
import { useMemoryCrud } from '@/shared/hooks/useMemoryCrud';

interface ActionBarProps {
    isSelectMode: boolean;
    selectedCount: number;
    onToggleSelect: () => void;
    onDelete: () => void;
    onDownload: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    isSelectMode,
    selectedCount,
    onToggleSelect,
    onDelete,
    onDownload,
}) => {
    const { downloadMemoryMutation } = useMemoryCrud();

    return (
        <Box>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onDelete}
                        disabled={!isSelectMode || selectedCount === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <TrashBinIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </button>

                    <button
                        onClick={onDownload}
                        disabled={!isSelectMode || downloadMemoryMutation.isPending || selectedCount === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <DownloadIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </button>
                </div>

                <Button
                    type={isSelectMode ? 'secondary' : 'primary'}
                    onClick={onToggleSelect}
                    className={cn(
                        'py-2 transition-colors duration-300 hover:opacity-90',
                        isSelectMode && 'px-6',
                    )}
                >
                    {isSelectMode ? 'Cancelar' : 'Selecionar'}
                    {isSelectMode && selectedCount > 0 && (
                        <span className="ml-2 bg-soft-gold text-white text-xs px-2 py-1 rounded-full">
                            {selectedCount}
                        </span>
                    )}
                </Button>
            </div>
        </Box>
    );
};
