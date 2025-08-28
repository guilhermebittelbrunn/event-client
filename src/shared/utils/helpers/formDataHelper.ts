function buildFormData(formData: FormData, data: Record<string, any>, parentKey?: string): void {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            let newParentKey;

            if (Array.isArray(data)) {
                if (parentKey) {
                    /** Devido a um estranho erro no multer lá no backend, não conseguimos enviar um array de imagens no FormData */
                    const isArrayOfFiles = data.some(item => item instanceof File);
                    newParentKey = isArrayOfFiles ? parentKey : `${parentKey}[]`;
                } else {
                    newParentKey = parentKey;
                }
            } else {
                newParentKey = parentKey ? `${parentKey}[${key}]` : key;
            }

            buildFormData(formData, data[key], newParentKey);
        });
    } else {
        const value = data == null ? '' : data;

        if (parentKey) {
            formData.append(parentKey, value as any);
        }
    }
}

function formDataFromObject(obj: Record<string, any>): FormData {
    const data = new FormData();

    buildFormData(data, obj);

    return data;
}

export { formDataFromObject, buildFormData };
