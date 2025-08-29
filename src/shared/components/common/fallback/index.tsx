interface FallbackProps {
    children: React.ReactNode;
    condition?: any;
    fallback?: React.ReactNode;
}

export function Fallback({ children, condition, fallback = <></> }: FallbackProps) {
    return condition ? children : fallback;
}
