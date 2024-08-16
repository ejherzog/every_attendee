<script lang="ts">
	// @ts-nocheck

	import { Button, Form, FormGroup, Input, InputGroup, Label } from '@sveltestrap/sveltestrap';

	let event_code = '';
	const uppercase_letters = new RegExp('[A-Z]{6}');

	let validateCode = (event_code: string) => {
		if (uppercase_letters.test(event_code)) {
            console.log("valid");
		}
	};
</script>

<Form class="mx-auto mt-4 w-25">
	<InputGroup>
		<FormGroup floating label="Enter an event code">
			<Input bsSize="lg" default={event_code} bind:value={event_code} />
		</FormGroup>
	</InputGroup>
	<Button outline type="submit" style="background-color: #0b473b; color: #f9b13e;" on:click={validateCode(event_code)}>Find Event</Button>
</Form>
