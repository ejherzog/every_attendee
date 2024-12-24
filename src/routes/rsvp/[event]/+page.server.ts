import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPerson } from '$lib/server/database';
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
        console.log(formData);

        await recordRsvp(formData);

        const event = 'FLMNKR';
        const response = 'RSVPCODE';

        redirect(303, `/rsvp/${event}/success/${response}`);
	},
} satisfies Actions;