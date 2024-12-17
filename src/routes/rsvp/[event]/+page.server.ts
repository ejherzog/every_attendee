import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPerson } from '$lib/server/database';
import { getEventById } from '$lib/server/server';

export async function load({ params }) {
    try {
        const event = await getEventById(params.event.toUpperCase());
        return {
            event: structuredClone(event),
            host_message: event.hostCount && event.hostCount > 1 ? "Anything else we should know?" : "Anything else the host should know?"
        };
    } catch (err: any) {
        throw redirect(303, `/rsvp?code=${params.event}`);
    }
}

export const actions = {
	rsvp: async ({ request }) => {
        const formData = await request.formData();
        const rsvp = Rsvp.fromFormData(formData);
        console.log(rsvp);
        const event = 'FLMNKR';
        const response = 'RSVPCODE';
        const result = await createPerson(rsvp.guest);
        console.log(result);
        throw redirect(303, `/rsvp/${event}/success/${response}`);
	},
} satisfies Actions;