'use client';

import { Suspense } from 'react';
import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { Input, Select, InputUpload, FormContainer } from '@/shared/components/form';
import { FormFooter } from '@/shared/components/form/footer';
import { Button, Container } from '@/shared/components/ui';

import { useRouter } from 'next/navigation';

const porteOptions = [
    { value: 'pequeno', label: 'Pequeno' },
    { value: 'medio', label: 'Médio' },
    { value: 'grande', label: 'Grande' },
];

export default function CreateAnimalPage() {
    const router = useRouter();

    return (
        <>
            <PageBreadcrumb
                pageTitle="Cadastrar  Animal"
                breadcrumbItems={[{ label: 'Animais', href: '/painel/animais' }]}
            />
            <Container title="Preencha os dados do animal para disponibilizá-lo para adoção" className="mt-2">
                <FormContainer>
                    <div className="space-y-4">
                        <Input id="nome" label="Nome do animal" required size="middle" />
                        <Input
                            id="raca"
                            name="animalBreed"
                            placeholder="Ex: Labrador, Siamês, SRD..."
                            label="Raça"
                            required
                            size="large"
                        />

                        <Suspense fallback={<div>Carregando...</div>}>
                            <Select
                                name="animalSize"
                                options={porteOptions}
                                placeholder="Selecione o porte"
                                onChange={() => {}}
                                className="w-full"
                                label="Porte"
                                required
                            />
                        </Suspense>

                        <Input
                            id="weight"
                            name="animalWeight"
                            placeholder="Ex: 10kg, 20kg..."
                            label="Peso"
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <Input
                            id="idade"
                            name="animalAge"
                            placeholder="Ex: 2 anos, 6 meses..."
                            required
                            label="Idade"
                        />
                        <InputUpload />
                    </div>
                </FormContainer>
                <FormFooter>
                    <Button type="secondary" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="primary" onClick={() => router.back()}>
                        Salvar
                    </Button>
                </FormFooter>
            </Container>
        </>
    );
}
