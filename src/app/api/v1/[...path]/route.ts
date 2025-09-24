import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'DELETE');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'PATCH');
}

export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams, 'OPTIONS');
}

async function handleRequest(request: NextRequest, { path }: { path: string[] }, method: string) {
    try {
        const targetPath = path.join('/');
        const targetUrl = `${API_BASE_URL}/${targetPath}`;

        // Extrair query parameters da URL original
        const url = new URL(request.url);
        const queryString = url.search;
        const fullTargetUrl = `${targetUrl}${queryString}`;

        // Preparar headers para a requisição
        const headers: Record<string, string> = {};

        // Copiar headers relevantes, excluindo os que podem causar problemas
        const excludeHeaders = ['host', 'origin', 'referer', 'user-agent'];

        request.headers.forEach((value, key) => {
            if (!excludeHeaders.includes(key.toLowerCase())) {
                headers[key] = value;
            }
        });

        // Preparar body para requisições que não são GET
        let body: string | undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                body = await request.text();
            } catch (error) {
                console.error('Error reading request body:', error);
            }
        }

        // Fazer a requisição para a API externa
        const response = await fetch(fullTargetUrl, {
            method,
            headers,
            body,
        });

        // Preparar headers de resposta
        const responseHeaders: Record<string, string> = {};

        // Copiar headers relevantes da resposta
        response.headers.forEach((value, key) => {
            // Incluir headers CORS se necessário
            if (
                key.toLowerCase().includes('access-control') ||
                key.toLowerCase().includes('content-type') ||
                key.toLowerCase().includes('content-length')
            ) {
                responseHeaders[key] = value;
            }
        });

        // Adicionar headers CORS se não estiverem presentes
        if (!responseHeaders['access-control-allow-origin']) {
            responseHeaders['access-control-allow-origin'] = '*';
        }
        if (!responseHeaders['access-control-allow-methods']) {
            responseHeaders['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        }
        if (!responseHeaders['access-control-allow-headers']) {
            responseHeaders['access-control-allow-headers'] =
                'Content-Type, Authorization, refresh-token, event-token';
        }

        // Obter o conteúdo da resposta
        const responseText = await response.text();

        // Retornar a resposta com os headers corretos
        return new NextResponse(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);

        return NextResponse.json(
            {
                error: 'Erro no proxy da API',
                message: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 },
        );
    }
}
