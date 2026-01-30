import * as yup from 'yup';

export const createEventRequestSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    slug: yup.string().required('Link de acesso é obrigatório'),
    description: yup.string().optional(),
    dates: yup
        .tuple([yup.date().required(), yup.date().required()])
        .required('Datas de início e término são obrigatórias'),
    image: yup.array().optional(),
    isForTesting: yup.boolean().optional(),
});

export const updateEventRequestSchema = yup.object({
    name: yup.string().optional(),
    slug: yup.string().optional(),
    description: yup.string().optional(),
    dates: yup.tuple([yup.date().required(), yup.date().required()]).required(),
    image: yup.array().optional(),
    isForTesting: yup.boolean().optional(),
    status: yup.string().optional(),
});

export type CreateEventSchema = yup.InferType<typeof createEventRequestSchema>;
export type UpdateEventSchema = yup.InferType<typeof updateEventRequestSchema>;
