import { generateEventCode } from "$lib/server/codes";
import { createEvent } from "$lib/server/server";
import { redirect, type Actions } from "@sveltejs/kit";

export async function load() {
    try {
        let code = await generateEventCode();
        return {
            event_code: code
        };
    } catch (err: any) {
        console.log(err);
        redirect(303, `/host/dashboard`);
    }
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        console.log(formData);

        const event_code = await createEvent(formData);
        console.log(event_code);

        redirect(303, `/host/event/${event_code}/preview`);
    },
} satisfies Actions;