<script lang="ts">
	import { Button, Form, FormGroup, Input, InputGroup, Label } from '@sveltestrap/sveltestrap';
	import { EventCodeValidator } from "$lib/StringValidator";

	let event_code: string;
	let feedback: string;
	let validated: boolean;
	let validator = new EventCodeValidator();

	const handleSubmit = (e: Event) => {
		if (!validator.isAcceptable(event_code)) {
			e.preventDefault();
			feedback = "The event code should be 6 letters (A-Z).";
			validated = true;
		}
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
