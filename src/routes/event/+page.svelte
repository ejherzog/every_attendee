<script lang="ts">
	import { page } from '$app/stores';
	import {
		Alert,
		Button,
		Col,
		Form,
		FormGroup,
		Input,
		InputGroup,
		Row
	} from '@sveltestrap/sveltestrap';

	const letters_only = new RegExp('([A-Za-z])');

	let event_code: string;
	let event_invalid: boolean;

	let unknown_event_code: string;

	const handleEventSubmit = async (e: Event) => {
		event_invalid = !(event_code.length == 6 && letters_only.test(event_code));
		if (event_invalid) {
			e.preventDefault();
		} else {
			const response = await fetch(`/api/event/${event_code}`, {
				method: 'GET',
				headers: { 'content-type': 'application/json' }
			});
			const validation = await response.json();
			unknown_event_code = validation.unknown_event_code;
			if (unknown_event_code) e.preventDefault();
		}
	};
</script>

<svelte:head>
	<title>Find Event</title>
</svelte:head>

{#if unknown_event_code}
	<Alert dismissible class="col-md-7 col-10 mx-auto" color="danger">
		Hmmm. We couldn't find an event with code <b>{unknown_event_code}</b>.
		<br />
		If that wasn't a typo, please contact the event host.
	</Alert>
{/if}

<Row class="mt-3">
	<Col class="col-md-7 col-10 mx-auto">
		<Form on:submit={handleEventSubmit} action={`/event/${event_code}`} method="GET">
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
			<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Find Event</Button>
		</Form>
	</Col>
</Row>
<Row class="mt-3">
	<Col class="col-md-7 col-10 mx-auto">
		<a href="/event/edit" class="text-reset"><i>Need to edit your RSVP?</i></a>
	</Col>
</Row>
