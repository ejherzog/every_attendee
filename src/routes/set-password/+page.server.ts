import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createSession,
	generateSessionToken,
	hashPassword,
	setSessionTokenCookie
} from '$lib/server/auth';
import {
	getHostInviteByToken,
	deleteHostInviteByToken,
	insertAppUser,
	getUserOptional
} from '$lib/server/database';

const MIN_PASSWORD_LENGTH = 10;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token || token.trim() === '') {
		return { valid: false, email: null, token: null };
	}
	const invite = await getHostInviteByToken(token.trim());
	if (!invite) {
		return { valid: false, email: null, token: null };
	}
	return { valid: true, email: invite.email, token: token.trim() };
};

export const actions = {
	default: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const token = formData.get('token');
		const username = formData.get('username');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirm');

		if (!token || typeof token !== 'string' || token.trim() === '') {
			return fail(400, { message: 'Invalid or expired link.', username: '', email: null });
		}

		const invite = await getHostInviteByToken(token.trim());
		if (!invite) {
			return fail(400, {
				message: 'This link is invalid or has expired.',
				username: '',
				email: null
			});
		}

		if (!username || typeof username !== 'string') {
			return fail(400, {
				message: 'Username is required',
				username: '',
				email: invite.email
			});
		}

		const trimmedUsername = username.trim();
		if (!trimmedUsername) {
			return fail(400, {
				message: 'Username is required',
				username: String(username),
				email: invite.email
			});
		}

		if (!USERNAME_REGEX.test(trimmedUsername)) {
			return fail(400, {
				message: 'Username can only contain letters, numbers, hyphens and underscores.',
				username: trimmedUsername,
				email: invite.email
			});
		}

		const existingUser = await getUserOptional(trimmedUsername);
		if (existingUser) {
			return fail(400, {
				message: 'Username is already taken.',
				username: trimmedUsername,
				email: invite.email
			});
		}

		if (!password || typeof password !== 'string') {
			return fail(400, {
				message: 'Password is required',
				username: trimmedUsername,
				email: invite.email
			});
		}

		if (password.length < MIN_PASSWORD_LENGTH) {
			return fail(400, {
				message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
				username: trimmedUsername,
				email: invite.email
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				message: 'Passwords do not match.',
				username: trimmedUsername,
				email: invite.email
			});
		}

		const passwordHash = await hashPassword(password);
		const userId = await insertAppUser(trimmedUsername, passwordHash, null);
		await deleteHostInviteByToken(token.trim());

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, userId);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		throw redirect(303, '/host/dashboard');
	}
} satisfies Actions;
