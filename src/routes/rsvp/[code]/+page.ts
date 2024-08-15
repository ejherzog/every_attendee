import { Event } from "$lib/Event";
import { User } from "$lib/User";

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        code: params.code
    };
}