import { getUsername } from '$lib/server/database';
import { getUsersEvents } from '$lib/server/server';
import type { RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	const [events, username] = await Promise.all([
		getUsersEvents(event.locals.session.userId),
		getUsername(event.locals.session.userId)
	]);
	return {
		events: structuredClone(events),
		username
	};
}
