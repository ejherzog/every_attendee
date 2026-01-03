import { getUsername } from '$lib/server/database';
import { type RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	if (event.locals.session === null) {
		return { username: undefined };
	}
	const username: string = await getUsername(event.locals.session.userId);
	const user_id: string = event.locals.session.userId;
	return {
		username,
		user_id
	};
}
