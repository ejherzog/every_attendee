<script lang="ts">
	import CollapsibleRsvp from '$lib/components/CollapsibleRsvp.svelte';
import { Col, Container, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<h3>RSVPs for {data.event.title}</h3>
	<hr />

	{#each data.rsvps as rsvp}
        <CollapsibleRsvp rsvp={rsvp}></CollapsibleRsvp>
    {/each}
</Container>
