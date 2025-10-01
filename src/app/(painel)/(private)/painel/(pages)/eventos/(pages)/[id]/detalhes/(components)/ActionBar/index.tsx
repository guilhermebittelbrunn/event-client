import React from 'react';
import { Box, Button, Title } from '@/shared/components/ui';
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
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <TrashBinIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </button>

                    <button
                        onClick={onDownload}
                        disabled={!isSelectMode || downloadMemoryMutation.isPending || selectedCount === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <DownloadIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </button>
                </div>

                {isSelectMode && selectedCount > 0 && (
                    <div className="flex-row flex gap-2">
                        <Title className="text-md border border-soft-gold px-3 py-1 rounded-full md:border-none md:px-0 md:py-0">
                            <span className="text-soft-gold">{selectedCount}</span>
                        </Title>
                        <Title className="text-md md:block hidden">Fotos Selecionadas</Title>
                    </div>
                )}

                <Button
                    type={isSelectMode ? 'secondary' : 'primary'}
                    onClick={onToggleSelect}
                    className={cn(
                        'py-2 transition-colors duration-300 hover:opacity-90',
                        isSelectMode && 'px-[22px]',
                    )}
                >
                    {isSelectMode ? 'Cancelar' : 'Selecionar'}
                </Button>
            </div>
        </Box>
    );
};
