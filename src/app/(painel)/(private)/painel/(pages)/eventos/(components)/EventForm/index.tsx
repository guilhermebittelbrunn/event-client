import { FormContainer, useFormContext } from '@/shared/components/form';
import {
    HookFormInput,
    HookFormRangePicker,
    HookFormTextArea,
    HookFormUpload,
} from '@/shared/components/hookForm';
import { Paragraph } from '@/shared/components/ui';
import { useClientRouter } from '@/shared/hooks';
import { ChangeEvent } from 'react';

export function EventForm() {
    const { watch, setValue } = useFormContext();
    const { currentDomain } = useClientRouter();

    const slug = watch('slug');

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue('slug', value?.trim().toLowerCase().replace(/ /g, '-') || '');
    };

    return (
        <FormContainer>
            <div className="space-y-4">
                <HookFormInput name="name" label="Nome do evento" required onChange={handleChangeName} />
                <HookFormTextArea
                    name="description"
                    label="Descrição"
                    rows={3}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />

                <HookFormRangePicker name="dates" required />
            </div>
            <div className="space-y-4">
                <HookFormInput name="slug" label="Link de Acesso" required />
                {slug && (
                    <Paragraph className="text-sm opacity-50 block text-start p-0">
                        Link de acesso: {currentDomain}/eventos/{slug}
                    </Paragraph>
                )}

                <HookFormUpload name="image" label="Foto do evento" />
            </div>
        </FormContainer>
    );
}
