import { cn } from '@/shared/utils/helpers/cn';
import { Button } from '../../ui';
import { useClientRouter } from '@/shared/hooks';
import { useSidebar } from '@/shared/context/SidebarContext';

interface FormFooterProps {
    children?: React.ReactNode;
    className?: string;
    includeDefaultActions?: boolean;
    isLoading?: boolean;
}

export function FormFooter({
    children,
    className,
    includeDefaultActions = true,
    isLoading = false,
}: FormFooterProps) {
    const { back } = useClientRouter();
    const { isMobile } = useSidebar();

    const defaultButtons = [
        <Button
            key="submit"
            type="primary"
            className="px-6"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
        >
            Salvar
        </Button>,
        <Button key="cancel" type="secondary" onClick={back} disabled={isLoading}>
            Cancelar
        </Button>,
    ];

    return (
        <div className={cn('flex flex-col sm:flex-row justify-end gap-2 mt-8', className)}>
            {includeDefaultActions ? (
                <>
                    {isMobile ? (
                        <>
                            {defaultButtons[0]}
                            {defaultButtons[1]}
                        </>
                    ) : (
                        <>
                            {defaultButtons[1]}
                            {defaultButtons[0]}
                        </>
                    )}
                </>
            ) : (
                children
            )}
        </div>
    );
}
