<script lang="ts">
	import { Container } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Container class="my-3">
	<p>{data.event}</p>
	<p>{data.rsvp}</p>
</Container>