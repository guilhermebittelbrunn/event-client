import { Polaroid } from '@/shared/components/common/Pollaroid';
import { FormContainer, useFormContext } from '@/shared/components/form';
import { HookFormTextArea } from '@/shared/components/hookForm';
import { Button } from '@/shared/components/ui';
import { useEffect, useState, useRef } from 'react';

interface PreviewMemoryProps {
    isLoading?: boolean;
}

export function PreviewMemory({ isLoading }: PreviewMemoryProps) {
    const [mounted, setMounted] = useState(false);
    const { watch, reset } = useFormContext();

    const message = watch('message');
    const description = watch('description');
    const image = watch('image');

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const imageUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (imageUrlRef.current) {
            URL.revokeObjectURL(imageUrlRef.current);
            imageUrlRef.current = null;
        }

        if (image && image instanceof File) {
            const url = URL.createObjectURL(image);
            imageUrlRef.current = url;
            setImageUrl(url);
        } else {
            setImageUrl(null);
        }
    }, [image]);

    useEffect(() => {
        return () => {
            if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
        };
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            reset();
            setMounted(false);
        }
    };

    if (!mounted) return null;

    return (
        <FormContainer>
            {Boolean(image) && (
                <>
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl overflow-hidden touch-none overscroll-none"
                        onClick={handleBackdropClick}
                    >
                        <div className="w-full max-w-md flex flex-col h-full py-4 px-4">
                            <div className="flex-1 flex items-center justify-center min-h-0 py-4">
                                <Polaroid
                                    memory={{
                                        message,
                                        description,
                                        file: imageUrl
                                            ? {
                                                  id: 'temp-file',
                                                  name: 'uploaded-image',
                                                  path: '',
                                                  size: 0,
                                                  url: imageUrl,
                                                  createdAt: new Date().toISOString(),
                                                  updatedAt: new Date().toISOString(),
                                              }
                                            : undefined,
                                    }}
                                />
                            </div>

                            <div className="w-full flex flex-col gap-4 flex-shrink-0 pb-safe-offset-4">
                                <HookFormTextArea
                                    name="message"
                                    placeholder="Deixe uma mensagem (opcional)"
                                    className="w-full h-18 px-3 py-3 border rounded-lg resize-none focus:ring-2 focus:border-transparent text-lg touch-manipulation"
                                    labelClassName="text-lg"
                                    rows={2}
                                    maxLength={200}
                                />
                                <Button
                                    disabled={isLoading}
                                    loading={isLoading}
                                    htmlType="submit"
                                    type="secondary"
                                    className="w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center bg-white gap-3 touch-manipulation active:scale-95 transition-transform relative z-10"
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </FormContainer>
    );
}
