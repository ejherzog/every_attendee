import type { DB_Event } from "$lib/types/db/DB_Event";
import type { DB_Rsvp } from "$lib/types/db/DB_Rsvp";
import { Person } from "$lib/types/People";
import { Event } from "$lib/types/view/Event";
import { Event_Details } from "$lib/types/view/Event_Details";
import { Rsvp } from "$lib/types/view/Rsvp";
import { SelectOption } from "$lib/types/view/SelectOption";
import { generateRsvpCode } from "./codes";
import * as db from "./database";
import { getHosts, getWhenFromTimestamps } from "./formatter";

export async function getEventInfoById(code: string): Promise<Event> {

    const eventRows = await db.findEventById(code);

    if (eventRows.length < 1) throw new Error(`No event found with code ${code}.`);
    if (eventRows.length > 1) throw new Error(`Multiple events found with code ${code}.`);

    const event = eventRows[0] as DB_Event;

    const hostRows = await db.findHostsByEventId(code);
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

export async function getEventDetailsById(code: string): Promise<Event_Details> {

    const eventRows = await db.findEventById(code);

    if (eventRows.length < 1) throw new Error(`No event found with code ${code}.`);
    if (eventRows.length > 1) throw new Error(`Multiple events found with code ${code}.`);

    const raw_event = eventRows[0] as DB_Event;

    return new Event_Details(raw_event.id, raw_event.title, raw_event.start_time!, raw_event.end_time!,
        raw_event.location!, raw_event.address!, raw_event.description!, raw_event.image_url!
    );
}

export async function getRsvp(event_code: string, confirmation_code: string): Promise<Rsvp> {

    const rsvpRows = await db.findRsvp(event_code, confirmation_code);

    if (rsvpRows.length < 1) throw new Error(`No RSVP found with code ${confirmation_code} for ${event_code}.`);
    if (rsvpRows.length > 1) throw new Error(`Multiple RSVPs found with confirmation code ${confirmation_code} for ${event_code}.`);

    const rsvp = rsvpRows[0] as DB_Rsvp;

    let [pronounRows, dietRows] = await Promise.all([db.getPronounsForPerson(rsvp.guest_id), db.getDietsForPerson(rsvp.guest_id)]);
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

export async function getRsvpsForEvent(event_code: string): Promise<any[]> {

    const rsvpRows = await db.findRsvpsByEventId(event_code);

    const people_ids = rsvpRows.map(rsvpRow => {
        return rsvpRow.guest_id;
    });

    const pronounRows = await db.getPronounsForPeople(people_ids);
    const dietRows = await db.getDietsForPeople(people_ids);

    const rsvps = rsvpRows.map(rsvpRow => {
        return {
            pronouns: pronounRows.filter(pr => pr.id == rsvpRow.guest_id).map(pr => pr.nickname).join(', '),
            diets: dietRows.filter(dr => dr.id == rsvpRow.guest_id).map(dr => dr.details).join(', '),
            ...rsvpRow
        }
    });

    return rsvps;
}

export async function getBasicPronounList(): Promise<SelectOption[]> {

    const pronounRows = await db.getBasicPronouns();

    let pronounList: SelectOption[] = [];
    pronounRows.forEach(pronoun => {
        pronounList.push(new SelectOption(pronoun.nickname, pronoun.id));
    });

    return pronounList;
}

export async function getBasicDietList(): Promise<SelectOption[]> {

    const dietRows = await db.getBasicDiets();

    let dietList: SelectOption[] = [];
    dietRows.forEach(diet => {
        dietList.push(new SelectOption(diet.details, diet.id));
    });

    return dietList;
}

export async function getUsersEvents(app_user_id: number): Promise<Event[]> {

    const events_data = await db.findEventsByUserId(app_user_id);

    return events_data.map(event => {
        return new Event(event.title, {
            id: event.event_id,
            when: getWhenFromTimestamps(event.start_time, event.end_time),
            location: event.location, address: event.address, 
            description: event.description, image_url: event.image_url
        });
    });
}

export async function recordRsvp(formData: any): Promise<string> {

    // Guest
    const guest = new Person(formData.get("name"));
    guest.full_name = formData.get("full_name");
    guest.phone = formData.get("phone");
    guest.email = formData.get("email");

    const guest_id = await db.createPerson(guest);
    Promise.all([addPronouns(formData.get("pronouns"), guest_id), addDiets(formData.get("diets"), guest_id)]);

    // RSVP
    const event_id = formData.get("event_code");
    const attending = formData.get("attending");
    const comments = formData.get("notes");
    const rsvp_id = await generateRsvpCode();

    await db.createRsvp(rsvp_id, event_id, guest_id, guest_id, attending, comments);

    return rsvp_id;
}

export async function changeRsvp(formData: any): Promise<string> {

    // Guest
    const guest_id = formData.get("guest_id");
    await db.updatePerson(guest_id, {
        short_name: formData.get("name"), full_name: formData.get("full_name"),
        phone: formData.get("phone"), email: formData.get("email")
    });

    // Pronouns & Diets
    Promise.all([db.removeAllPronounsFromPerson(guest_id), db.removeAllDietsFromPerson(guest_id)]);
    Promise.all([addPronouns(formData.get("pronouns"), guest_id), addDiets(formData.get("diets"), guest_id)]);

    // RSVP
    const attending = formData.get("attending");
    const comments = formData.get("notes");
    const rsvp_id = formData.get("confirmation_code");

    await db.updateRsvp(rsvp_id, attending, comments);

    return rsvp_id;
}

export async function createEvent(formData: any): Promise<string> {
    return "FAAAKE";
}

export async function editEvent(formData: any): Promise<string> {

    const event_id = formData.get("event_code");
    const title = formData.get("title");
    const start_time = formData.get("start_time");
    const end_time = formData.get("end_time");
    const location = formData.get("location");
    const address = formData.get("address");
    const description = formData.get("description");
    const image_url = formData.get("image_url");

    await db.updateEvent(event_id, title, start_time, end_time, location, address, description, image_url);

    return event_id;
}

async function addPronouns(pronounFormData: any, guest_id: string) {

    const pronouns = JSON.parse(pronounFormData);
    pronouns.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await db.addPronounToPerson(guest_id, item.value);
        } else {
            const custom_pronoun_id = await db.createOrFindCustomPronoun(item.label);
            await db.addPronounToPerson(guest_id, custom_pronoun_id);
        }
    });
}

async function addDiets(dietFormData: any, guest_id: string) {

    const diets = JSON.parse(dietFormData);
    diets.forEach(async (item: { value: any; label: any; }) => {
        if (item.value) {
            await db.addDietToPerson(guest_id, item.value);
        } else {
            const custom_diet_id = await db.createOrFindCustomDiet(item.label);
            await db.addDietToPerson(guest_id, custom_diet_id);
        }
    });
}