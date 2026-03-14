import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createSession,
	generateSessionToken,
	verifyPassword
} from '$lib/server/auth';
import { getUserOptional } from '$lib/server/database';

function isSafeRedirect(path: string): boolean {
	try {
		const u = new URL(path, 'http://localhost');
		return (
			u.pathname.startsWith('/host/') ||
			u.pathname.startsWith('/event/') ||
			u.pathname === '/host' ||
			u.pathname === '/event'
		);
	} catch {
		return false;
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const redirectTo = url.searchParams.get('redirect');
	return { redirect: redirectTo && isSafeRedirect(redirectTo) ? redirectTo : null };
};

export const actions = {
	default: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const username = formData.get('username');

		if (!username || typeof username !== 'string' || username === '') {
			return fail(400, {
				message: 'Invalid or missing username',
				username
			});
		}

		const password = formData.get('password');
		if (!password || typeof password !== 'string' || password === '') {
			return fail(400, {
				message: 'Invalid or missing password',
				password
			});
		}

		const user = await getUserOptional(username.trim());

		if (!user) {
			return fail(400, {
				message: 'Username does not exist',
				username
			});
		}

		const validLogin = await verifyPassword(user.password_hash, password);

		if (!validLogin) {
			return fail(401, {
				message: 'Invalid password',
				username
			});
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);

		cookies.set('session', sessionToken, {
			httpOnly: true,
			path: '/',
			secure: import.meta.env.PROD,
			sameSite: 'lax',
			expires: session.expiresAt
		});

		const redirectParam = formData.get('redirect');
		const target =
			typeof redirectParam === 'string' && isSafeRedirect(redirectParam)
				? redirectParam
				: '/host/dashboard';
		redirect(303, target);
	}
} satisfies Actions;
