import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSession, generateSessionToken, invalidateSession, verifyPassword } from '$lib/server/auth';
import type { DB_AppUser } from '$lib/types/db/DB_AppUser';
import { getUser } from '$lib/server/database';

export const actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();
        const username = formData.get("username");

        if (!username || typeof username !== "string" || username === "") {
            return fail(400, {
                message: "Invalid or missing username",
                username
            });
        }

        const password = formData.get("password");
        if (!password || typeof password !== "string" || password ==="") {
            return fail(400, {
                message: "Invalid or missing password",
                password
            });
        }

        const user: DB_AppUser = await getUser(username);

        if (!user) {
            return fail(400, {
                message: "Username does not exist",
                username
            });
        }

        const validLogin = await verifyPassword(user.password_hash, password);

        if (!validLogin) {
            return fail(401, {
                message: "Invalid password",
                username
            });
        }

        const sessionToken = generateSessionToken();
	    const session = await createSession(sessionToken, user.id);

        cookies.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
            secure: import.meta.env.PROD,
            sameSite: "lax",
            expires: session.expiresAt
        });

        redirect(303, '/host/dashboard');
    },
    logout: async (event) => {
        invalidateSession(event.locals.session.sessionId);
        event.cookies.delete("session", { path: "/" });
        redirect(303, '/');
    },
} satisfies Actions;