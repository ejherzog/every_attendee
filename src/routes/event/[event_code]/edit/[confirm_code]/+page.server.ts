import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	getBasicDietList,
	getBasicPronounList,
	getEventInfoById,
	getResponseForEdit,
	changeRsvp
} from '$lib/server/server';
import { containsIgnoreCase } from '$lib/server/formatter';
import {
	hasValidContactStrict,
	isValidAttending,
	isValidNameStrict
} from '$lib/utils/rsvpValidation';
import { getHostMessage } from '$lib/utils/rsvpForm';

function validateEditFormData(formData: FormData) {
	const responseStr = formData.get('response');
	if (!responseStr) {
		error(400, { message: 'Invalid request: missing response data.' });
	}

	let response: unknown;
	try {
		response = JSON.parse(responseStr.toString());
	} catch {
		error(400, { message: 'Invalid response data: could not parse JSON.' });
	}

	const r = response as Record<string, unknown>;
	if (!r?.respondent || typeof r.respondent !== 'object') {
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
		const event_code = params.event_code.toUpperCase();
		const confirm_code = params.confirm_code.toUpperCase();
		let [event, responseData, pronoun_list, diet_list] = await Promise.all([
			getEventInfoById(event_code),
			getResponseForEdit(event_code, confirm_code),
			getBasicPronounList(),
			getBasicDietList()
		]);
		return {
			event: structuredClone(event),
			response: structuredClone(responseData.response),
			confirmation_code: responseData.confirmation_code,
			pronoun_list: structuredClone(pronoun_list),
			diet_list: structuredClone(diet_list),
			host_message: getHostMessage(event.hostCount)
		};
	} catch (err: any) {
		redirect(
			303,
			`/event/edit?event_code=${params.event_code}&confirm_code=${params.confirm_code}`
		);
	}
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		if (
			formData.get('event_code') &&
			request.headers.get('referer') &&
			!containsIgnoreCase(request.headers.get('referer')!, formData.get('event_code')!.toString())
		) {
			error(400, {
				message: 'Bad request: Event ID in URL does not match Event ID in submitted form.'
			});
		}

		if (!formData.get('confirmation_code') || !formData.get('response')) {
			error(400, { message: 'Bad request: missing confirmation_code or response.' });
		}

		validateEditFormData(formData);

		const confirmation_code = await changeRsvp(formData);
		redirect(303, `/event/${formData.get('event_code')}/confirm/${confirmation_code}`);
	}
} satisfies Actions;
