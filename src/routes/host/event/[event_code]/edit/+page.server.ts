import { getEventDetailsById, editEvent } from '$lib/server/server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ params }) {
	try {
		let event = await getEventDetailsById(params.event_code.toUpperCase());
		return {
			event: structuredClone(event)
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
	}
} satisfies Actions;
