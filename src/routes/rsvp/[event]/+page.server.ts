import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser } from '$lib/server/write';

export function load({ params }) {
    return {
        event: params.event
        // TODO find event data by code or return error
    };
}

export const actions = {
	rsvp: async ({ request }) => {
        const formData = await request.formData();
        const rsvp = Rsvp.fromFormData(formData);
        console.log(rsvp);
        const event = 'FLMNKR';
        const response = 'RSVPCODE';
        await createUser('sampleName');
        throw redirect(303, `/rsvp/${event}/success/${response}`);
	},
} satisfies Actions;