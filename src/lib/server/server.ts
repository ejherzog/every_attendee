import type { DB_Event } from "$lib/types/db/DB_Event";
import { Event } from "$lib/types/view/Event";
import { findEventById, findHostsByEventId } from "./database";
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
        when: getWhenFromTimestamps(event.start_time, event.end_time), hostCount: hostRows.length, hosts,
        location: event.location, address: event.address, description: event.description, image_url: event.image_url
    });
}