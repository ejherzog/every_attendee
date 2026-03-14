<script lang="ts">
	import { Button, Col, Container, Form, Image, Input, Label, Row } from '@sveltestrap/sveltestrap';
	import { createMarkdown } from 'svelte-markdown-input';

	/** @type {import('./$types').PageData} */
	export let data;

	const markdown = createMarkdown();
</script>

<svelte:head>
	<title>RSVP for {data.event.title}</title>
</svelte:head>

<Container class="my-2">
	<h2>Editing {data.event.title}</h2>
</Container>

<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input type="hidden" name="event_code" value={data.event.id} />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label for="edit-title"
						><tag class="text-reset fw-bold text-responsive fs-5">Event Title </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						id="edit-title"
						class="text-start"
						name="title"
						required
						aria-required="true"
						bind:value={data.event.title}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label for="edit-code"><tag class="text-reset fw-bold text-responsive fs-5">Event Code </tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto">
					<Input id="edit-code" disabled class="text-start" name="code" bind:value={data.event.id} />
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" class="my-auto">
					<span class="text-reset fw-bold text-responsive fs-5">Hosts</span>
					<p class="text-muted small mb-1">These names appear in the “Hosted by” section on the event page. Share a link with co-hosts so they can accept and be listed.</p>
					<ul class="list-unstyled mb-2">
						{#each data.hostsList as host}
							<li class="d-flex align-items-center gap-2 mb-1">
								<span>{host.name}</span>
								<Form method="POST" action="?/removeCoHost" class="d-inline">
									<input type="hidden" name="host_id" value={host.hostId} />
									<Button type="submit" color="light" size="sm" class="py-0">Remove</Button>
								</Form>
							</li>
						{/each}
					</ul>
					{#if data.cohost_invite_link}
						<p class="text-success small fw-bold mb-1">Share this link with your co-host (it expires in 14 days):</p>
						<div class="d-flex flex-wrap gap-2 align-items-center mb-2">
							<Input type="text" readonly value={data.cohost_invite_link} id="cohost-invite-link" class="font-monospace flex-grow-1" style="min-width: 12rem;" />
							<Button
								type="button"
								class="btn btn-sm"
								style="background-color: var(--brand-green); color: var(--brand-gold);"
								on:click={() => {
									const input = document.getElementById('cohost-invite-link');
									if (input instanceof HTMLInputElement) {
										input.select();
										navigator.clipboard.writeText(input.value);
									}
								}}
							>
								Copy link
							</Button>
						</div>
						<p class="small text-muted mb-0">They'll log in or create an account with that email, then accept so their name appears as a host.</p>
						<p class="small mb-0"><a href="/host/event/{data.event.id}/edit">Generate another link</a></p>
					{:else}
						<Form method="POST" action="?/generateCohostLink" class="d-flex flex-wrap gap-2 align-items-end">
							<div>
								<Label for="cohost-email" class="small mb-0">Co-host email</Label>
								<Input id="cohost-email" type="email" name="cohost_email" placeholder="cohost@example.com" class="form-control form-control-sm" required />
							</div>
							<Button type="submit" color="primary" size="sm">Generate "be my co-host" link</Button>
						</Form>
						{#if data.cohost_error}
							<p class="text-danger small mt-1 mb-0" role="alert">{data.cohost_error}</p>
						{/if}
						<p class="small text-muted mt-1 mb-0">They'll log in or create an account with this email, then accept to be listed as a host.</p>
					{/if}
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label for="edit-start_time"><tag class="text-reset fw-bold text-responsive fs-5">Start </tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
					<Input
						id="edit-start_time"
						class="text-start"
						name="start_time"
						type="datetime-local"
						bind:value={data.event.start_time}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label for="edit-end_time"><tag class="text-reset fw-bold text-responsive fs-5">End </tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input
						id="edit-end_time"
						class="text-start"
						name="end_time"
						type="datetime-local"
						bind:value={data.event.end_time}
					/>
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label for="edit-location"
						><tag class="text-reset fw-bold text-responsive fs-5">Location </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						id="edit-location"
						class="text-start"
						name="location"
						required
						aria-required="true"
						bind:value={data.event.location}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label for="edit-address"
						><tag class="text-reset fw-bold text-responsive fs-5">Address </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="5" class="my-auto">
					<Input
						id="edit-address"
						class="text-start"
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
					<Label for="edit-description"
						><tag class="text-reset fw-bold text-responsive fs-5">Description </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<textarea
						id="edit-description"
						name="description"
						style="width: 100%;"
						use:markdown
						bind:value={data.event.description}
					></textarea>
				</Col>
			</Row><Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="4" lg="3" class="my-auto">
					<span id="edit-description-preview-label" class="fw-bold text-reset">Description Preview</span>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<Container id="edit-description-preview" style="background-color: #ffffff;" class="form-control text-start max-w-full" role="region" aria-labelledby="edit-description-preview-label">
						{@html $markdown}
					</Container>
				</Col>
			</Row>
			<hr />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="4" lg="3" class="my-auto">
					<Label for="edit-image_url"
						><tag class="text-reset fw-bold text-responsive fs-5">Image URL </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag></Label
					>
				</Col>
				<Col xs="12" md="8" lg="9" class="my-auto">
					<textarea id="edit-image_url" name="image_url" style="width: 100%;" bind:value={data.event.image_url}
					></textarea>
				</Col>
			</Row><Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" md="3" class="my-auto">
					<span id="edit-image-preview-label" class="fw-bold text-reset">Image Preview</span>
				</Col>
				<Col xs="12" md="9" class="my-auto text-center align-items-center">
					<Image id="edit-image-preview" class="rounded shadow align-items-center w-50" src={data.event.image_url} alt="Event image preview" aria-labelledby="edit-image-preview-label" />
				</Col>
			</Row>
			<hr />
			<Row class="my-2">
				<Col class="col-12">
					<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);"
						>Submit Updates</Button
					>
				</Col>
			</Row>
		</Form>
	</Container>
</Container>
