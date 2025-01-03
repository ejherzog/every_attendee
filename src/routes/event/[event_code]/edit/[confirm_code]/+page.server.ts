import { redirect, error } from '@sveltejs/kit';
import { getBasicDietList, getBasicPronounList, getEventById, recordRsvp } from '$lib/server/server';

export async function load({ params }) {
    try {
        let [event, pronoun_list, diet_list] = await Promise.all([
            getEventById(params.event_code.toUpperCase()),
            getBasicPronounList(),
            getBasicDietList()]);
        return {
            event: structuredClone(event),
            pronoun_list: structuredClone(pronoun_list),
            diet_list: structuredClone(diet_list),
            host_message: event.hostCount && event.hostCount > 1 ? "Anything else we should know?" : "Anything else the host should know?"
        };
    } catch (err: any) {
        redirect(303, `/event?event_code=${params.event_code}&confirm_code=${params.confirm_code}`);
    }
}