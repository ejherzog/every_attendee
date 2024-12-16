import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createPerson } from '$lib/server/write';
import { lookupEvent } from '$lib/server/read';

export async function load({ params }) {
    return {
        // TODO encode and decode data between database and HTML
        event: await lookupEvent(params.event)
    };
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