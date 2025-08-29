import * as yup from 'yup';

export const createEventRequestSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    slug: yup.string().required('Slug é obrigatório'),
    dates: yup.array().of(yup.date()).required('Datas de início e término são obrigatórias'),
    image: yup.mixed().optional(),
});

export type CreateEventSchema = yup.InferType<typeof createEventRequestSchema>;
