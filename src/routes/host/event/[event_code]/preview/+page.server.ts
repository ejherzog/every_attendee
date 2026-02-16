import { redirect } from '@sveltejs/kit';
import { getEventInfoById } from '$lib/server/server';
import { getHostMessage } from '$lib/utils/rsvpForm';

export async function load({ params }) {
	try {
		let event = await getEventInfoById(params.event_code.toUpperCase());
		return {
			event: structuredClone(event),
			host_message: getHostMessage(event.hostCount)
		};
	} catch (err: any) {
		redirect(303, `/host/dashboard`);
	}
}
