import type { DB_Event } from '$lib/types/db/DB_Event';
import type { DB_Rsvp } from '$lib/types/db/DB_Rsvp';
import { Person } from '$lib/types/People';
import { Rsvp } from '$lib/types/view/Rsvp';
import { Reply } from '$lib/types/Reply';
import { Guest } from '$lib/types/Guest';
import { Event } from '$lib/types/view/Event';
import { Event_Details } from '$lib/types/view/Event_Details';
import { SelectOption } from '$lib/types/view/SelectOption';
import { generateResponseCode, validateEventCode } from './codes';
import * as db from './database';
import { getHosts, getWhenFromTimestamps } from './formatter';

export async function getEventInfoById(code: string): Promise<Event> {
	const eventRows = await db.findEventById(code);

	if (eventRows.length < 1) throw new Error(`No event found with code ${code}.`);
	if (eventRows.length > 1) throw new Error(`Multiple events found with code ${code}.`);

	const event = eventRows[0] as DB_Event;

	const hostRows = await db.findHostsByEventId(code);
	let hosts = '';
	if (hostRows.length > 0) {
		hosts = getHosts(hostRows);
	}

	return new Event(event.title, {
		id: event.id,
		when: getWhenFromTimestamps(event.start_time, event.end_time),
		hostCount: hostRows.length,
		hosts,
		location: event.location,
		address: event.address,
		description: event.description,
		image_url: event.image_url
	});
}

export async function getEventDetailsById(code: string): Promise<Event_Details> {
	const eventRows = await db.findEventById(code);

	if (eventRows.length < 1) throw new Error(`No event found with code ${code}.`);
	if (eventRows.length > 1) throw new Error(`Multiple events found with code ${code}.`);

	const raw_event = eventRows[0] as DB_Event;

	return new Event_Details(
		raw_event.id,
		raw_event.title,
		raw_event.start_time!,
		raw_event.end_time!,
		raw_event.location!,
		raw_event.address!,
		raw_event.description!,
		raw_event.image_url!
	);
}

export async function getResponseForEdit(
	event_code: string,
	confirmation_code: string
): Promise<{ response: Reply; confirmation_code: string }> {
	const guestRows = await db.findResponseWithGuests(event_code, confirmation_code);

	if (guestRows.length < 1)
		throw new Error(`No response found with code ${confirmation_code} for ${event_code}.`);

	const first = guestRows[0] as any;
	const peopleIds = guestRows.map((r: any) => r.guest_id);
	const [pronounRows, dietRows] = await Promise.all([
		db.getPronounsForPeople(peopleIds),
		db.getDietsForPeople(peopleIds)
	]);

	function personFromRow(row: any): Person {
		const person = new Person(row.name, row.full_name);
		person.phone = row.phone;
		person.email = row.email;
		const pronouns = pronounRows
			.filter((pr: any) => pr.id === row.guest_id)
			.map((pr: any) => ({ label: pr.nickname, value: pr.pronoun_id }));
		const diets = dietRows
			.filter((dr: any) => dr.id === row.guest_id)
			.map((dr: any) => ({ label: dr.details, value: dr.diet_id }));
		(person.pronouns as any) = pronouns;
		(person.diets as any) = diets;
		return person;
	}

	const respondentRow = guestRows[0] as any;
	const respondent = new Guest(
		personFromRow(respondentRow),
		respondentRow.attending,
		respondentRow.guest_id
	);

	const otherGuests = guestRows.slice(1).map((row: any) => {
		const person = personFromRow(row);
		return new Guest(person, row.attending, row.guest_id);
	});

	const reply = new Reply(respondent, otherGuests);
	reply.note = first.comments;

	return { response: reply, confirmation_code: first.id };
}

export async function getRsvp(event_code: string, confirmation_code: string): Promise<Rsvp> {
	const rsvpRows = await db.findRsvp(event_code, confirmation_code);

	if (rsvpRows.length < 1)
		throw new Error(`No RSVP found with code ${confirmation_code} for ${event_code}.`);
	if (rsvpRows.length > 1)
		throw new Error(
			`Multiple RSVPs found with confirmation code ${confirmation_code} for ${event_code}.`
		);

	const rsvp = rsvpRows[0] as DB_Rsvp;

	let [pronounRows, dietRows] = await Promise.all([
		db.getPronounsForPerson(rsvp.guest_id),
		db.getDietsForPerson(rsvp.guest_id)
	]);
	const pronouns = pronounRows.map((pronoun) => {
		return { label: pronoun.nickname, value: pronoun.id };
	});
	const diets = dietRows.map((diet) => {
		return { label: diet.details, value: diet.id };
	});

	return new Rsvp(rsvp.name, rsvp.guest_id, pronouns, diets, rsvp.attending, rsvp.id, {
		full_name: rsvp.full_name,
		phone: rsvp.phone,
		email: rsvp.email,
		comments: rsvp.comments
	});
}

export async function getRsvpsForEvent(event_code: string): Promise<any[]> {
	const rsvpRows = await db.findResponsesByEventId(event_code);

	if (rsvpRows.length == 0) return [];

	const people_ids = rsvpRows.map((rsvpRow) => {
		return rsvpRow.guest_id;
	});

	const pronounRows = await db.getPronounsForPeople(people_ids);
	const dietRows = await db.getDietsForPeople(people_ids);

	const rsvps = rsvpRows.map((rsvpRow) => {
		return {
			pronouns: pronounRows
				.filter((pr) => pr.id == rsvpRow.guest_id)
				.map((pr) => pr.nickname)
				.join(', '),
			diets: dietRows
				.filter((dr) => dr.id == rsvpRow.guest_id)
				.map((dr) => dr.details)
				.join(', '),
			...rsvpRow
		};
	});

	return rsvps;
}

export async function getBasicPronounList(): Promise<SelectOption[]> {
	const pronounRows = await db.getBasicPronouns();

	let pronounList: SelectOption[] = [];
	pronounRows.forEach((pronoun) => {
		pronounList.push(new SelectOption(pronoun.nickname, pronoun.id));
	});

	return pronounList;
}

export async function getBasicDietList(): Promise<SelectOption[]> {
	const dietRows = await db.getBasicDiets();

	let dietList: SelectOption[] = [];
	dietRows.forEach((diet) => {
		dietList.push(new SelectOption(diet.details, diet.id));
	});

	return dietList;
}

export async function getUsersEvents(app_user_id: number): Promise<Event[]> {
	const events_data = await db.findEventsByUserId(app_user_id);

	return events_data.map((event) => {
		return new Event(event.title, {
			id: event.event_id,
			when: getWhenFromTimestamps(event.start_time, event.end_time),
			location: event.location,
			address: event.address,
			description: event.description,
			image_url: event.image_url
		});
	});
}

export async function recordResponse(event_code: string, response: Reply) {

	const response_id = await generateResponseCode();
	await db.recordResponse(event_code, response_id, response);
	return response_id;
}

// export async function recordSoloResponse(formData: any): Promise<string> {

// 	// Guest
// 	const guest = new Person(formData.get('guest_0_name'));
// 	guest.phone = formData.get('phone');
// 	guest.email = formData.get('email');

// 	const guest_id = await insertPersonForResponse(guest, formData.get('guest_0_pronouns'), formData.get('guest_0_diets'));

// 	// RSVP
// 	const event_id = formData.get('event_code');
// 	const attending = formData.get('guest_0_attending');
// 	const comments = formData.get('notes');
// 	const response_id = await generateResponseCode();

// 	Promise.all([
// 		db.insertResponse(response_id, event_id, guest_id, comments),
// 		db.insertGuest(response_id, guest_id, attending)
// 	]);

// 	return response_id;
// }

// async function insertPersonForResponse(guest: Person, pronounFormData: any, dietFormData: any): Promise<string> {

// 	const guest_id = await db.createPerson(guest);
// 	Promise.all([
// 		addPronouns(pronounFormData, guest_id),
// 		addDiets(dietFormData, guest_id)
// 	]);
// 	return guest_id;
// }

export async function changeRsvp(formData: any): Promise<string> {
	const confirmation_code = formData.get('confirmation_code')!.toString();
	const response = JSON.parse(formData.get('response')!.toString()) as Reply;

	const respondent = response.respondent;
	const respondent_guest_id = respondent.person_id;
	if (!respondent_guest_id) {
		throw new Error('Respondent must have person_id when editing.');
	}

	// Update respondent
	await db.updatePerson(Number(respondent_guest_id), {
		short_name: respondent.person.name,
		full_name: respondent.person.full_name || undefined,
		phone: respondent.person.phone || undefined,
		email: respondent.person.email || undefined
	});
	await db.removeAllPronounsFromPerson(String(respondent_guest_id));
	await db.removeAllDietsFromPerson(String(respondent_guest_id));
	await addPronounsFromData(respondent.person.pronouns, String(respondent_guest_id));
	await addDietsFromData(respondent.person.diets, String(respondent_guest_id));

	// Update response comments and respondent's guest attending
	await db.updateRsvp(
		confirmation_code,
		String(respondent_guest_id),
		respondent.attending,
		response.note ?? ''
	);

	// Sync other guests
	const currentOtherIds = await db.findOtherGuestIds(
		confirmation_code,
		String(respondent_guest_id)
	);
	const submittedPersonIds = new Set(
		response.other_guests
			.filter((g) => g.person_id != null)
			.map((g) => g.person_id!)
	);

	for (const guest of response.other_guests) {
		if (guest.person_id) {
			// Update existing guest
			await db.updatePerson(Number(guest.person_id), {
				short_name: guest.person.name,
				full_name: guest.person.full_name || undefined,
				phone: guest.person.phone || undefined,
				email: guest.person.email || undefined
			});
			await db.removeAllPronounsFromPerson(String(guest.person_id));
			await db.removeAllDietsFromPerson(String(guest.person_id));
			await addPronounsFromData(guest.person.pronouns, String(guest.person_id));
			await addDietsFromData(guest.person.diets, String(guest.person_id));
			await db.updateGuestAttending(
				confirmation_code,
				String(guest.person_id),
				guest.attending
			);
		} else {
			// Insert new guest
			const person_id = await db.createPerson(guest.person);
			await addPronounsFromData(guest.person.pronouns, String(person_id));
			await addDietsFromData(guest.person.diets, String(person_id));
			await db.insertGuestStandalone(confirmation_code, String(person_id), guest.attending);
		}
	}

	// Delete removed guests
	for (const guest_id of currentOtherIds) {
		if (!submittedPersonIds.has(guest_id)) {
			await db.deleteGuest(confirmation_code, String(guest_id));
		}
	}

	return confirmation_code;
}

async function addPronounsFromData(pronounsData: any, guest_id: string) {
	if (!pronounsData) return;
	const pronouns = typeof pronounsData === 'string' ? JSON.parse(pronounsData) : pronounsData;
	for (const item of Array.isArray(pronouns) ? pronouns : []) {
		if (item?.value) {
			await db.addPronounToPerson(guest_id, String(item.value));
		} else if (item?.label) {
			const id = await db.createOrFindCustomPronoun(item.label);
			await db.addPronounToPerson(guest_id, id);
		}
	}
}

async function addDietsFromData(dietsData: any, guest_id: string) {
	if (!dietsData) return;
	const diets = typeof dietsData === 'string' ? JSON.parse(dietsData) : dietsData;
	for (const item of Array.isArray(diets) ? diets : []) {
		if (item?.value) {
			await db.addDietToPerson(guest_id, String(item.value));
		} else if (item?.label) {
			const id = await db.createOrFindCustomDiet(item.label);
			await db.addDietToPerson(guest_id, id);
		}
	}
}

export async function createEvent(formData: any): Promise<string | undefined> {
	// validate host_id
	const app_user_id = formData.get('user_id');
	const host_id = await db.getPersonFromUser(app_user_id);

	// validate event_code
	const event_code = formData.get('event_code');
	if (await validateEventCode(event_code)) {
		// create event
		const title = formData.get('title');
		const start_time = formData.get('start_time');
		const end_time = formData.get('end_time');
		const location = formData.get('location');
		const address = formData.get('address');
		const description = formData.get('description');
		const image_url = formData.get('image_url');

		await db.createEvent(
			event_code,
			title,
			host_id,
			start_time,
			end_time,
			location,
			address,
			description,
			image_url
		);

		await db.addEventToAppUser(event_code, app_user_id);

		return event_code;
	}
	return undefined;
}

export async function editEvent(formData: any): Promise<string> {
	const event_id = formData.get('event_code');
	const title = formData.get('title');
	const start_time = formData.get('start_time');
	const end_time = formData.get('end_time');
	const location = formData.get('location');
	const address = formData.get('address');
	const description = formData.get('description');
	const image_url = formData.get('image_url');

	await db.updateEvent(
		event_id,
		title,
		start_time,
		end_time,
		location,
		address,
		description,
		image_url
	);

	return event_id;
}

