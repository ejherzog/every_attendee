import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import validator from 'validator';
import {
	getBasicDietList,
	getBasicPronounList,
	getEventInfoById,
	recordResponse
} from '$lib/server/server';
import { containsIgnoreCase } from '$lib/server/formatter';
import type { Reply } from '$lib/types/Reply';

const NAME_MAX_LENGTH = 50;
const VALID_ATTENDING = ['Yes', 'No', 'Maybe'];

function isValidName(name: unknown): boolean {
	if (typeof name !== 'string') return false;
	const trimmed = name.trim();
	return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
}

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

	if (!person || typeof person !== 'object' || !isValidName((person as Record<string, unknown>).name)) {
		error(400, { message: 'Invalid response: respondent name is required and must be 1-50 characters.' });
	}

	const attending = respondent.attending;
	if (
		typeof attending !== 'string' ||
		!VALID_ATTENDING.includes(attending)
	) {
		error(400, { message: 'Invalid response: respondent must have a valid attending selection.' });
	}

	const phone = ((person as Record<string, unknown>).phone ?? '').toString().trim();
	const email = ((person as Record<string, unknown>).email ?? '').toString().trim();
	const hasValidPhone = phone.length > 0 && validator.isMobilePhone(phone, 'any');
	const hasValidEmail = email.length > 0 && validator.isEmail(email);

	if (!hasValidPhone && !hasValidEmail) {
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
		if (!guestPerson || typeof guestPerson !== 'object' || !isValidName((guestPerson as Record<string, unknown>).name)) {
			error(400, { message: 'Invalid response: each guest must have a valid name (1-50 characters).' });
		}
		const guestAttending = g.attending;
		if (
			typeof guestAttending !== 'string' ||
			!VALID_ATTENDING.includes(guestAttending)
		) {
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
			host_message:
				event.hostCount && event.hostCount > 1
					? 'Anything else we should know?'
					: 'Anything else the host should know?'
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
