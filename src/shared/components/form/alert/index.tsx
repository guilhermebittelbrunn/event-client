import { CheckCircleFilled, CloseCircleOutlined, InfoCircleFilled, WarningOutlined } from '@ant-design/icons';
import { Paragraph } from '../../ui';
import { cn } from '@/shared/utils';

interface AlertProps {
    message: string | React.ReactNode;
    type: 'warning' | 'info' | 'error' | 'success';
    className?: string;
    iconProps?: IconProps;
}

interface IconProps {
    type: 'warning' | 'info' | 'error' | 'success';
    className?: string;
}

const colorMap = {
    warning: 'border-warning-500 dark:border-warning-500/30',
    info: 'border-blue-700 dark:border-blue-900',
    error: 'border-error-500 dark:border-error-500/30',
    success: 'border-success-500 dark:border-success-500/30',
};

function Icon({ type, className, ...props }: IconProps) {
    switch (type) {
        case 'warning':
            return (
                <WarningOutlined className="scale-150 text-warning-500 dark:text-warning-500/30" {...props} />
            );
        case 'info':
            return <InfoCircleFilled className="scale-150 text-blue-700 dark:text-blue-900" {...props} />;
        case 'error':
            return (
                <CloseCircleOutlined className="scale-150 text-error-500 dark:text-error-500/30" {...props} />
            );
        case 'success':
            return (
                <CheckCircleFilled className="scale-150 text-success-500 dark:text-success-500/30" {...props} />
            );
    }
}

export function Alert({ message, type, className, iconProps }: AlertProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-4 text-center px-4 border-[1.5px] rounded-lg',
                colorMap[type],
                className,
            )}
        >
            <Icon type={type} {...iconProps} />
            <Paragraph className={cn(colorMap[type], 'text-sm font-medium text-shadow-2xs')}>
                {message}
            </Paragraph>
        </div>
    );
}
