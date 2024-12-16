<script lang="ts">
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let event;
	export let rsvp;
</script>

<Container class="my-3">
	<p>{event}</p>
	<p>{rsvp}</p>
</Container>