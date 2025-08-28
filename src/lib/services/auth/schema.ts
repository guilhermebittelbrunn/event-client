import * as yup from 'yup';

export const signUpRequestSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
});

export const signInRequestSchema = yup.object({
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
});

export type SignUpSchema = yup.InferType<typeof signUpRequestSchema>;
export type SignInSchema = yup.InferType<typeof signInRequestSchema>;
