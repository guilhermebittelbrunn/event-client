import * as yup from 'yup';

export const createMemoryRequestSchema = yup.object({
    message: yup.string().optional(),
    image: yup.mixed().required('É necesário uma foto para salvar uma memória'),
});

export type CreateMemorySchema = yup.InferType<typeof createMemoryRequestSchema>;
