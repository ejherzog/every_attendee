import { createEvent } from "$lib/server/server";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        console.log(formData);

        // const event_code = await createEvent(formData);

        // redirect(303, `/host/event/${event_code}/preview`);
    },
} satisfies Actions;