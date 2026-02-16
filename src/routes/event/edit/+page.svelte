<script lang="ts">
	import {
		Row,
		Col,
		Form,
		InputGroup,
		FormGroup,
		Input,
		Button,
		Alert
	} from '@sveltestrap/sveltestrap';

	const letters_only = new RegExp('([A-Za-z])');

	let unknown_event_code: string;
	let known_event_code: string;
	let unknown_confirm_code: string;

	let event_code: string;
	let event_invalid: boolean;

	let confirm_code: string;
	let confirm_invalid: boolean;

	const handleRsvpSubmit = async (e: Event) => {
		event_invalid = !(event_code.length == 6 && letters_only.test(event_code));
		confirm_invalid = !(confirm_code.length == 4 && letters_only.test(confirm_code));
		if (event_invalid || confirm_invalid) {
			e.preventDefault();
		} else {
			const response = await fetch(`/api/event/${event_code}/confirm/${confirm_code}`, {
				method: 'GET',
				headers: { 'content-type': 'application/json' }
			});
			const validation = await response.json();
			unknown_event_code = validation.unknown_event_code;
			unknown_confirm_code = validation.unknown_confirm_code;
			known_event_code = validation.known_event_code;
			if (unknown_event_code || unknown_confirm_code) e.preventDefault();
		}
	};
</script>

<svelte:head>
	<title>Find RSVP</title>
</svelte:head>

{#if unknown_event_code || unknown_confirm_code}
	<Alert dismissible class="col-md-7 col-10 mx-auto" color="danger">
		{#if unknown_confirm_code}
			We couldn't find an RSVP for event <b>{known_event_code}</b> with the confirmation code
			<b>{unknown_confirm_code}</b>.
		{:else if unknown_event_code}
			Hmmm. We couldn't find an event with code <b>{unknown_event_code}</b>.
		{/if}
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
			<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Edit RSVP</Button>
		</Form>
	</Col>
</Row>
