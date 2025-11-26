import { Button, Title } from '@/shared/components/ui';
import { TrashBinIcon, DownloadIcon, EyeCloseIcon, EyeIcon } from '@/shared/icons';
import { BiCameraMovie } from 'react-icons/bi';
import { cn } from '@/shared/utils';
import { useMemoryCrud } from '@/shared/hooks/useMemoryCrud';
import { isEmpty } from '@/shared/utils/helpers/undefinedHelpers';

interface ActionBarProps {
    isSelectMode: boolean;
    selectedCount: number;
    onToggleSelect: () => void;
    onDelete: () => void;
    onDownload: () => void;
    onChangeVisibility: (status: boolean) => void;
    onStartSlideshow?: () => void;
    single?: boolean;
    hidden?: boolean;
}

function ButtonAction({
    onClick,
    disabled,
    children,
    className,
}: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                className,
            )}
        >
            {children}
        </button>
    );
}

export const ActionBar = (props: ActionBarProps) => {
    const {
        isSelectMode,
        selectedCount,
        onToggleSelect,
        onDelete,
        onDownload,
        onChangeVisibility,
        onStartSlideshow,
        single,
        hidden,
    } = props;

    const { downloadMemoryMutation, changeBulkMemoryVisibilityMutation } = useMemoryCrud();

    const isLoading = downloadMemoryMutation.isPending || changeBulkMemoryVisibilityMutation.isPending;
    const disabled = single ? isLoading : !isSelectMode || isLoading || selectedCount === 0;
    const slideshowDisabled = isLoading || isSelectMode;

    return (
        <div>
            <div className="flex flex-col gap-2 items-center justify-between md:flex-row">
                <div className="flex items-center gap-6">
                    <ButtonAction onClick={onDelete} disabled={disabled}>
                        <TrashBinIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </ButtonAction>

                    <ButtonAction onClick={onDownload} disabled={disabled}>
                        <DownloadIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </ButtonAction>

                    <ButtonAction
                        onClick={() => onChangeVisibility(false)}
                        disabled={disabled}
                        className={cn(!isEmpty(hidden) && hidden && 'hidden')}
                    >
                        <EyeCloseIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </ButtonAction>

                    <ButtonAction
                        onClick={() => onChangeVisibility(true)}
                        disabled={disabled}
                        className={cn(!isEmpty(hidden) && !hidden && 'hidden')}
                    >
                        <EyeIcon className="text-soft-gold dark:text-soft-gold-dark scale-150" />
                    </ButtonAction>

                    {onStartSlideshow && (
                        <ButtonAction onClick={onStartSlideshow} disabled={slideshowDisabled} className="ml-2">
                            <BiCameraMovie className="text-soft-gold dark:text-soft-gold-dark scale-[1.75]" />
                        </ButtonAction>
                    )}
                </div>

                {isSelectMode && selectedCount > 0 && (
                    <div className="flex-row flex gap-2">
                        <Title className="text-md border border-soft-gold px-3 py-1 rounded-full md:border-none md:px-0 md:py-0">
                            <span className="text-soft-gold">{selectedCount}</span>
                        </Title>
                        <Title className="text-md md:block hidden">Fotos Selecionadas</Title>
                    </div>
                )}

                {!single && (
                    <Button
                        type={isSelectMode ? 'secondary' : 'primary'}
                        onClick={onToggleSelect}
                        className={cn(
                            'py-2 w-full md:w-auto transition-colors duration-300 hover:opacity-90',
                            isSelectMode && 'px-[22px]',
                        )}
                    >
                        {isSelectMode ? 'Cancelar' : 'Selecionar'}
                    </Button>
                )}
            </div>
        </div>
    );
};
