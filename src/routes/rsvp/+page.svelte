<script lang="ts">
	import { Button, Form, FormGroup, Input, InputGroup, Label } from '@sveltestrap/sveltestrap';

	let event_code = '';
	let feedback = '';
	let validated = false;
	const six_letters = new RegExp('([A-Z]{6})');

	const handleSubmit = (e: Event) => {
		if (event_code.length == 6) {
			if (!six_letters.test(event_code.toUpperCase())) {
				invalid(e, "The event code should only contain letters A-Z.");
			}
		} else {
			invalid(e, "The event code should be six letters.");
		}
	}

	const invalid = (e: Event, message: string) => {
		e.preventDefault();
		feedback = message;
		validated = true;
	}
</script>

<Form on:submit={handleSubmit} class="mx-auto mt-4 w-25" action={`/rsvp/${event_code}`} method="GET">
	<InputGroup>
		<FormGroup floating label="Enter an event code">
			{#if validated}
				<Input feedback={feedback} invalid required bsSize="lg" bind:value={event_code} />
			{:else}
				<Input required bsSize="lg" bind:value={event_code} />
			{/if}
			
		</FormGroup>
	</InputGroup>
	<Button type="submit">Find Event</Button>
</Form>
