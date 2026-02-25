'use server';

import { NextResponse } from 'next/server';

export default async function EventMiddleware() {
    /**
     * @note: Por enquanto esse middleware não é usado, pois o {@link EventProvider} valida token na url, como já fiz o redirect para fotos ele perde o token da url e não faz nada na parte de auth
     */

    return NextResponse.next();
}
