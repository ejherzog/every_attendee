import type { Actions, PageServerLoad } from './$types';

export function load({ params }) {
    return {
        code: params.code
        // TODO find event data by code or return error
    };
}

export const actions = {
	rsvp: async ({ request }) => {
        console.log(await request.formData());
	},
} satisfies Actions;