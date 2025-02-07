<script lang="ts">
	import { Col, Container, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Container class="mt-1 mb-4">
	<h1>Hello, {data.username}!</h1>
</Container>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
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
			<Col xs="6">Edit Event</Col><Col xs="6">Delete Event</Col>
		</Row>
		<hr />
	{/each}
</Container>
