'use client';

import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';

export interface MemoryState {
    image: File | null;
    imageUrl: string | null;
    message: string;
    error: string | null;

    isCapturing: boolean;
    isUploading: boolean;
    isProcessing: boolean;

    showPreview: boolean;
    currentStep: 'select' | 'capture' | 'preview' | 'processing';

    maxFileSize: number; // MB
    compressionQuality: number;
}

interface MemoryActions {
    setImage(image: File | null): void;
    clearImage(): void;
    resetMemory(): void;
    startCapture(): void;
    startUpload(): void;
    completeUpload(): void;
    cancelProcess(): void;
    setError(error: string | null): void;

    compressImage(file: File): Promise<File>;
    validateImage(file: File): boolean;
}

const initialState: MemoryState = {
    image: null,
    imageUrl: null,
    message: '',
    isCapturing: false,
    isUploading: false,
    isProcessing: false,
    error: null,
    showPreview: false,
    currentStep: 'select',
    maxFileSize: 5, // 5MB
    compressionQuality: 0.8,
};

const useMemory = createWithEqualityFn<MemoryState & MemoryActions>()(
    persist(
        immer(
            subscribeWithSelector((set, get) => ({
                ...initialState,

                setImage(image) {
                    set((state) => {
                        // Limpa URL anterior se existir
                        if (state.imageUrl) {
                            URL.revokeObjectURL(state.imageUrl);
                        }

                        state.image = image;

                        if (image) {
                            state.imageUrl = URL.createObjectURL(image);
                            state.currentStep = 'preview';
                            state.showPreview = true;
                        } else {
                            state.imageUrl = null;
                            state.currentStep = 'select';
                            state.showPreview = false;
                        }

                        state.error = null;
                    });
                },

                clearImage() {
                    set((state) => {
                        if (state.imageUrl) {
                            URL.revokeObjectURL(state.imageUrl);
                        }

                        state.image = null;
                        state.imageUrl = null;
                        state.currentStep = 'select';
                        state.showPreview = false;
                        state.error = null;
                    });
                },

                setError(error) {
                    set((state) => {
                        state.error = error;
                    });
                },

                resetMemory() {
                    set((state) => {
                        if (state.imageUrl) {
                            URL.revokeObjectURL(state.imageUrl);
                        }

                        Object.assign(state, {
                            ...initialState,
                            // Preserva configurações
                            maxFileSize: state.maxFileSize,
                            compressionQuality: state.compressionQuality,
                        });
                    });
                },

                startCapture() {
                    set((state) => {
                        state.isCapturing = true;
                        state.currentStep = 'capture';
                        state.error = null;
                    });
                },

                startUpload() {
                    set((state) => {
                        state.isUploading = true;
                        state.isProcessing = true;
                        state.currentStep = 'processing';
                        state.error = null;
                    });
                },

                completeUpload() {
                    set((state) => {
                        state.isUploading = false;
                        state.isProcessing = false;
                        state.currentStep = 'select';
                        state.showPreview = false;

                        if (state.imageUrl) {
                            URL.revokeObjectURL(state.imageUrl);
                        }
                        state.image = null;
                        state.imageUrl = null;
                        state.message = '';
                    });
                },

                cancelProcess() {
                    set((state) => {
                        state.isUploading = false;
                        state.isProcessing = false;
                        state.isCapturing = false;
                        state.currentStep = 'select';
                        state.showPreview = false;
                        state.error = null;
                    });
                },

                async compressImage(file: File): Promise<File> {
                    const { maxFileSize, compressionQuality } = get();

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
                                        if (
                                            compressedFile.size > maxFileSize * 1024 * 1024 &&
                                            compressionQuality > 0.3
                                        ) {
                                            get().compressImage(file).then(resolve);
                                        } else {
                                            resolve(compressedFile);
                                        }
                                    } else {
                                        resolve(file); // Fallback para o arquivo original
                                    }
                                },
                                'image/jpeg',
                                compressionQuality,
                            );
                        };

                        img.src = URL.createObjectURL(file);
                    });
                },

                validateImage(file: File): boolean {
                    const { maxFileSize } = get();

                    // Verifica se é uma imagem
                    if (!file.type.startsWith('image/')) {
                        return false;
                    }

                    // Verifica o tamanho do arquivo
                    if (file.size > maxFileSize * 1024 * 1024) {
                        return false;
                    }

                    return true;
                },
            })),
        ),
        {
            name: 'memory-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Persiste apenas configurações, não estado temporário
                maxFileSize: state.maxFileSize,
                compressionQuality: state.compressionQuality,
            }),
        },
    ),
);

export function useMemoryStore<T>(
    selector: (state: MemoryState & MemoryActions) => T,
): T | (MemoryState & MemoryActions) {
    const store = useMemory(selector);

    return store;
}

export default useMemory;
