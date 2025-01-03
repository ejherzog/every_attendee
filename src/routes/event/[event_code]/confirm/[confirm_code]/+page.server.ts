import { findRsvp } from '$lib/types/Rsvp';

export function load({ params }) {
    return {
        event: params.event_code,
        rsvp: params.confirm_code
        // TODO find event data by code or return error
    };
}