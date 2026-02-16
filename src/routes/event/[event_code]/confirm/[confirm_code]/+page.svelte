<script lang="ts">
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>RSVP Successful!</title>
</svelte:head>

<Container class="mt-3 mb-4">
	<h5 class="fst-italic text-responsive">Thanks! We've received your response.</h5>
	<hr />
	<h3>Confirmation Code: <tag class="fw-bolder">{data.rsvp}</tag></h3>
	<hr />
	<h5>Event Code: {data.event}</h5>
	<h6 class="fst-italic text-responsive">
		If you need to edit your response before the event, you will need both the event code and your
		confirmation code.
	</h6>
</Container>
