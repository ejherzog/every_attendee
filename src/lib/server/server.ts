import type { DB_Event } from "$lib/types/db/DB_Event";
import { Person } from "$lib/types/People";
import { Event } from "$lib/types/view/Event";
import { SelectOption } from "$lib/types/view/SelectOption";
import { generateRsvpCode } from "./codes";
import { addDietToPerson, addPronounToPerson, createOrFindCustomDiet, createOrFindCustomPronoun, createPerson, createRsvp, findEventById, findHostsByEventId, getBasicDiets, getBasicPronouns } from "./database";
import { getHosts, getWhenFromTimestamps } from "./formatter";

export async function getEventById(code: string): Promise<Event> {

    const eventRows = await findEventById(code);

    if (eventRows.length < 1) throw new Error(`No event found with code ${code}.`);
    if (eventRows.length > 1) throw new Error(`Multiple events found with code ${code}.`);

    const event = eventRows[0] as DB_Event;

    const hostRows = await findHostsByEventId(code);
    let hosts = '';
    if (hostRows.length > 0) {
        hosts = getHosts(hostRows);
    }

    return new Event(event.title, { id: event.id,
        when: getWhenFromTimestamps(event.start_time, event.end_time), hostCount: hostRows.length, hosts,
        location: event.location, address: event.address, description: event.description, image_url: event.image_url
    });
}

export async function getBasicPronounList(): Promise<SelectOption[]> {

    const pronounRows = await getBasicPronouns();

    let pronounList: SelectOption[] = [];
    pronounRows.forEach(pronoun => {
        pronounList.push(new SelectOption(pronoun.nickname, pronoun.id));
    });

    return pronounList;
}

export async function getBasicDietList(): Promise<SelectOption[]> {

    const dietRows = await getBasicDiets();

    let dietList: SelectOption[] = [];
    dietRows.forEach(diet => {
        dietList.push(new SelectOption(diet.details, diet.id));
    });

    return dietList;
}

export async function recordRsvp(formData: any): Promise<string> {

    // Guest
    const guest = new Person(formData.get("name"));
    guest.full_name = formData.get("full_name");
    guest.phone = formData.get("phone");
    guest.email = formData.get("email");

    const guest_id = await createPerson(guest);

    // Pronouns
    const pronouns = JSON.parse(formData.get("pronouns"));
    pronouns.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await addPronounToPerson(guest_id, item.value);
        } else {
            const custom_pronoun_id = await createOrFindCustomPronoun(item.label);
            await addPronounToPerson(guest_id, custom_pronoun_id);
        }
    });

    // Diets
    const diets = JSON.parse(formData.get("diets"));
    diets.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await addDietToPerson(guest_id, item.value);
        } else {
            const custom_diet_id = await createOrFindCustomDiet(item.label);
            await addDietToPerson(guest_id, custom_diet_id);
        }
    });

    // RSVP
    const event_id = formData.get("event_id");
    const attending = formData.get("attending");
    const comments = formData.get("notes");
    const rsvp_id = await generateRsvpCode();

    await createRsvp(rsvp_id, event_id, guest_id, guest_id, attending, comments);

    return rsvp_id;
}