<script lang="ts">
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>RSVP Successful!</title>
</svelte:head>

<Container class="my-3">
	<p>{data.event}</p>
	<p>{data.rsvp}</p>
</Container>