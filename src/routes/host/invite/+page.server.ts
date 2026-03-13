import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUsername, insertHostInvite } from '$lib/server/database';

const INVITE_EXPIRY_DAYS = 14;

function generateInviteToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const load: PageServerLoad = async ({ locals }) => {
	const username = locals.session
		? await getUsername(locals.session.userId)
		: undefined;
	return { username: username ?? undefined };
};

export const actions = {
	default: async ({ request, url, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (!email || typeof email !== 'string') {
			return fail(400, { message: 'Email is required', email: '' });
		}

		const trimmed = email.trim().toLowerCase();
		if (!trimmed) {
			return fail(400, { message: 'Email is required', email });
		}

		if (!isValidEmail(trimmed)) {
			return fail(400, { message: 'Please enter a valid email address', email: trimmed });
		}

		const token = generateInviteToken();
		const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
		const createdByUserId = locals.session?.userId ?? undefined;

		try {
			await insertHostInvite(trimmed, token, expiresAt, createdByUserId);
		} catch (err: unknown) {
			const code = (err as { code?: string })?.code;
			if (code === '23505') {
				return fail(400, {
					message: 'That email already has a pending invite.',
					email: trimmed
				});
			}
			throw err;
		}

		const inviteLink = new URL('/set-password', url.origin);
		inviteLink.searchParams.set('token', token);

		return {
			success: true,
			inviteLink: inviteLink.toString(),
			email: trimmed
		};
	}
} satisfies Actions;
