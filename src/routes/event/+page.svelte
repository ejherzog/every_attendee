<script lang="ts">
	import { page } from '$app/stores';
	import {
		Accordion,
		AccordionItem,
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

	let confirm_code: string;
	let confirm_invalid: boolean;

	const handleEventSubmit = (e: Event) => {
		if (!(event_code.length == 6 && letters_only.test(event_code))) {
			e.preventDefault();
			event_invalid = true;
		} else {
			event_invalid = false;
		}
	};

	const handleRsvpSubmit = (e: Event) => {
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
	};
</script>

<svelte:head>
	<title>Find Event</title>
</svelte:head>

<Accordion class="mt-3">
	<AccordionItem header="Find Event" active>
		{#if $page.url.searchParams.has('event_code')}
			<Alert class="col-md-7 col-10 mx-auto" color="danger">
				Hmmm. We couldn't find an event with the code <b
					>{$page.url.searchParams.get('event_code')?.toUpperCase()}</b
				>.<br />
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
					<Button type="submit" style="background-color: #0b473b; color: #f9b13e;"
						>Find Event</Button
					>
				</Form>
			</Col>
		</Row>
	</AccordionItem>
	<AccordionItem header="Edit Your RSVP">
		{#if $page.url.searchParams.has('event_code')}
			<Alert class="col-md-7 col-10 mx-auto" color="danger">
				Hmmm. We couldn't find an event with the code <b
					>{$page.url.searchParams.get('event_code')?.toUpperCase()}</b
				>.<br />
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
	</AccordionItem>
</Accordion>
