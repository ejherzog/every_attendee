import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

const authHandle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/host')) {
        const token = event.cookies.get("session") ?? null;

        if (token) {
            const { session, user } = await validateSessionToken(token);
            if (session) {
                setSessionTokenCookie(event, token, session.expiresAt);
            } else {
                deleteSessionTokenCookie(event);
            }

            event.locals.session = session;
            event.locals.user = user;
        }
    }
    
    event.locals.user = null;
    event.locals.session = null;
    const response = await resolve(event);
    return response;
}