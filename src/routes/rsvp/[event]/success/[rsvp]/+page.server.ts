import { findRsvp } from '$lib/types/Rsvp';

export function load({ params }) {
    return {
        event: params.event,
        rsvp: params.rsvp
        // TODO find event data by code or return error
    };
}