import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Ignorar arquivos gerados e dependências
    {
        ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
    },
    // Config base do Next + TypeScript
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    // Integração com Prettier
    {
        plugins: {
            prettier,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        },
    },
];

export default eslintConfig;
