<script lang="ts">
	import { Row, Col, Form, InputGroup, FormGroup, Input, Button, Alert } from "@sveltestrap/sveltestrap";

	const letters_only = new RegExp('([A-Za-z])');

	let error: string;

	let event_code: string;
	let event_invalid: boolean;

	let confirm_code: string;
	let confirm_invalid: boolean;

	const handleRsvpSubmit = async (e: Event) => {
		if (!(event_code.length == 6 && letters_only.test(event_code))) {
			e.preventDefault();
			event_invalid = true;
		} else {
			event_invalid = false;
		}
		if (!(confirm_code.length == 4 && letters_only.test(confirm_code))) {
			e.preventDefault();
			confirm_invalid = true;
		} else {
			confirm_invalid = false;
		}
		const response = await fetch(`/api/event/${event_code}/confirm/${confirm_code}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
		const validation = await response.json();
		if (!validation.event_code) {
			error = `We couldn't find an event with code ${event_code}.`;
		} else if (!validation.confirm_code) {
			error = `We couldn't find an RSVP for event ${event_code} with the confirmation code ${confirm_code}.`;
		}
		if (error) {
			e.preventDefault();
		}
	};
</script>

<svelte:head>
	<title>Find RSVP</title>
</svelte:head>
{#if error}
<Alert class="col-md-7 col-10 mx-auto" color="danger">
	Hmmm. {error}
	<br />
	If that wasn't a typo, please contact the event host.
</Alert>
{/if}

		<Row class="mt-3">
			<Col class="col-md-7 col-10 mx-auto">
				<Form
					on:submit={handleRsvpSubmit}
					action={`/event/${event_code}/edit/${confirm_code}`}
					method="GET"
				>
					<InputGroup>
						<FormGroup floating label="Enter an event code">
							{#if event_invalid}
								<Input
									feedback="Event codes should be 6 letters (A-Z)."
									invalid
									required
									bsSize="lg"
									bind:value={event_code}
								/>
							{:else}
								<Input required bsSize="lg" bind:value={event_code} />
							{/if}
						</FormGroup>
					</InputGroup>
					<InputGroup>
						<FormGroup floating label="Enter your confirmation code">
							{#if confirm_invalid}
								<Input
									feedback="Confirmation codes should be 4 letters (A-Z)."
									invalid
									required
									bsSize="lg"
									bind:value={confirm_code}
								/>
							{:else}
								<Input required bsSize="lg" bind:value={confirm_code} />
							{/if}
						</FormGroup>
					</InputGroup>
					<Button type="submit" style="background-color: #0b473b; color: #f9b13e;">Edit RSVP</Button
					>
				</Form>
			</Col>
		</Row>
