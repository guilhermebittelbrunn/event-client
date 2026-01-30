import { Image as AntdImage, GetProp, Upload, UploadFile, UploadProps } from 'antd';
import { useState, useEffect } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { PlusOutlined } from '@ant-design/icons';
import { cn } from '@/shared/utils/helpers/cn';
import { Label } from '../label';
import { FieldError } from 'react-hook-form';
import { ErrorBadge } from '../../ui';

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

export interface InputUploadProps extends Omit<UploadProps, 'onChange'> {
    showPreview?: boolean;
    className?: string;
    label?: string;
    multiple?: boolean;
    error?: FieldError;
    showErrorBadge?: boolean;
    required?: boolean;
    onChange?: (fileList: UploadFile[]) => void;
    value?: UploadFile[];
}

export function InputUpload({
    showPreview = true,
    className,
    label = 'Imagem',
    multiple = false,
    error,
    showErrorBadge = true,
    required,
    onChange,
    value,
}: InputUploadProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (value && value.length > 0) {
            setFileList(value);
        }
    }, [value]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        onChange?.(newFileList);
    };

    /**
     * Evita o POST automático para a URL atual (comportamento padrão do Upload quando
     * não há `action`). O arquivo é mantido via `onChange` e enviado no submit do form.
     * Em produção, o POST para /painel/eventos/cadastrar gerava "Server action not found".
     */
    const customRequest: NonNullable<UploadProps['customRequest']> = ({ onSuccess }) => {
        onSuccess?.({});
    };

    const uploadButton = (
        <button
            className="p-4 gap-2 flex flex-col items-center font-bold justify-between text-sm border-1 transition rounded-lg border-soft-gold dark:border-soft-gold-dark shadow-theme-xs hover:opacity-80 hover:cursor-pointer"
            type="button"
        >
            <PlusOutlined />
            <Label>Upload</Label>
        </button>
    );
    return (
        <>
            <Label required={required} className="text-matte-black dark:text-snow-white">
                {label}
            </Label>
            <ErrorBadge hidden={!error || !showErrorBadge} message={error?.message || 'Imagem inválido'}>
                <Upload
                    listType="picture"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    customRequest={customRequest}
                    className={cn('w-full', className)}
                    multiple={multiple}
                >
                    {fileList.length >= (multiple ? 8 : 1) ? null : uploadButton}
                </Upload>
            </ErrorBadge>
            {previewImage && showPreview && (
                <AntdImage
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    className={cn('w-full p-2 bg-red-500', className)}
                />
            )}
        </>
    );
}
