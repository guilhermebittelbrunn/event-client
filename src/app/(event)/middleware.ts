import { fetchEventBySlug } from '@/shared/actions/event/fetchEvent';
import { isBefore } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export default async function EventMiddleware(request: NextRequest) {
    const event = await fetchEventBySlug(request.nextUrl.pathname.split('/')[2]);

    if (event?.endAt && isBefore(event?.endAt, new Date()) && !request.nextUrl.pathname.includes('/fotos')) {
        return NextResponse.redirect(new URL(`/evento/${event?.slug}/fotos`, request.url));
    }

    return NextResponse.next();
}
