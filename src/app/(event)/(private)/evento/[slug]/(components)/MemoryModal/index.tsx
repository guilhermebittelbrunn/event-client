import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MemoryDTO } from '@/shared/types/dtos';
import { Polaroid } from '@/shared/components/common/pollaroid';

interface MemoryModalProps {
    memory: Partial<MemoryDTO>;
    onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl"
            onClick={handleBackdropClick}
        >
            <Polaroid memory={memory} />
        </div>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
};
