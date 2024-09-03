<script lang="ts">
	import { Event, findEvent } from '$lib/types/Event';
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;

	let event: Event = findEvent(data.code);
</script>

<Container class="my-3">
	<h3>You have successfully RSVPed for {event.title}!</h3>
</Container>