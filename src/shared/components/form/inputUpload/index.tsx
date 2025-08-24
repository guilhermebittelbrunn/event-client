import { Image as AntdImage, GetProp, Upload, UploadFile, UploadProps } from 'antd';
import { useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { PlusOutlined } from '@ant-design/icons';
import { cn } from '@/shared/utils/cn';
import { Label } from '../label';

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export interface InputUploadProps extends UploadProps {
    showPreview?: boolean;
    className?: string;
    label?: string;
    multiple?: boolean;
}

export function InputUpload({
    showPreview = true,
    className,
    label = 'Imagem',
    multiple = false,
}: InputUploadProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button
            className="p-4 gap-2 flex flex-col items-center font-bold justify-between text-sm border-1 text-white transition rounded-lg border-brand-500 dark:border-brand-900 shadow-theme-xs hover:border-brand-600 dark:hover:border-brand-600 hover:cursor-pointer"
            type="button"
        >
            {<PlusOutlined />}
            <Label>Upload</Label>
        </button>
    );
    return (
        <>
            <Label>{label}</Label>
            <Upload
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                className={cn('w-full', className)}
                multiple={multiple}
            >
                {fileList.length >= (multiple ? 8 : 1) ? null : uploadButton}
            </Upload>
            {previewImage && showPreview && (
                <AntdImage
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    className={cn('w-full p-2 bg-red-500', className)}
                />
            )}
        </>
    );
}
