import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getCohostInviteByToken,
	deleteCohostInviteByToken,
	getPersonFromUser,
	addHostToEvent
} from '$lib/server/database';

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token')?.trim();
	if (!token) {
		return { valid: false, eventTitle: null, eventCode: null, loggedIn: false, token: null, inviteEmail: null };
	}
	const invite = await getCohostInviteByToken(token);
	if (!invite) {
		return { valid: false, eventTitle: null, eventCode: null, loggedIn: !!locals.session, token: null, inviteEmail: null };
	}
	return {
		valid: true,
		eventTitle: invite.eventTitle,
		eventCode: invite.eventId,
		loggedIn: !!locals.session,
		token,
		inviteEmail: invite.email
	};
};

function isSafeRedirect(path: string): boolean {
	try {
		const u = new URL(path, 'http://localhost');
		// Only allow relative paths under /host or /event
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

export const actions = {
	accept: async ({ request, url, locals }) => {
		if (!locals.session) {
			redirect(303, '/login');
		}
		const token = url.searchParams.get('token')?.trim();
		if (!token) {
			redirect(303, '/host/dashboard');
		}
		const invite = await getCohostInviteByToken(token);
		if (!invite) {
			redirect(303, '/host/dashboard');
		}
		const personIdStr = await getPersonFromUser(String(locals.session.userId));
		if (!personIdStr) {
			redirect(303, '/host/dashboard');
		}
		const personId = parseInt(personIdStr, 10);
		await addHostToEvent(invite.eventId, personId);
		await deleteCohostInviteByToken(token);
		redirect(303, `/host/event/${invite.eventId}/preview?cohost_accepted=1`);
	},
	decline: async ({ url, locals }) => {
		const token = url.searchParams.get('token')?.trim();
		if (token) {
			await deleteCohostInviteByToken(token);
		}
		const redirectTo = url.searchParams.get('redirect');
		if (redirectTo && isSafeRedirect(redirectTo)) {
			redirect(303, redirectTo);
		}
		redirect(303, '/host/dashboard?cohost_declined=1');
	}
} satisfies Actions;
