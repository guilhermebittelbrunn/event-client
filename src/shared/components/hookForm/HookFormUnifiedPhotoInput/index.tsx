import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload, UploadFile, UploadProps, Image as AntdImage, GetProp, ConfigProvider } from 'antd';
import { Button, ButtonProps, ErrorBadge } from '../../ui';
import { cn } from '@/shared/utils/helpers/cn';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface HookFormUnifiedPhotoInputProps {
    name: string;
    label?: string;
    className?: string;
    labelClassName?: string;
    cameraButtonProps?: ButtonProps;
    uploadButtonProps?: ButtonProps;
    disabled?: boolean;
    required?: boolean;
    showPreview?: boolean;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const compressImage = (file: File, maxSizeMB: number = 2, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calcula as novas dimensões mantendo a proporção
            let { width, height } = img;
            const maxDimension = 1920; // Máximo de 1920px em qualquer dimensão

            if (width > height && width > maxDimension) {
                height = (height * maxDimension) / width;
                width = maxDimension;
            } else if (height > maxDimension) {
                width = (width * maxDimension) / height;
                height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;

            // Desenha a imagem redimensionada
            ctx?.drawImage(img, 0, 0, width, height);

            // Converte para blob com compressão
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        // Se ainda estiver muito grande, reduz a qualidade
                        if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.3) {
                            compressImage(file, maxSizeMB, quality - 0.1).then(resolve);
                        } else {
                            resolve(compressedFile);
                        }
                    } else {
                        resolve(file); // Fallback para o arquivo original
                    }
                },
                'image/jpeg',
                quality,
            );
        };

        img.src = URL.createObjectURL(file);
    });
};

export function HookFormUnifiedPhotoInput({
    name,
    label,
    className = '',
    labelClassName = '',
    cameraButtonProps = {},
    uploadButtonProps = {},
    disabled = false,
    required = false,
    showPreview = true,
}: HookFormUnifiedPhotoInputProps) {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // Sincroniza o valor do campo com o fileList
    useEffect(() => {
        if (value && value instanceof File) {
            const url = URL.createObjectURL(value);
            const uploadFile: UploadFile = {
                uid: '-1',
                name: value.name,
                status: 'done',
                url: url,
                thumbUrl: url, // Adiciona thumbUrl para o mini preview
                originFileObj: value as any, // Type assertion para compatibilidade com RcFile
            };
            setFileList([uploadFile]);
        } else if (!value) {
            setFileList([]);
        }
    }, [value]);

    const isDisabled = disabled || fileList.length > 0;

    const handleCapture = useCallback(async () => {
        if (isDisabled) return;

        try {
            setIsCapturing(true);

            // Para iOS Safari, usa input com capture="environment" para ir direto à câmera
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

            if (isIOS && isSafari) {
                // No iOS Safari, o input com capture="environment" vai direto à câmera
                fileInputRef.current?.click();
                return;
            }

            // Verifica se o dispositivo suporta getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Fallback para dispositivos que não suportam câmera
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
            await new Promise((resolve) => {
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
            stream.getTracks().forEach((track) => track.stop());

            // Converte o canvas para blob
            canvas.toBlob(
                async (blob) => {
                    if (blob) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, {
                            type: 'image/jpeg',
                        });

                        // Comprimir imagem se for maior que 1MB
                        if (file.size > 1024 * 1024) {
                            try {
                                const compressedFile = await compressImage(file, 2); // Máximo 2MB
                                onChange(compressedFile);
                            } catch (error) {
                                console.error('Erro ao comprimir imagem da câmera:', error);
                                onChange(file); // Fallback para arquivo original
                            }
                        } else {
                            onChange(file);
                        }
                    }
                },
                'image/jpeg',
                0.8,
            );
        } catch (error) {
            console.error('Erro ao acessar câmera:', error);
            // Fallback para input file
            fileInputRef.current?.click();
        } finally {
            setIsCapturing(false);
        }
    }, [isDisabled, onChange]);

    // Theme customizado para o Upload (sobrescreve o theme global)
    const uploadTheme = {
        components: {
            Upload: {
                actionsColor: '#CBA135',
                colorBgContainer: '#CBA135',
                colorBorder: '#CBA135',
            },
        },
    };

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                // Comprimir imagem se for maior que 1MB
                if (file.size > 1024 * 1024) {
                    try {
                        const compressedFile = await compressImage(file, 2); // Máximo 2MB
                        onChange(compressedFile);
                    } catch (error) {
                        console.error('Erro ao comprimir imagem:', error);
                        onChange(file); // Fallback para arquivo original
                    }
                } else {
                    onChange(file);
                }
            }
        },
        [onChange],
    );

    const handleGallerySelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                // Comprimir imagem se for maior que 1MB
                if (file.size > 1024 * 1024) {
                    try {
                        const compressedFile = await compressImage(file, 2); // Máximo 2MB
                        onChange(compressedFile);
                    } catch (error) {
                        console.error('Erro ao comprimir imagem:', error);
                        onChange(file); // Fallback para arquivo original
                    }
                } else {
                    onChange(file);
                }
            }
        },
        [onChange],
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = useCallback(() => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onChange]);

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label className={cn('block text-sm font-medium mb-2', labelClassName)}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isDisabled}
            />

            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleGallerySelect}
                className="hidden"
                disabled={isDisabled}
                multiple={false}
            />

            <div className="space-y-4">
                <ErrorBadge hidden={!error} message={error?.message || 'Imagem inválida'}>
                    <Button
                        type="primary"
                        onClick={handleCapture}
                        loading={isCapturing}
                        disabled={isDisabled}
                        {...cameraButtonProps}
                        className={cn(
                            'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 transition-opacity duration-200',
                            cameraButtonProps.className,
                            isDisabled && 'opacity-40 hover:opacity-40',
                        )}
                    >
                        <CameraOutlined className="scale-125" />
                        {isCapturing ? 'Acessando câmera...' : 'Tirar uma foto'}
                    </Button>
                </ErrorBadge>

                <ErrorBadge hidden={!error} message={error?.message || 'Imagem inválida'}>
                    <Button
                        type="primary"
                        icon={<UploadOutlined className="scale-125" />}
                        disabled={isDisabled}
                        onClick={() => {
                            if (!isDisabled) {
                                galleryInputRef.current?.click();
                            }
                        }}
                        {...uploadButtonProps}
                        className={cn(
                            'w-full p-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3 transition-opacity duration-200',
                            uploadButtonProps.className,
                            isDisabled && 'opacity-40 hover:opacity-40',
                        )}
                    >
                        Carregar fotos
                    </Button>
                </ErrorBadge>
            </div>

            {fileList.length > 0 && showPreview && (
                <div className="mt-4">
                    <ConfigProvider theme={uploadTheme}>
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onRemove={handleRemove}
                            className="w-full"
                            multiple={false}
                        />
                    </ConfigProvider>
                </div>
            )}

            {previewImage && showPreview && (
                <AntdImage
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
}
