import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getBasicDietList, getBasicPronounList, getEventById, recordRsvp } from '$lib/server/server';

export async function load({ params }) {
    try {
        let [event, pronoun_list, diet_list] = await Promise.all([
            getEventById(params.event.toUpperCase()),
            getBasicPronounList(),
            getBasicDietList()]);
        return {
            event: structuredClone(event),
            pronoun_list: structuredClone(pronoun_list),
            diet_list: structuredClone(diet_list),
            host_message: event.hostCount && event.hostCount > 1 ? "Anything else we should know?" : "Anything else the host should know?"
        };
    } catch (err: any) {
        redirect(303, `/rsvp?code=${params.event}`);
    }
}

export const actions = {
    rsvp: async ({ request }) => {
        const formData = await request.formData();

        if (formData.get("event_id") && request.headers.get("referer") &&
            !request.headers.get("referer")!.endsWith(formData.get("event_id")!.toString())) {
            error(400, {
                message: 'Bad request: Event ID in URL does not match Event ID in submitted form.'
            });
        } else {
            const response = await recordRsvp(formData);

            redirect(303, `/rsvp/${formData.get("event_id")}/success/${response}`);
        }
    },
} satisfies Actions;