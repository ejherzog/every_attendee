<script lang="ts">
	import { Event, findEvent } from "$lib/types/Event";
	import { Card, CardBody } from "@sveltestrap/sveltestrap";

    /** @type {import('./$types').PageData} */
	export let data;

	let event: Event = findEvent(data.code);
</script>

<Card>
    <CardBody>
        {JSON.stringify(event)}
    </CardBody>
</Card>