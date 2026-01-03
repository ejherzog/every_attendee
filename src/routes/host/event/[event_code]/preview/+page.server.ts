import { redirect } from '@sveltejs/kit';
import { getEventInfoById } from '$lib/server/server';

export async function load({ params }) {
	try {
		let event = await getEventInfoById(params.event_code.toUpperCase());
		return {
			event: structuredClone(event),
			host_message:
				event.hostCount && event.hostCount > 1
					? 'Anything else we should know?'
					: 'Anything else the host should know?'
		};
	} catch (err: any) {
		redirect(303, `/host/dashboard`);
	}
}
