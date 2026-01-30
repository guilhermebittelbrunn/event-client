import { FormContainer } from '@/shared/components/form';
import { HookFormInput, HookFormSwitch } from '@/shared/components/hookForm';

export function PlanForm() {
    return (
        <FormContainer>
            <div className="space-y-4">
                <HookFormInput name="description" label="Descrição" />
            </div>
            <div className="space-y-4 flex flex-col">
                <HookFormInput name="price" label="Preço" type="number" />
                <div className="flex justify-end">
                    <HookFormSwitch name="enabled" label="Ativo" />
                </div>
            </div>
        </FormContainer>
    );
}
