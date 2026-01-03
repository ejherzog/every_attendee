import { validateEventId } from '$lib/server/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	if (params.event_code) {
		const validEvent = await validateEventId(params.event_code);
		if (!validEvent) return json({ unknown_event_code: params.event_code });
	}
	return json({});
};
