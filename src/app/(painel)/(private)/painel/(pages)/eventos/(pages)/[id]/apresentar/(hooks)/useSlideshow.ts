import { useEffect, useCallback, useRef } from 'react';
import { MemoryDTO } from '@/shared/types/dtos';
import { createWithEqualityFn } from 'zustand/traditional';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UseSlideshowProps {
    photos: MemoryDTO[];
    initialIndex?: number;
    defaultSpeed?: number; // segundos entre transições
    onClose?: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 3, 5]; // em segundos

interface SlideshowState {
    photos: MemoryDTO[];
    currentIndex: number;
    isPaused: boolean;
    speed: number;
    showControls: boolean;
    showCaption: boolean;
    /** Indica se a imagem atual já está carregada em memória */
    isCurrentReady: boolean;
    onClose?: () => void;
}

interface SlideshowActions {
    initialize: (payload: {
        photos: MemoryDTO[];
        initialIndex: number;
        defaultSpeed: number;
        onClose?: () => void;
    }) => void;
    setCurrentReady: (ready: boolean) => void;
    setShowControls: (show: boolean) => void;
    next: () => void;
    previous: () => void;
    goTo: (index: number) => void;
    togglePause: () => void;
    increaseSpeed: () => void;
    decreaseSpeed: () => void;
    toggleCaption: () => void;
}

const initialState: SlideshowState = {
    photos: [],
    currentIndex: 0,
    isPaused: false,
    speed: 1,
    showControls: true,
    showCaption: false,
    isCurrentReady: false,
    onClose: undefined,
};

const useSlideshowStore = createWithEqualityFn<SlideshowState & SlideshowActions>()(
    immer(
        subscribeWithSelector((set, get) => ({
            ...initialState,

            initialize({ photos, initialIndex, defaultSpeed, onClose }) {
                const safeIndex = photos.length > 0 ? Math.min(initialIndex, photos.length - 1) : 0;

                set((state) => {
                    state.photos = photos;
                    state.currentIndex = safeIndex;
                    state.speed = defaultSpeed;
                    state.isPaused = false;
                    state.showControls = true;
                    state.showCaption = false;
                    state.isCurrentReady = false;
                    state.onClose = onClose;
                });
            },

            setCurrentReady(ready: boolean) {
                set((state) => {
                    state.isCurrentReady = ready;
                });
            },

            setShowControls(show: boolean) {
                set((state) => {
                    state.showControls = show;
                });
            },

            next() {
                const { photos } = get();
                if (photos.length === 0) return;

                set((state) => {
                    state.currentIndex = (state.currentIndex + 1) % state.photos.length;
                    state.isCurrentReady = false;
                });
            },

            previous() {
                const { photos } = get();
                if (photos.length === 0) return;

                set((state) => {
                    state.currentIndex = (state.currentIndex - 1 + state.photos.length) % state.photos.length;
                    state.isCurrentReady = false;
                });
            },

            goTo(index: number) {
                const { photos } = get();
                if (index < 0 || index >= photos.length) return;

                set((state) => {
                    state.currentIndex = index;
                    state.isCurrentReady = false;
                });
            },

            togglePause() {
                set((state) => {
                    state.isPaused = !state.isPaused;
                });
            },

            increaseSpeed() {
                set((state) => {
                    const currentIndex = SPEED_OPTIONS.findIndex((s) => s === state.speed);
                    if (currentIndex < SPEED_OPTIONS.length - 1) {
                        state.speed = SPEED_OPTIONS[currentIndex + 1];
                    }
                });
            },

            decreaseSpeed() {
                set((state) => {
                    const currentIndex = SPEED_OPTIONS.findIndex((s) => s === state.speed);
                    if (currentIndex > 0) {
                        state.speed = SPEED_OPTIONS[currentIndex - 1];
                    }
                });
            },

            toggleCaption() {
                set((state) => {
                    state.showCaption = !state.showCaption;
                });
            },
        })),
    ),
);

export const useSlideshow = ({ photos, initialIndex = 0, defaultSpeed = 3, onClose }: UseSlideshowProps) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initializedKeyRef = useRef<string | null>(null);

    const {
        photos: statePhotos,
        currentIndex,
        isPaused,
        speed,
        showControls,
        showCaption,
        isCurrentReady,
        initialize,
        setCurrentReady,
        setShowControls,
        next,
        previous,
        goTo,
        togglePause,
        increaseSpeed,
        decreaseSpeed,
        toggleCaption,
    } = useSlideshowStore((state) => ({
        photos: state.photos,
        currentIndex: state.currentIndex,
        isPaused: state.isPaused,
        speed: state.speed,
        showControls: state.showControls,
        showCaption: state.showCaption,
        isCurrentReady: state.isCurrentReady,
        initialize: state.initialize,
        setCurrentReady: state.setCurrentReady,
        setShowControls: state.setShowControls,
        next: state.next,
        previous: state.previous,
        goTo: state.goTo,
        togglePause: state.togglePause,
        increaseSpeed: state.increaseSpeed,
        decreaseSpeed: state.decreaseSpeed,
        toggleCaption: state.toggleCaption,
    }));

    const totalPhotos = statePhotos.length;
    const currentPhoto = statePhotos[currentIndex];

    // Limpa apenas o timer do autoplay
    const clearSlideTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Limpa apenas o timer de auto-hide dos controles
    const clearControlsTimer = useCallback(() => {
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
            controlsTimerRef.current = null;
        }
    }, []);

    // Inicializa o store apenas quando o conjunto de fotos/parâmetros realmente muda
    useEffect(() => {
        if (!photos || photos.length === 0) return;

        const key = JSON.stringify({
            ids: photos.map((p) => p.id),
            initialIndex,
            defaultSpeed,
        });

        if (initializedKeyRef.current === key) {
            return;
        }

        initializedKeyRef.current = key;
        initialize({ photos, initialIndex, defaultSpeed, onClose });
    }, [photos, initialIndex, defaultSpeed, onClose, initialize]);

    // Mostrar controles temporariamente
    const showControlsTemporarily = useCallback(() => {
        setShowControls(true);
        clearControlsTimer();

        controlsTimerRef.current = setTimeout(() => {
            setShowControls(false);
        }, 4000); // Ocultar após 4 segundos de inatividade
    }, [clearControlsTimer, setShowControls]);

    // Timer automático de transição – só roda quando a imagem atual já está pronta
    useEffect(() => {
        if (isPaused || totalPhotos === 0 || !isCurrentReady) {
            clearSlideTimer();
            return;
        }

        timerRef.current = setTimeout(() => {
            next();
        }, speed * 1000);

        return () => {
            clearSlideTimer();
        };
    }, [currentIndex, isPaused, speed, next, totalPhotos, isCurrentReady, clearSlideTimer]);

    // Auto-hide de controles
    useEffect(() => {
        if (showControls) {
            controlsTimerRef.current = setTimeout(() => {
                setShowControls(false);
            }, 4000);
        }

        return () => {
            clearControlsTimer();
        };
    }, [showControls, setShowControls, clearControlsTimer]);

    // Limpar ao desmontar
    useEffect(() => {
        return () => {
            clearSlideTimer();
            clearControlsTimer();
        };
    }, [clearSlideTimer, clearControlsTimer]);

    // Pré-carregar próximas imagens para evitar delay de loading
    useEffect(() => {
        if (!statePhotos || statePhotos.length === 0) return;

        const preload = (index: number) => {
            const photo = statePhotos[index];
            const url = photo?.file?.url;
            if (!url) return;

            const img = new Image();
            img.src = url;
        };

        if (totalPhotos > 0) {
            const nextIndex = (currentIndex + 1) % totalPhotos;
            const afterNextIndex = (currentIndex + 2) % totalPhotos;
            preload(nextIndex);
            if (afterNextIndex !== nextIndex) {
                preload(afterNextIndex);
            }
        }
    }, [currentIndex, statePhotos, totalPhotos]);

    // Atalhos de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose?.();
                    break;
                case ' ':
                    e.preventDefault();
                    togglePause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previous();
                    showControlsTemporarily();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    next();
                    showControlsTemporarily();
                    break;
                case 'c':
                case 'C':
                    toggleCaption();
                    showControlsTemporarily();
                    break;
                case '+':
                case '=':
                    increaseSpeed();
                    showControlsTemporarily();
                    break;
                case '-':
                case '_':
                    decreaseSpeed();
                    showControlsTemporarily();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        onClose,
        togglePause,
        previous,
        next,
        toggleCaption,
        increaseSpeed,
        decreaseSpeed,
        showControlsTemporarily,
    ]);

    return {
        currentPhoto,
        currentIndex,
        totalPhotos,
        isPaused,
        speed,
        showControls,
        showCaption,
        // estado de readiness da imagem atual (não é usado diretamente no componente, mas pode ser útil)
        isCurrentReady,
        next,
        previous,
        goTo,
        togglePause,
        increaseSpeed,
        decreaseSpeed,
        toggleCaption,
        showControlsTemporarily,
        // expõe setter para o componente marcar quando a imagem carregou/errou
        markCurrentReady: () => setCurrentReady(true),
        resetCurrentReady: () => setCurrentReady(false),
    };
};
