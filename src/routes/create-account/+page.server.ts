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
	getCohostInviteByToken,
	deleteCohostInviteByToken,
	insertAppUser,
	getUserOptional,
	createPerson,
	addHostToEvent
} from '$lib/server/database';
import { Person } from '$lib/types/People';

export const load: PageServerLoad = async ({ url }) => {
	const cohostToken = url.searchParams.get('cohost_token')?.trim();
	if (cohostToken) {
		const invite = await getCohostInviteByToken(cohostToken);
		if (!invite || !invite.email) {
			return { valid: false, token: null, cohostToken: null, inviteEmail: null, alreadyUsed: false, flow: null };
		}
		const existingUser = await getUserOptional(invite.email.trim().toLowerCase());
		if (existingUser) {
			return { valid: false, token: null, cohostToken: null, inviteEmail: null, alreadyUsed: true, flow: 'cohost' };
		}
		return {
			valid: true,
			token: null,
			cohostToken,
			inviteEmail: invite.email,
			alreadyUsed: false,
			flow: 'cohost' as const,
			eventTitle: invite.eventTitle
		};
	}
	const token = url.searchParams.get('token')?.trim();
	if (!token) {
		return { valid: false, token: null, cohostToken: null, inviteEmail: null, alreadyUsed: false, flow: null };
	}
	const invite = await getHostInviteByToken(token);
	if (!invite) {
		return { valid: false, token: null, cohostToken: null, inviteEmail: null, alreadyUsed: false, flow: null };
	}
	const existingUser = await getUserOptional(invite.email.trim().toLowerCase());
	if (existingUser) {
		return { valid: false, token: null, cohostToken: null, inviteEmail: null, alreadyUsed: true, flow: null };
	}
	return { valid: true, token, cohostToken: null, inviteEmail: invite.email, alreadyUsed: false, flow: 'host' as const, eventTitle: null };
};

const MIN_PASSWORD_LENGTH = 10;

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const actions = {
	default: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const cohostToken = formData.get('cohost_token');
		const token = formData.get('token');
		const emailInput = formData.get('email');
		const displayNameInput = formData.get('display_name');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirm');

		const isCohostFlow = cohostToken && typeof cohostToken === 'string' && cohostToken.trim() !== '';

		if (isCohostFlow) {
			const invite = await getCohostInviteByToken(cohostToken.trim());
			if (!invite) {
				return fail(400, { message: 'This co-host invite is invalid or has expired.', email: '' });
			}
			if (!emailInput || typeof emailInput !== 'string') {
				return fail(400, { message: 'Email is required.', email: '' });
			}
			const trimmedEmail = emailInput.trim().toLowerCase();
			if (trimmedEmail !== invite.email.trim().toLowerCase()) {
				return fail(400, {
					message: 'Use the email address this invite was sent to.',
					email: emailInput
				});
			}
			if (!displayNameInput || typeof displayNameInput !== 'string') {
				return fail(400, { message: 'Display name is required (it will appear on the event).', email: trimmedEmail });
			}
			const displayName = displayNameInput.trim();
			if (displayName.length < 1 || displayName.length > 50) {
				return fail(400, { message: 'Display name must be 1–50 characters.', email: trimmedEmail });
			}
			const existingUser = await getUserOptional(trimmedEmail);
			if (existingUser) {
				return fail(400, {
					message: 'An account already exists for this email. Please log in and accept the co-host invite from your link.',
					email: ''
				});
			}
			if (!password || typeof password !== 'string') {
				return fail(400, { message: 'Password is required.', email: trimmedEmail });
			}
			if (password.length < MIN_PASSWORD_LENGTH) {
				return fail(400, {
					message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
					email: trimmedEmail
				});
			}
			if (password !== passwordConfirm) {
				return fail(400, { message: 'Passwords do not match.', email: trimmedEmail });
			}
			const person = new Person(displayName, undefined);
			person.email = trimmedEmail;
			const personId = parseInt(await createPerson(person), 10);
			const passwordHash = await hashPassword(password);
			const userId = await insertAppUser(trimmedEmail, passwordHash, personId);
			await addHostToEvent(invite.eventId, personId);
			await deleteCohostInviteByToken(cohostToken.trim());
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, userId);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
			throw redirect(303, `/host/event/${invite.eventId}/preview?cohost_accepted=1`);
		}

		if (!token || typeof token !== 'string' || token.trim() === '') {
			return fail(400, { message: 'Invalid or expired link.', email: '' });
		}

		const invite = await getHostInviteByToken(token.trim());
		if (!invite) {
			return fail(400, {
				message: 'This link is invalid or has expired.',
				email: typeof emailInput === 'string' ? emailInput : ''
			});
		}

		if (!emailInput || typeof emailInput !== 'string') {
			return fail(400, {
				message: 'Email is required.',
				email: ''
			});
		}

		const trimmedEmail = emailInput.trim().toLowerCase();
		if (!trimmedEmail) {
			return fail(400, {
				message: 'Email is required.',
				email: emailInput
			});
		}

		if (!isValidEmail(trimmedEmail)) {
			return fail(400, {
				message: 'Please enter a valid email address.',
				email: emailInput
			});
		}

		const inviteEmail = invite.email.trim().toLowerCase();
		if (trimmedEmail !== inviteEmail) {
			return fail(400, {
				message: 'This email does not match the address this invite was sent to.',
				email: emailInput
			});
		}

		const existingUser = await getUserOptional(trimmedEmail);
		if (existingUser) {
			return fail(400, {
				message: 'An account already exists for this invite. If you have an account, please log in.',
				email: ''
			});
		}

		if (!password || typeof password !== 'string') {
			return fail(400, {
				message: 'Password is required',
				email: trimmedEmail
			});
		}

		if (password.length < MIN_PASSWORD_LENGTH) {
			return fail(400, {
				message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
				email: trimmedEmail
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				message: 'Passwords do not match.',
				email: trimmedEmail
			});
		}

		const passwordHash = await hashPassword(password);
		const userId = await insertAppUser(trimmedEmail, passwordHash, null);
		await deleteHostInviteByToken(token.trim());

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, userId);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		throw redirect(303, '/host/dashboard');
	}
} satisfies Actions;
