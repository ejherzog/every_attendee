import { getEventDetailsById, getRsvpsForEvent } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";

export async function load({ params }) {
    try {
        let event = await getEventDetailsById(params.event_code.toUpperCase());
        let rsvps = await getRsvpsForEvent(params.event_code.toUpperCase());
        return {
            event: structuredClone(event),
            rsvps: structuredClone(rsvps)
        };
    } catch (err: any) {
        console.log(err);
        redirect(303, `/host/dashboard`);
    }
}