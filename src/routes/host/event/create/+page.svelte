<script lang="ts">
	import { Button, Container, Form, Image, Input, Label } from '@sveltestrap/sveltestrap';
	import { createMarkdown } from 'svelte-markdown-input';
	import validator from 'validator';

	/** @type {import('./$types').PageData} */
	export let data;

	const ONE_DAY = 24 * 60 * 60 * 1000;
	let now: number = new Date(Date.now()).setMinutes(0);
	let start_time = new Date(now - ONE_DAY).toISOString().substring(0, 16);
	let end_time = new Date(now + ONE_DAY).toISOString().substring(0, 16);

	let image_url = 'https://images.unsplash.com/photo-1653540883470-bf726448911b';

	let description: string = `## Bigger Heading\nYou can use **markdown** here to *format* your event description.\n#### Smaller Heading\nYou can include\n- bullet\n- points\n\nor\n1. numbered\n2. lists`;
	const markdown = createMarkdown();

	let invalid_end_time = false;
	function endAfterStart(): void {
		let end = Date.parse(end_time).valueOf();
		let start = Date.parse(start_time).valueOf();
		invalid_end_time = end < start;
	}

	let valid_url = true;
	function isUrlValid(): void {
		valid_url = validator.isURL(image_url);
	}
</script>

<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<h3>Create Your Event</h3>

	<Form method="POST">
		<Label for="create-title">Event Name</Label>
		<Input id="create-title" class="text-start" name="title" required aria-required="true" />

		<Label for="create-start_time">Start</Label>
		<Input
			id="create-start_time"
			class="text-start"
			required
			aria-required="true"
			name="start_time"
			type="datetime-local"
			bind:value={start_time}
			on:change={endAfterStart}
			aria-invalid={invalid_end_time}
			aria-describedby={invalid_end_time ? 'create-datetime-error' : undefined}
		/>

		<Label for="create-end_time">End</Label>
		<Input
			id="create-end_time"
			class="text-start"
			required
			aria-required="true"
			name="end_time"
			type="datetime-local"
			bind:value={end_time}
			on:change={endAfterStart}
			aria-invalid={invalid_end_time}
			aria-describedby={invalid_end_time ? 'create-datetime-error' : undefined}
		/>

		{#if invalid_end_time}
			<p id="create-datetime-error" style="color:crimson" role="alert">
				🤠🐴 Whooooa there, pardner!<br />The end time must be after the start time.
			</p>
		{/if}

		<Label for="create-event_code">Event Code</Label>
		<Input
			id="create-event_code"
			class="text-start"
			name="event_code"
			required
			aria-required="true"
			value={data.event_code}
		/>

		<Label for="create-location">Location</Label>
		<Input id="create-location" class="text-start" name="location" required aria-required="true" />

		<Label for="create-address">Address</Label>
		<Input id="create-address" class="text-start" name="address" required aria-required="true" />

		<Label for="create-host">Host</Label>
		<Input id="create-host" disabled class="text-start" value={data.username} />
		<input type="hidden" name="user_id" value={data.user_id} />

		<Label for="create-image_url">Image URL</Label>
		<Input
			id="create-image_url"
			name="image_url"
			type="url"
			class="text-start"
			bind:value={image_url}
			on:change={isUrlValid}
			aria-invalid={!valid_url}
			aria-describedby={!valid_url ? 'create-image_url-error' : undefined}
		/>

		<span id="create-image-preview-label" class="fw-bold">Image Preview</span><br />
		{#if valid_url}
			<Image id="create-image-preview" class="rounded shadow align-items-center w-50" src={image_url} alt="Event image preview" aria-labelledby="create-image-preview-label"></Image><br />
		{:else}
			<p id="create-image_url-error" style="color:crimson" role="alert">🖼️🚫 Hmmm... that doesn't seem to be a valid URL.</p>
		{/if}

		<Label for="create-description">Description</Label>
		<textarea id="create-description" name="description" style="width: 100%;" use:markdown bind:value={description}
		></textarea>

		<span id="create-description-preview-label" class="fw-bold">Description Preview</span>
		<Container id="create-description-preview" style="background-color: #ffffff;" class="form-control text-start max-w-full" role="region" aria-labelledby="create-description-preview-label">
			{@html $markdown}
		</Container>

		<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Create Event</Button>
	</Form>
</Container>
