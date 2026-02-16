import { getEventDetailsById, getRsvpsForEvent } from '$lib/server/server';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		let event = await getEventDetailsById(params.event_code.toUpperCase());
		let rsvps = await getRsvpsForEvent(params.event_code.toUpperCase());

		let yesCount = 0;
		let maybeCount = 0;
		let noCount = 0;
		let diets: string[] = [];

		rsvps.forEach((rsvp) => {
			if (rsvp.attending === 'Yes') yesCount++;
			if (rsvp.attending === 'Maybe') maybeCount++;
			if (rsvp.attending === 'No') noCount++;
			if (rsvp.diets) diets.push(rsvp.diets);
		});

		let summary = {
			responses: {
				yes: yesCount,
				no: noCount,
				maybe: maybeCount
			},
			diets: diets
		};

		return {
			event: structuredClone(event),
			rsvps: structuredClone(rsvps),
			summary: structuredClone(summary)
		};
	} catch (err: any) {
		console.log(err);
		redirect(303, `/host/dashboard`);
	}
}
