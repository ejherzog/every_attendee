import { Rsvp } from '$lib/types/Rsvp';
import { redirect } from '@sveltejs/kit';
import { Event } from '$lib/types/Event';
import { User } from '$lib/types/People';
import type { Actions } from './$types';
import { createPerson } from '$lib/server/database';
import { getEventById } from '$lib/server/server';

export async function load({ params }) {
    try {
        await getEventById(params.event);
    } catch (err: any) {
        throw redirect(303, `/rsvp?code=${params.event}`);
    }

    const sampleEvent = new Event("Full Moon-ish Karaoke", new User("Eva", "eowynecho88@gmail.com"));
    sampleEvent.addDescription("Let's howl at the slightly waning full moon: YouTube living room karaoke style.<br><br>We'll provide pizza and cheesesteaks. BYO drinks and any food you'd like to share.<br><br>Friends and partners welcome; please add a note additional guests below or have them RSVP separately.");
    sampleEvent.setLocation("Cooper's House", "4725 Umbria St, Philadelphia, PA 19127");
    sampleEvent.addHosts([new User("Cooper", "cccccc@gmail.com")]);
    console.log(sampleEvent);

    return {  
        // TODO encode and decode data between database and HTML
        event: sampleEvent
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