import { invalidateSession } from '$lib/server/auth';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
    
    invalidateSession(event.locals.session.sessionId);
    event.cookies.delete("session", { path: "/" });
    redirect(303, '/');
}