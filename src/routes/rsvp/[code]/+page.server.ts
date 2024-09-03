import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export function load({ params }) {
    return {
        code: params.code
        // TODO find event data by code or return error
    };
}

export const actions = {
	rsvp: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
        const rsvp = Rsvp.fromFormData(formData);
        console.log(rsvp);

        throw redirect(303, '/rsvp/[code]/success');
	},
} satisfies Actions;