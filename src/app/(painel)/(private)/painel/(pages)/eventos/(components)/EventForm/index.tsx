import { FormContainer, useFormContext } from '@/shared/components/form';
import {
    HookFormInput,
    HookFormRangePicker,
    HookFormSelect,
    HookFormSwitch,
    HookFormTextArea,
    HookFormUpload,
} from '@/shared/components/hookForm';
import { Paragraph } from '@/shared/components/ui';
import { EVENT_STATUS_OPTIONS } from '@/shared/consts/event';
import { useAuth } from '@/shared/store/useAuth';
import { useClientRouter } from '@/shared/hooks';
import { UserTypeEnum } from '@/shared/types/dtos';
import { ChangeEvent } from 'react';

interface EventFormProps {
    action?: 'create' | 'update';
}

export function EventForm({ action = 'create' }: EventFormProps) {
    const { watch, setValue, clearErrors } = useFormContext();
    const { currentDomain } = useClientRouter();
    const user = useAuth(state => state.user);

    const isAdmin = user?.type === UserTypeEnum.ADMIN;

    const slug = watch('slug');

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value) {
            setValue('slug', value?.trim().toLowerCase().replace(/ /g, '-') || '');
            clearErrors('slug');
        }
    };

    return (
        <>
            <FormContainer>
                <div className="space-y-4">
                    <HookFormInput name="name" label="Nome do evento" required onChange={handleChangeName} />
                    <HookFormTextArea
                        name="description"
                        label="Descrição"
                        rows={3}
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />

                    <HookFormRangePicker name="dates" required disablePast />
                </div>
                <div className="space-y-4">
                    <HookFormInput name="slug" label="Link de Acesso" required />
                    {slug && (
                        <Paragraph className="text-sm opacity-50 block text-start p-0">
                            Exemplo do link de acesso: {currentDomain}/eventos/{slug}
                        </Paragraph>
                    )}

                    {isAdmin && action === 'update' && (
                        <HookFormSelect name="status" label="Status" options={EVENT_STATUS_OPTIONS} />
                    )}

                    <HookFormUpload name="image" label="Foto do evento" />

                    {isAdmin && action === 'create' && (
                        <HookFormSwitch
                            name="isForTesting"
                            label="Evento de teste"
                            helperText="Caso esteja ativado, o evento será criado sem cobrança"
                        />
                    )}
                </div>
            </FormContainer>
            {/* {action === 'update' && (
                <Alert
                    message="Ao alterar o link de acesso do evento o QR Code deverá ser reimpresso"
                    type="info"
                    className="mt-2"
                />
            )} */}
        </>
    );
}
