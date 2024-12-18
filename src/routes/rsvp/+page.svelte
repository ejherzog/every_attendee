<script lang="ts">
	import { page } from '$app/stores';
	import { Alert, Button, Col, Form, FormGroup, Input, InputGroup, Row } from '@sveltestrap/sveltestrap';

	const six_letters = new RegExp('([A-Za-z]{6})');
	
	let event_code: string;
	let validated: boolean;

	const handleSubmit = (e: Event) => {
		if (!(event_code.length == 6 && six_letters.test(event_code))) {
			e.preventDefault();
			validated = true;
		} else {
			validated = false;
		}
	}
</script>

{#if $page.url.searchParams.has('code')}
	<Alert color="danger">
		Hmmm. We couldn't find an event with the code <b>{$page.url.searchParams.get('code')?.toUpperCase()}</b>.<br>
		If that wasn't a typo, please contact the event host.
	</Alert>
{/if}

<Row>
	<Col class="col-md-5 col-9">
		<Form on:submit={handleSubmit} class="mx-auto" action={`/rsvp/${event_code}`} method="GET">
			<InputGroup>
				<FormGroup floating label="Enter an event code">
					{#if validated}
						<Input feedback="Event codes should be 6 letters (A-Z)." invalid required bsSize="lg" bind:value={event_code} />
					{:else}
						<Input required bsSize="lg" bind:value={event_code} />
					{/if}
				</FormGroup>
			</InputGroup>
			<Button type="submit" style="background-color: #0b473b; color: #f9b13e;">Find Event</Button>
		</Form>
	</Col>
</Row>

