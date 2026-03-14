import {
	getEventDetailsById,
	getEventHostsForEdit,
	editEvent,
	createCohostInvite,
	removeCoHostFromEvent
} from '$lib/server/server';
import { canUserAccessEvent, canUserManageEventHosts, getPersonFromUser } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ params, url, locals }) {
	if (!locals.session) redirect(303, '/login');
	const eventCode = params.event_code.toUpperCase();
	const hasAccess = await canUserAccessEvent(locals.session.userId, eventCode);
	if (!hasAccess) redirect(303, '/host/dashboard');
	try {
		const [event, hostsList, canManageHosts, currentUserPersonIdStr] = await Promise.all([
			getEventDetailsById(eventCode),
			getEventHostsForEdit(eventCode),
			canUserManageEventHosts(locals.session.userId, eventCode),
			getPersonFromUser(String(locals.session.userId))
		]);
		const currentUserPersonId = currentUserPersonIdStr ? parseInt(currentUserPersonIdStr, 10) : null;
		return {
			event: structuredClone(event),
			hostsList: structuredClone(hostsList),
			canManageHosts,
			/** When set, this host is the original (primary) and cannot remove themselves. */
			primaryHostPersonId: canManageHosts && currentUserPersonId != null ? currentUserPersonId : null,
			cohost_invite_link: url.searchParams.get('cohost_invite_link'),
			cohost_error: url.searchParams.get('cohost_error')
		};
	} catch (err: any) {
		console.log(err);
		redirect(303, `/host/dashboard`);
	}
}

export const actions = {
	updateEvent: async ({ request }) => {
		const formData = await request.formData();

		const event_code = await editEvent(formData);

		redirect(303, `/host/event/${event_code}/preview`);
	},
	generateCohostLink: async ({ request, params, url, locals }) => {
		if (!locals.session) redirect(303, '/login');
		const eventCode = params.event_code.toUpperCase();
		const canManage = await canUserManageEventHosts(locals.session.userId, eventCode);
		if (!canManage) redirect(303, `/host/event/${eventCode}/edit`);
		const formData = await request.formData();
		const email = (formData.get('cohost_email') as string)?.trim();
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			redirect(303, `/host/event/${eventCode}/edit?cohost_error=${encodeURIComponent('Please enter a valid email address.')}`);
		}
		const { token } = await createCohostInvite(eventCode, locals.session.userId, email);
		const link = `${url.origin}/host/cohost-join?token=${encodeURIComponent(token)}`;
		redirect(303, `/host/event/${eventCode}/edit?cohost_invite_link=${encodeURIComponent(link)}`);
	},
	removeCoHost: async ({ request, params, locals }) => {
		if (!locals.session) redirect(303, '/login');
		const eventCode = params.event_code.toUpperCase();
		const canManage = await canUserManageEventHosts(locals.session.userId, eventCode);
		if (!canManage) redirect(303, `/host/event/${eventCode}/edit`);
		const formData = await request.formData();
		const hostIdStr = formData.get('host_id');
		const hostId = hostIdStr != null ? parseInt(String(hostIdStr), 10) : NaN;
		if (Number.isNaN(hostId)) {
			redirect(303, `/host/event/${eventCode}/edit`);
			return;
		}
		const currentUserPersonIdStr = await getPersonFromUser(String(locals.session.userId));
		const currentUserPersonId = currentUserPersonIdStr ? parseInt(currentUserPersonIdStr, 10) : null;
		if (currentUserPersonId != null && hostId === currentUserPersonId) {
			redirect(303, `/host/event/${eventCode}/edit?cohost_error=${encodeURIComponent("You can't remove yourself as the primary host.")}`);
			return;
		}
		await removeCoHostFromEvent(eventCode, hostId);
		redirect(303, `/host/event/${eventCode}/edit`);
	}
} satisfies Actions;
