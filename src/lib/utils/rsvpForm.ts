import { Guest } from '$lib/types/Guest';
import { Person } from '$lib/types/People';
import { Reply } from '$lib/types/Reply';
import type { Rsvp } from '$lib/types/view/Rsvp';

export function getHostMessage(hostCount: number | undefined): string {
	return hostCount && hostCount > 1
		? 'Anything else we should know?'
		: 'Anything else the host should know?';
}

/**
 * Converts an Rsvp (view/single-guest) into a Reply for use in the edit form.
 */
export function rsvpToReply(rsvp: Rsvp): Reply {
	const person = new Person(rsvp.name, rsvp.full_name);
	person.phone = rsvp.phone;
	person.email = rsvp.email;
	(person.pronouns as unknown) = rsvp.pronouns ?? [];
	(person.diets as unknown) = rsvp.diets ?? [];

	const respondent = new Guest(person, rsvp.attending ?? '');
	const reply = new Reply(respondent, []);
	reply.note = rsvp.comments;
	return reply;
}
