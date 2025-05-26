import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const authHandle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    event.locals.session = null;

    if (event.url.pathname.startsWith('/host') || event.url.pathname.startsWith('/api/logout')) {
        const token = event.cookies.get("session") ?? null;

        if (token) {
            const { session }  = await validateSessionToken(token);
            if (session) {
                setSessionTokenCookie(event, token, session.expiresAt);
            } else {
                deleteSessionTokenCookie(event);
            }

            event.locals.session = session;
        }

        if (!event.locals.session) {
            throw redirect(303, "/login");
        }
    }

    const response = await resolve(event);
    return response;
}

export const handle = sequence(authHandle);