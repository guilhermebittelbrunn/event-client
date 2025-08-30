import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface UseQRCodeOptions {
    text: string;
    width?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
}

export function useQRCode({
    text,
    width = 256,
    height = 256,
    color = '#000000',
    backgroundColor = '#FFFFFF',
}: UseQRCodeOptions) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    const [qrCodeSVG, setQrCodeSVG] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!text) {
            setQrCodeDataUrl('');
            setQrCodeSVG('');
            return;
        }

        const generateQRCode = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const options = {
                    width,
                    margin: 1,
                    color: {
                        dark: color,
                        light: backgroundColor,
                    },
                };

                const dataUrl = await QRCode.toDataURL(text, options);
                setQrCodeDataUrl(dataUrl);

                const svgString = await QRCode.toString(text, {
                    ...options,
                    type: 'svg',
                });
                setQrCodeSVG(svgString);
            } catch (err) {
                setError('Erro ao gerar QR Code');
                console.error('QR Code generation error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        generateQRCode();
    }, [text, width, height, color, backgroundColor]);

    const downloadQRCode = async (filename: string = 'qrcode.png') => {
        if (!qrCodeDataUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeDataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadQRCodeSVG = async (filename: string = 'qrcode.svg') => {
        if (!qrCodeSVG) return;

        const blob = new Blob([qrCodeSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return {
        qrCodeDataUrl,
        qrCodeSVG,
        isLoading,
        error,
        downloadQRCode,
        downloadQRCodeSVG,
    };
}
