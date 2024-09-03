<script lang="ts">
	import { Event, findEvent } from '$lib/types/Event';
	import { findRsvp, type Rsvp } from '$lib/types/Rsvp';
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;

	let event: Event = findEvent(data.event);
	let rsvp: string = findRsvp(data.rsvp);
</script>

<Container class="my-3">
	<h3>You have successfully RSVPed<br>for {event.title}!</h3>
	<p>{rsvp}</p>
</Container>