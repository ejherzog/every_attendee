import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return json({
        event_code: true
    });
}