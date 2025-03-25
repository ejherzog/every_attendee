import { validateEventId, validateRsvpId } from '$lib/server/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    if (params.event_code) {
        const validEvent = await validateEventId(params.event_code);
        if (!validEvent) return json({ event_code: false });
        if (params.confirm_code) {
            const validConfirmation = await validateRsvpId(params.event_code, params.confirm_code);
            if (!validConfirmation) return json({ event_code: true, confirm_code: false });
        }
    }
    
    return json({
        event_code: true,
        confirm_code: true
    });
}