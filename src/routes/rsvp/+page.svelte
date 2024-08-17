<script lang="ts">
	import { Button, Form, FormGroup, Input, InputGroup, Label } from '@sveltestrap/sveltestrap';

	let event_code = '';
	const six_letters = new RegExp('([A-Z]{6})');

	const handleSubmit = (e: Event) => {
		if (!six_letters.test(event_code.toUpperCase())) {
			e.preventDefault();
			alert("ERROR");
		}
	}
</script>

<Form on:submit={handleSubmit} class="mx-auto mt-4 w-25" action={`/rsvp/${event_code}`} method="GET">
	<InputGroup>
		<FormGroup floating label="Enter an event code">
			<Input feedback="Event codes must be six letters." required bsSize="lg" bind:value={event_code} />
		</FormGroup>
	</InputGroup>
	<Button type="submit">Find Event</Button>
</Form>
