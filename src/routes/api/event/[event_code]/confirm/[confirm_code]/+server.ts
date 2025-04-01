import { validateEventId, validateRsvpId } from '$lib/server/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    
    if (params.event_code) {
        const validEvent = await validateEventId(params.event_code);
        if (!validEvent) return json({ unknown_event_code: params.event_code });
        if (params.confirm_code) {
            const validConfirmation = await validateRsvpId(params.event_code, params.confirm_code);
            if (!validConfirmation) return json({ known_event_code: params.event_code, unknown_confirm_code: params.confirm_code });
        }
    }
    return json({});
}