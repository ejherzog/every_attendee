import { getUsersEvents } from '$lib/server/server';
import { Event } from "$lib/types/view/Event";
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	if (event.locals.session === null) {
		return redirect(302, "/host/auth");
	}
	const events: Event[] = await getUsersEvents(event.locals.session.userId);
	return {
		events: structuredClone(events)
	};
}