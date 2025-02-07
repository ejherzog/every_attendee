import { getUsername } from '$lib/server/database';
import { getUsersEvents } from '$lib/server/server';
import { Event } from "$lib/types/view/Event";
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	if (event.locals.session === null) {
		return redirect(302, "/host/login");
	}
    const username: string = await getUsername(event.locals.session.userId);
	const events: Event[] = await getUsersEvents(event.locals.session.userId);
	return {
		username,
		events: structuredClone(events)
	};
}