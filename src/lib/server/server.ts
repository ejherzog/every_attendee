import type { DB_Event } from "$lib/types/db/DB_Event";
import type { DB_Rsvp } from "$lib/types/db/DB_Rsvp";
import { Person } from "$lib/types/People";
import { Event } from "$lib/types/view/Event";
import { Rsvp } from "$lib/types/view/Rsvp";
import { SelectOption } from "$lib/types/view/SelectOption";
import { generateRsvpCode } from "./codes";
import { addDietToPerson, addPronounToPerson, createOrFindCustomDiet, createOrFindCustomPronoun, createPerson, createRsvp, findEventById, findHostsByEventId, findRsvp, getBasicDiets, getBasicPronouns, getDietsForPerson, getPronounsForPerson, removeAllDietsFromPerson, removeAllPronounsFromPerson, updatePerson, updateRsvp } from "./database";
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

    return new Event(event.title, {
        id: event.id,
        when: getWhenFromTimestamps(event.start_time, event.end_time), hostCount: hostRows.length, hosts,
        location: event.location, address: event.address, description: event.description, image_url: event.image_url
    });
}

export async function getRsvp(event_code: string, confirmation_code: string): Promise<Rsvp> {

    const rsvpRows = await findRsvp(event_code, confirmation_code);

    if (rsvpRows.length < 1) throw new Error(`No RSVP found with code ${confirmation_code} for ${event_code}.`);
    if (rsvpRows.length > 1) throw new Error(`Multiple RSVPs found with confirmation code ${confirmation_code} for ${event_code}.`);

    const rsvp = rsvpRows[0] as DB_Rsvp;

    let [pronounRows, dietRows] = await Promise.all([getPronounsForPerson(rsvp.guest_id), getDietsForPerson(rsvp.guest_id)]);
    const pronouns = pronounRows.map(pronoun => {
        return { label: pronoun.nickname, value: pronoun.id }
    });
    const diets = dietRows.map(diet => {
        return { label: diet.details, value: diet.id }
    });

    return new Rsvp(rsvp.name, rsvp.guest_id, pronouns, diets, rsvp.attending, rsvp.id,
        { full_name: rsvp.full_name, phone: rsvp.phone, email: rsvp.email, comments: rsvp.comments }
    );
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
    Promise.all([addPronouns(formData.get("pronouns"), guest_id), addDiets(formData.get("diets"), guest_id)]);

    // RSVP
    const event_id = formData.get("event_code");
    const attending = formData.get("attending");
    const comments = formData.get("notes");
    const rsvp_id = await generateRsvpCode();

    await createRsvp(rsvp_id, event_id, guest_id, guest_id, attending, comments);

    return rsvp_id;
}

export async function changeRsvp(formData: any): Promise<string> {

    // Guest
    const guest_id = formData.get("guest_id");
    await updatePerson(guest_id, {
        short_name: formData.get("name"), full_name: formData.get("full_name"),
        phone: formData.get("phone"), email: formData.get("email")
    });

    // Pronouns & Diets
    Promise.all([removeAllPronounsFromPerson(guest_id), removeAllDietsFromPerson(guest_id)]);
    Promise.all([addPronouns(formData.get("pronouns"), guest_id), addDiets(formData.get("diets"), guest_id)]);

    // RSVP
    const attending = formData.get("attending");
    const comments = formData.get("notes");
    const rsvp_id = formData.get("confirmation_code");

    await updateRsvp(rsvp_id, attending, comments);

    return rsvp_id;
}

async function addPronouns(pronounFormData: any, guest_id: string) {

    const pronouns = JSON.parse(pronounFormData);
    pronouns.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await addPronounToPerson(guest_id, item.value);
        } else {
            const custom_pronoun_id = await createOrFindCustomPronoun(item.label);
            await addPronounToPerson(guest_id, custom_pronoun_id);
        }
    });
}

async function addDiets(dietFormData: any, guest_id: string) {

    const diets = JSON.parse(dietFormData);
    diets.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await addDietToPerson(guest_id, item.value);
        } else {
            const custom_diet_id = await createOrFindCustomDiet(item.label);
            await addDietToPerson(guest_id, custom_diet_id);
        }
    });
}