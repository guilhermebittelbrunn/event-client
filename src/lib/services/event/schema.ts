import * as yup from 'yup';

export const createEventRequestSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    slug: yup.string().required('Link de acesso é obrigatório'),
    description: yup.string().optional(),
    dates: yup
        .tuple([yup.date().required(), yup.date().required()])
        .required('Datas de início e término são obrigatórias'),
    image: yup.array().optional(),
});

export type CreateEventSchema = yup.InferType<typeof createEventRequestSchema>;
