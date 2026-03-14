import {
	getEventDetailsById,
	getEventHostsForEdit,
	editEvent,
	createCohostInvite,
	removeCoHostFromEvent
} from '$lib/server/server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ params, url }) {
	try {
		const eventCode = params.event_code.toUpperCase();
		const [event, hostsList] = await Promise.all([
			getEventDetailsById(eventCode),
			getEventHostsForEdit(eventCode)
		]);
		return {
			event: structuredClone(event),
			hostsList: structuredClone(hostsList),
			cohost_invite_link: url.searchParams.get('cohost_invite_link'),
			cohost_error: url.searchParams.get('cohost_error')
		};
	} catch (err: any) {
		console.log(err);
		redirect(303, `/host/dashboard`);
	}
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const event_code = await editEvent(formData);

		redirect(303, `/host/event/${event_code}/preview`);
	},
	generateCohostLink: async ({ request, params, url, locals }) => {
		if (!locals.session) redirect(303, '/login');
		const formData = await request.formData();
		const email = (formData.get('cohost_email') as string)?.trim();
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			redirect(303, `/host/event/${params.event_code}/edit?cohost_error=${encodeURIComponent('Please enter a valid email address.')}`);
		}
		const eventCode = params.event_code.toUpperCase();
		const { token } = await createCohostInvite(eventCode, locals.session.userId, email);
		const link = `${url.origin}/host/cohost-join?token=${encodeURIComponent(token)}`;
		redirect(303, `/host/event/${eventCode}/edit?cohost_invite_link=${encodeURIComponent(link)}`);
	},
	removeCoHost: async ({ request, params }) => {
		const formData = await request.formData();
		const eventCode = params.event_code.toUpperCase();
		const hostIdStr = formData.get('host_id');
		const hostId = hostIdStr != null ? parseInt(String(hostIdStr), 10) : NaN;
		if (!Number.isNaN(hostId)) {
			await removeCoHostFromEvent(eventCode, hostId);
		}
		redirect(303, `/host/event/${eventCode}/edit`);
	}
} satisfies Actions;
