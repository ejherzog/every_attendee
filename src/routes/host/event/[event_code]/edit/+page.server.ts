import { getEventById } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";

export async function load({ params }) {
    try {
        let event = await getEventById(params.event_code.toUpperCase());
        return {
            event: structuredClone(event)
        };
    } catch (err: any) {
        console.log(err);
        redirect(303, `/host/dashboard`);
    }
}