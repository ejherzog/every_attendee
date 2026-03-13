import { inArray } from 'drizzle-orm';
import { db } from './db';
import {
	people,
	events,
	hosts,
	responses,
	guests,
	personPronouns,
	personDiets,
	appUsers,
	appUsersEvents
} from './db';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Returns true if the event's end_time is more than 7 days in the past.
 * end_time is stored as varchar (e.g. ISO string); invalid/missing values are treated as never expired.
 */
function isEventExpired(endTime: string | null): boolean {
	if (!endTime || endTime.trim() === '') return false;
	const parsed = new Date(endTime);
	if (Number.isNaN(parsed.getTime())) return false;
	return parsed.getTime() < Date.now() - ONE_WEEK_MS;
}

/**
 * Deletes events whose end_time is more than 7 days ago, plus their associated
 * RSVPs (responses + guests), hosts, app_users_events links, and then any
 * people who are no longer referenced by any event (and are not app_users).
 */
export async function deleteExpiredEventsAndAssociatedData(): Promise<{
	deletedEventIds: string[];
	deletedPersonIds: number[];
}> {
	const allEvents = await db.select({ id: events.id, endTime: events.endTime }).from(events);
	const expiredIds = allEvents.filter((e) => isEventExpired(e.endTime)).map((e) => e.id);
	const deletedPersonIds: number[] = [];

	if (expiredIds.length === 0) {
		return { deletedEventIds: [], deletedPersonIds: [] };
	}

	await db.transaction(async (tx) => {
		// Collect all response IDs for these events (needed to delete guests first)
		const responsesToDelete = await tx
			.select({ id: responses.id })
			.from(responses)
			.where(inArray(responses.eventId, expiredIds));
		const responseIds = responsesToDelete.map((r) => r.id);

		if (responseIds.length > 0) {
			await tx.delete(guests).where(inArray(guests.responseId, responseIds));
		}

		await tx.delete(responses).where(inArray(responses.eventId, expiredIds));
		await tx.delete(hosts).where(inArray(hosts.eventId, expiredIds));
		await tx.delete(appUsersEvents).where(inArray(appUsersEvents.eventId, expiredIds));
		await tx.delete(events).where(inArray(events.id, expiredIds));

		// Orphaned people: not in app_users and not referenced by any remaining host, response, or guest
		const [appUserPersonIds, hostPersonIds, respondentIds, guestIdsFromResponses, guestIdsFromGuests] =
			await Promise.all([
				tx.select({ personId: appUsers.personId }).from(appUsers),
				tx.select({ hostId: hosts.hostId }).from(hosts),
				tx.select({ respondentId: responses.respondentId }).from(responses),
				tx.select({ guestId: responses.guestId }).from(responses),
				tx.select({ guestId: guests.guestId }).from(guests)
			]);

		const stillReferencedPersonIds = new Set<number>();
		for (const r of appUserPersonIds) {
			if (r.personId != null) stillReferencedPersonIds.add(r.personId);
		}
		for (const r of hostPersonIds) {
			if (r.hostId != null) stillReferencedPersonIds.add(r.hostId);
		}
		for (const r of respondentIds) {
			if (r.respondentId != null) stillReferencedPersonIds.add(r.respondentId);
		}
		for (const r of guestIdsFromResponses) {
			if (r.guestId != null) stillReferencedPersonIds.add(r.guestId);
		}
		for (const r of guestIdsFromGuests) {
			if (r.guestId != null) stillReferencedPersonIds.add(r.guestId);
		}

		const allPeople = await tx.select({ id: people.id }).from(people);
		const orphanedIds = allPeople
			.map((p) => p.id)
			.filter((id) => !stillReferencedPersonIds.has(id));

		if (orphanedIds.length > 0) {
			deletedPersonIds.push(...orphanedIds);
			await tx.delete(personPronouns).where(inArray(personPronouns.personId, orphanedIds));
			await tx.delete(personDiets).where(inArray(personDiets.personId, orphanedIds));
			await tx.delete(people).where(inArray(people.id, orphanedIds));
		}
	});

	return { deletedEventIds: expiredIds, deletedPersonIds };
}
