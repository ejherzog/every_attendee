import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	getBasicDietList,
	getBasicPronounList,
	getEventInfoById,
	recordResponse
} from '$lib/server/server';
import { containsIgnoreCase } from '$lib/server/formatter';
import type { Reply } from '$lib/types/Reply';
import {
	hasValidContactStrict,
	isValidAttending,
	isValidNameStrict
} from '$lib/utils/rsvpValidation';
import { getHostMessage } from '$lib/utils/rsvpForm';

function validateResponse(response: unknown): asserts response is Reply {
	if (!response || typeof response !== 'object') {
		error(400, { message: 'Invalid response data.' });
	}

	const r = response as Record<string, unknown>;

	if (!r.respondent || typeof r.respondent !== 'object') {
		error(400, { message: 'Invalid response: missing or invalid respondent.' });
	}

	const respondent = r.respondent as Record<string, unknown>;
	const person = respondent.person;

	if (!person || typeof person !== 'object' || !isValidNameStrict((person as Record<string, unknown>).name)) {
		error(400, { message: 'Invalid response: respondent name is required and must be 1-50 characters.' });
	}

	if (!isValidAttending(respondent.attending)) {
		error(400, { message: 'Invalid response: respondent must have a valid attending selection.' });
	}

	const personRecord = person as Record<string, unknown>;
	if (!hasValidContactStrict(personRecord.phone, personRecord.email)) {
		error(400, { message: 'Invalid response: at least one valid phone or email is required.' });
	}

	const otherGuests = r.other_guests;
	if (!Array.isArray(otherGuests)) {
		error(400, { message: 'Invalid response: other_guests must be an array.' });
	}

	for (const guest of otherGuests) {
		if (!guest || typeof guest !== 'object') {
			error(400, { message: 'Invalid response: each guest must be a valid object.' });
		}
		const g = guest as Record<string, unknown>;
		const guestPerson = g.person;
		if (!guestPerson || typeof guestPerson !== 'object' || !isValidNameStrict((guestPerson as Record<string, unknown>).name)) {
			error(400, { message: 'Invalid response: each guest must have a valid name (1-50 characters).' });
		}
		if (!isValidAttending(g.attending)) {
			error(400, { message: 'Invalid response: each guest must have a valid attending selection.' });
		}
	}
}

export async function load({ params }) {
	try {
		let [event, pronoun_list, diet_list] = await Promise.all([
			getEventInfoById(params.event_code.toUpperCase()),
			getBasicPronounList(),
			getBasicDietList()
		]);
		return {
			event: structuredClone(event),
			pronoun_list: structuredClone(pronoun_list),
			diet_list: structuredClone(diet_list),
			host_message: getHostMessage(event.hostCount)
		};
	} catch (err: any) {
		redirect(303, `/event?event_code=${params.event_code}`);
	}
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		if (!formData.get('event_code') || !formData.get('response')) {
			error(400, {
				message: 'Bad request: Missing event_code or response data fields.'
			});
		}

		if (formData.get('event_code') && request.headers.get('referer')
            && !containsIgnoreCase(request.headers.get('referer')!, formData.get('event_code')!.toString())) {
            error(400, {
                message: 'Bad request: Event ID in URL does not match Event ID in submitted form.'
            });
        }
		
		const event_code: string = formData.get('event_code')!.toString();
		let response: Reply;
		try {
			response = JSON.parse(formData.get('response')!.toString()) as Reply;
		} catch {
			error(400, { message: 'Invalid response data: could not parse JSON.' });
		}

		validateResponse(response);

		const confirmation_code = await recordResponse(event_code, response);
		redirect(303, `/event/${formData.get('event_code')}/confirm/${confirmation_code}`);
	}
} satisfies Actions;
