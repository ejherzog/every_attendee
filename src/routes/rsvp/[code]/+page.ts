/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        code: params.code
    };
}