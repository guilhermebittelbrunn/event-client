import { FormContainer, useFormContext } from '@/shared/components/form';
import { HookFormInput, HookFormSwitch } from '@/shared/components/hookForm';
import { HookFormInputDecimal } from '@/shared/components/hookForm/HookFormInputDecimal';
import { HelperBadge } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils';
import { addDays } from 'date-fns';

export function PlanForm() {
    const { watch } = useFormContext();

    const accessDays = watch('accessDays');
    const now = new Date();

    return (
        <FormContainer columns={3}>
            <div className="space-y-4">
                <HookFormInput name="description" label="Descrição" />
            </div>
            <div className="space-y-4 flex flex-col">
                <HookFormInputDecimal name="price" label="Preço" currency />
            </div>
            <div>
                <div>
                    <HelperBadge
                        message={
                            <>
                                Eventos criados com este plano de cobrança terão dias de acesso adicionais
                                dentro da plataforma após o termino do evento.
                                <br /> <br /> Deixe em branco para não ter acesso adicional.
                            </>
                        }
                    >
                        <HookFormInput name="accessDays" label="Dias de acesso" type="number" />
                    </HelperBadge>
                    {!!accessDays && (
                        <p className="text-sm text-gray-500 mt-1 ">
                            Exemplo: Evento com data final em {formatDate(now)} terá acesso até{' '}
                            {formatDate(addDays(now, Number(accessDays)))}
                        </p>
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <HookFormSwitch name="enabled" label="Ativo" />
                </div>
            </div>
        </FormContainer>
    );
}
