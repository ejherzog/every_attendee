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
		<Label>Event Name</Label>
		<Input class="text-end" name="title" required aria-required="true" />

		<Label>Start</Label>
		<Input
			class="text-end"
			required
			aria-required="true"
			name="start_time"
			type="datetime-local"
			bind:value={start_time}
			on:change={endAfterStart}
		/>

		<Label>End</Label>
		<Input
			class="text-end"
			required
			aria-required="true"
			name="end_time"
			type="datetime-local"
			bind:value={end_time}
			on:change={endAfterStart}
		/>

		{#if invalid_end_time}
			<p style="color:crimson">
				🤠🐴 Whooooa there, pardner!<br />The end time must be after the start time.
			</p>
		{/if}

		<Label>Event Code</Label>
		<Input
			class="text-end"
			name="event_code"
			required
			aria-required="true"
			value={data.event_code}
		/>

		<Label>Location</Label>
		<Input class="text-end" name="location" required aria-required="true" />

		<Label>Address</Label>
		<Input class="text-end" name="address" required aria-required="true" />

		<Label>Host</Label>
		<Input disabled class="text-end" value={data.username} />
		<input type="hidden" name="user_id" value={data.user_id} />

		<Label>Image URL</Label>
		<Input
			name="image_url"
			type="url"
			class="text-end"
			bind:value={image_url}
			on:change={isUrlValid}
		/>

		<Label>Image Preview</Label><br />
		{#if valid_url}
			<Image class="rounded shadow align-items-center w-50" src={image_url}></Image><br />
		{:else}
			<p style="color:crimson">🖼️🚫 Hmmm... that doesn't seem to be a valid URL.</p>
		{/if}

		<Label>Description</Label>
		<textarea name="description" style="width: 100%;" use:markdown bind:value={description}
		></textarea>

		<Label>Description Preview</Label>
		<Container style="background-color: #ffffff;" class="form-control text-start max-w-full">
			{@html $markdown}
		</Container>

		<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Create Event</Button>
	</Form>
</Container>
