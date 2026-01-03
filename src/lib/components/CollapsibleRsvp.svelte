<script lang="ts">
	import { Row, Col, Button } from '@sveltestrap/sveltestrap';

	export let rsvp;
	let expanded = false;
	let arrow = '➡️';

	function expand(): any {
		expanded = !expanded;
		arrow = expanded ? '⬇️' : '➡️';
	}
</script>

<Row>
	<Col>{rsvp.name}</Col>
	<Col>{rsvp.attending}</Col>
	<Col>
		<Button aria-expanded={expanded} on:click={expand}>More {arrow}</Button>
	</Col>
</Row>
{#if expanded}
	<Row>
		<Col>{rsvp.full_name}</Col>
		<Col>{rsvp.id}</Col>
		<Col>{rsvp.phone} | {rsvp.email}</Col>
	</Row>
	<Row>
		<Col>{rsvp.pronouns}</Col>
		<Col>{rsvp.comments}</Col>
		<Col>{rsvp.diets}</Col>
	</Row>
{/if}
<hr />
