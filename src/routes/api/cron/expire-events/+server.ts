import { deleteExpiredEventsAndAssociatedData } from '$lib/server/expire-events';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const cronSecret = env.CRON_SECRET;

	if (!cronSecret || token !== cronSecret) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { deletedEventIds, deletedPersonIds } =
			await deleteExpiredEventsAndAssociatedData();
		return json({
			ok: true,
			deletedEventIds,
			deletedPersonIds,
			summary: {
				events: deletedEventIds.length,
				people: deletedPersonIds.length
			}
		});
	} catch (err) {
		console.error('expire-events cron failed:', err);
		return json({ error: 'Cleanup failed', ok: false }, { status: 500 });
	}
};
