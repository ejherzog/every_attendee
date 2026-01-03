<script lang="ts">
	import { Col, Container, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Container class="mt-1 mb-4">
	<h1>Hello, {data.username}!</h1>
</Container>

<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<h3>Your Events</h3>
	<hr />

	{#each data.events as event}
		<Row class="text-start p-1">
			<Col xs="12" md="6">Event: {event.title}</Col>
			<Col xs="12" md="6">Code: {event.id}</Col>
		</Row>
		<Row class="text-start p-1">
			<Col xs="12" md="6">When: {@html event.when}</Col>
			<Col xs="12" md="6">Where: {event.location}<br />{event.address}</Col>
		</Row><Row class="text-center p-1 mt-1">
			<Col xs="6"><a href={`/host/event/${event.id}/edit`}>Edit Event</a></Col>
			<Col xs="6"><a href={`/host/event/${event.id}/rsvps`}>View RSVPs</a></Col>
		</Row>
		<hr />
	{/each}
</Container>
