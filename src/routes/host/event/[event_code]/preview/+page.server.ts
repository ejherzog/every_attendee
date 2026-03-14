import { redirect } from '@sveltejs/kit';
import { canUserAccessEvent } from '$lib/server/database';
import { getEventInfoById } from '$lib/server/server';
import { getHostMessage } from '$lib/utils/rsvpForm';

export async function load({ params, locals }) {
	if (!locals.session) redirect(303, '/login');
	const eventCode = params.event_code.toUpperCase();
	const hasAccess = await canUserAccessEvent(locals.session.userId, eventCode);
	if (!hasAccess) redirect(303, '/host/dashboard');
	try {
		let event = await getEventInfoById(eventCode);
		return {
			event: structuredClone(event),
			host_message: getHostMessage(event.hostCount)
		};
	} catch (err: any) {
		redirect(303, `/host/dashboard`);
	}
}
