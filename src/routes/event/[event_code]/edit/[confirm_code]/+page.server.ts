import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getBasicDietList, getBasicPronounList, getEventInfoById, getRsvp, changeRsvp } from '$lib/server/server';
import { containsIgnoreCase } from '$lib/server/formatter';

export async function load({ params }) {
    try {
        let [event, rsvp, pronoun_list, diet_list] = await Promise.all([
            getEventInfoById(params.event_code.toUpperCase()),
            getRsvp(params.event_code.toUpperCase(), params.confirm_code.toUpperCase()),
            getBasicPronounList(),
            getBasicDietList()]);
        return {
            event: structuredClone(event),
            rsvp: structuredClone(rsvp),
            pronoun_list: structuredClone(pronoun_list),
            diet_list: structuredClone(diet_list),
            host_message: event.hostCount && event.hostCount > 1 ? "Anything else we should know?" : "Anything else the host should know?"
        };
    } catch (err: any) {
        redirect(303, `/event/edit?event_code=${params.event_code}&confirm_code=${params.confirm_code}`);
    }
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        if (formData.get("event_code") && request.headers.get("referer") 
            && !containsIgnoreCase(request.headers.get("referer")!, formData.get("event_code")!.toString())) {
            error(400, {
                message: 'Bad request: Event ID in URL does not match Event ID in submitted form.'
            });
        }

        const confirmation_code = await changeRsvp(formData);
        redirect(303, `/event/${formData.get("event_code")}/confirm/${confirmation_code}`);
    },
} satisfies Actions;