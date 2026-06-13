/**
 * Renderiza um bloco de dados estruturados (JSON-LD) no HTML.
 *
 * Use em Server Components para que o `<script>` esteja no HTML inicial e o
 * Google leia sem depender de JS. Passe um objeto schema.org já montado
 * (ver `structuredData.ts`).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
    return (
        <script
            type="application/ld+json"
            // O conteúdo é controlado pela aplicação (não vem do usuário).
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
