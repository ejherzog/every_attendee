<script lang="ts">
	import { Col, Container, Form, Image, Input, Label, Row } from '@sveltestrap/sveltestrap';
	import { createMarkdown } from 'svelte-markdown-input';

	const markdown = createMarkdown();

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>RSVP for {data.event.title}</title>
</svelte:head>

<Container class="my-2">
	<h2>Editing {data.event.title}</h2>
</Container>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input type="hidden" name="event_code" value={data.event.id} />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Event Title </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						name="title"
						required
						aria-required="true"
						bind:value={data.event.title}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Event Code </tag>
						<tag class="fst-italic text-responsive fs-6">(optional)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto">
					<Input class="text-end" name="code" bind:value={data.event.id} />
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Start </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
					<Col xs="12" sm="7" lg="3" class="my-auto pb-2">
						<Input class="text-end" type="datetime-local" bind:value={data.event.start_time} />
					</Col>
				<Col xs="12" sm="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">End </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="7" lg="3" class="my-auto pb-2">
					<Input class="text-end" type="datetime-local" bind:value={data.event.end_time} />
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Location </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						name="location"
						required
						aria-required="true"
						bind:value={data.event.location}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Address </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto">
					<Input
						class="text-end"
						name="address"
						required
						aria-required="true"
						bind:value={data.event.address}
					/>
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="4" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Description </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<textarea style="width: 100%;" use:markdown bind:value={data.event.description}></textarea>
				</Col>
				</Row><Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="4" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Description Preview</tag>
						</Label
					>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<Container style="background-color: #ffffff;" class="form-control text-start max-w-full">
						{@html $markdown}
					</Container>
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="4" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Image URL </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<textarea style="width: 100%;" bind:value={data.event.image_url}></textarea>
				</Col>
				</Row><Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Image Preview</tag>
						</Label
					>
				</Col>
				<Col xs="12" md="9" class="my-auto text-center align-items-center">
					<Image
						class="rounded shadow align-items-center w-50"
						src={data.event.image_url}
					/>
				</Col>
			</Row>
		</Form>
	</Container>
</Container>