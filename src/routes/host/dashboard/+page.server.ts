import { getUsername } from '$lib/server/database';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	if (event.locals.session === null) {
		return redirect(302, "/host/login");
	}
    const username: string = await getUsername(event.locals.session.userId);
	return {
		username
	};
}