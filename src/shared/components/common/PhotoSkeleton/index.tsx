export const PhotoSkeleton = () => {
    return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
            />
        </div>
    );
};
