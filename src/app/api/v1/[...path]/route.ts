import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Configurar limite de tamanho do body para uploads (App Router)
export const maxDuration = 300; // 5 minutos
export const dynamic = 'force-dynamic';

// Configuração para aumentar limite de body size
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

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
        const targetUrl = new URL(`v1/${targetPath}`, API_BASE_URL).toString();

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

        // Para FormData, remover Content-Type e Content-Length para deixar o browser definir automaticamente
        const contentType = request.headers.get('content-type');

        if (contentType && contentType.includes('multipart/form-data')) {
            delete headers['content-type'];
            delete headers['content-length'];
        }

        // Preparar body para requisições que não são GET
        let body: string | FormData | undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                const contentType = request.headers.get('content-type');

                // Se for FormData (multipart/form-data), manter como FormData
                if (contentType && contentType.includes('multipart/form-data')) {
                    body = await request.formData();
                } else {
                    // Para outros tipos de conteúdo, usar text
                    body = await request.text();
                }
            } catch (error) {
                console.error('Error reading request body:', error);
            }
        }

        // Fazer a requisição para a API externa
        const response = await fetch(fullTargetUrl, {
            method,
            headers,
            body,
            // Timeout mais longo para uploads de arquivos
            signal: AbortSignal.timeout(120000), // 2 minutos
        });

        // Preparar headers de resposta
        const responseHeaders: Record<string, string> = {};

        // Copiar headers relevantes da resposta
        response.headers.forEach((value, key) => {
            // Incluir headers CORS, content-type, content-length e headers de download
            if (
                key.toLowerCase().includes('access-control') ||
                key.toLowerCase().includes('content-type') ||
                key.toLowerCase().includes('content-length') ||
                key.toLowerCase().includes('content-disposition') ||
                key.toLowerCase().includes('content-encoding')
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

        // Para status 204, usar Response nativo
        if (response.status === 204) {
            return new Response(null, {
                status: 204,
                statusText: 'No Content',
                headers: responseHeaders,
            });
        }

        // Verificar se a resposta é binária (arquivo)
        const responseContentType = response.headers.get('content-type') || '';
        const isBinary =
            responseContentType.includes('application/octet-stream') ||
            responseContentType.includes('application/zip') ||
            responseContentType.includes('application/pdf') ||
            responseContentType.includes('image/') ||
            responseContentType.includes('video/') ||
            responseContentType.includes('audio/');

        // Se for binário, retornar como ArrayBuffer
        if (isBinary) {
            const arrayBuffer = await response.arrayBuffer();
            return new NextResponse(arrayBuffer, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
            });
        }

        // Para respostas de texto (JSON, HTML, etc)
        let responseText = '';
        if (response.status !== 205) {
            try {
                responseText = await response.text();
            } catch (error) {
                console.warn('Could not read response text:', error);
                responseText = '';
            }
        }

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
