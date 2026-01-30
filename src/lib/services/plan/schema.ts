import * as yup from 'yup';

export const updatePlanRequestSchema = yup.object({
    description: yup.string().optional(),
    price: yup.number().optional(),
    enabled: yup.boolean().optional(),
});

export type UpdatePlanSchema = yup.InferType<typeof updatePlanRequestSchema>;
