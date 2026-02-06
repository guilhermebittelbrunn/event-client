'use client';

import React, { useRef, useCallback } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from '@/shared/components/ui';
import { cn } from '@/shared/utils/helpers/cn';
import { useMemoryStore } from '@/shared/store/useMemory';
import useMemory from '@/shared/store/useMemory';

interface CameraButtonProps extends Omit<ButtonProps, 'onClick'> {
    onImageCapture?: (file: File) => void;
    disabled?: boolean;
}

export function CameraButton({
    onImageCapture,
    disabled = false,
    className = '',
    ...buttonProps
}: CameraButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { setImage, compressImage, validateImage, setError } = useMemoryStore(state => ({
        setImage: state.setImage,
        compressImage: state.compressImage,
        validateImage: state.validateImage,
        setError: state.setError,
    }));

    const handleCapture = useCallback(async () => {
        if (disabled) return;

        try {
            useMemory.setState({ isCapturing: true });

            // Para iOS Safari, usa input com capture="environment" para ir direto à câmera
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

            if (isIOS && isSafari) {
                // No iOS Safari, o input com capture="environment" vai direto à câmera.
                // Limpa o input ANTES de abrir para evitar que o mobile reutilize a mesma foto.
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                fileInputRef.current?.click();
                return;
            }

            // Verifica se o dispositivo suporta getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Fallback para dispositivos que não suportam câmera
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                fileInputRef.current?.click();
                return;
            }

            // Tenta acessar a câmera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Prefere câmera traseira em mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            // Cria um elemento de vídeo temporário
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;

            // Aguarda o vídeo carregar
            await new Promise(resolve => {
                video.onloadedmetadata = resolve;
            });

            // Cria um canvas para capturar a foto
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Não foi possível acessar o contexto do canvas');
            }

            // Define as dimensões do canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Desenha o frame atual do vídeo no canvas
            context.drawImage(video, 0, 0);

            // Para o stream da câmera
            stream.getTracks().forEach(track => track.stop());

            // Converte o canvas para blob
            canvas.toBlob(
                async blob => {
                    if (blob) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, {
                            type: 'image/jpeg',
                        });

                        // Comprimir imagem se for maior que 1MB
                        if (file.size > 1024 * 1024) {
                            try {
                                const compressedFile = await compressImage(file);
                                setImage(compressedFile);
                                onImageCapture?.(compressedFile);
                            } catch (error) {
                                console.error('Erro ao comprimir imagem da câmera:', error);
                                setImage(file);
                                onImageCapture?.(file);
                            }
                        } else {
                            setImage(file);
                            onImageCapture?.(file);
                        }
                    }
                },
                'image/jpeg',
                0.8,
            );
        } catch (error) {
            console.error('Erro ao acessar câmera:', error);
            setError('Erro ao acessar a câmera. Tente novamente.');
            // Fallback para input file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fileInputRef.current?.click();
        } finally {
            useMemory.setState({ isCapturing: false });
        }
    }, [disabled, setImage, compressImage, setError, onImageCapture]);

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const rawFile = event.target.files?.[0];
            if (rawFile) {
                // No mobile (câmera), o browser pode devolver a mesma referência da última foto.
                // Sempre criar um novo File quebra essa referência e garante que cada captura é única.
                const file = new File([rawFile], `photo_${Date.now()}.jpg`, {
                    type: rawFile.type || 'image/jpeg',
                    lastModified: Date.now(),
                });

                if (!validateImage(file)) {
                    setError('Formato de imagem inválido ou arquivo muito grande');
                    return;
                }

                // Comprimir imagem se for maior que 1MB
                if (file.size > 1024 * 1024) {
                    try {
                        const compressedFile = await compressImage(file);
                        setImage(compressedFile);
                        onImageCapture?.(compressedFile);
                    } catch (error) {
                        console.error('Erro ao comprimir imagem:', error);
                        setImage(file);
                        onImageCapture?.(file);
                    }
                } else {
                    setImage(file);
                    onImageCapture?.(file);
                }
            }

            // Limpa o input para permitir selecionar/tirar outra foto
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [setImage, compressImage, validateImage, setError, onImageCapture],
    );

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            <Button
                type="primary"
                onClick={handleCapture}
                disabled={disabled}
                className={cn(
                    'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 transition-opacity duration-200 touch-manipulation active:scale-95',
                    className,
                    disabled && 'opacity-40 hover:opacity-40',
                )}
                {...buttonProps}
            >
                <CameraOutlined className="scale-125" />
                {buttonProps.loading ? 'Acessando câmera...' : 'Tirar uma foto'}
            </Button>
        </>
    );
}
