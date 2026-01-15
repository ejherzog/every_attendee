<script lang="ts">
	import GuestCard from '$lib/components/GuestCard.svelte';
	import { Guest } from '$lib/types/Guest';
	import { Response } from '$lib/types/Response';
	import {
		Button,
		Col,
		Container,
		Form,
		Image,
		Input,
		Label,
		ListGroup,
		ListGroupItem,
		Row
	} from '@sveltestrap/sveltestrap';
	import SvelteMarkdown from 'svelte-markdown';
	import validator from 'validator';

	/** @type {import('./$types').PageData} */
	export let data;

	let rsvp = new Response();

	let isGroupResponse = false;
	let additionalGuests = [new Guest(), new Guest()];

	let invalid_input = true;
	const validate = () => {
		if (
			!(rsvp.respondent.person.phone && validator.isMobilePhone(rsvp.respondent.person.phone)) &&
			!(rsvp.respondent.person.email && validator.isEmail(rsvp.respondent.person.email))
		) {
			invalid_input = true;
			return;
		}
		if (isGroupResponse) {
			invalid_input = !(
				additionalGuests.length >= 2 && additionalGuests.every((response) => response.person.name.length > 0 && response.attending.length > 0)
			);
		} else {
			invalid_input = !(rsvp.respondent.person.name.length > 0 && rsvp.respondent.attending);
		}
	};

	function addGuest() {
		additionalGuests = [...additionalGuests, new Guest()];
		validate();
	}

	function removeGuest(index: number) {
		additionalGuests = additionalGuests.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>RSVP for {data.event.title}</title>
</svelte:head>

<Container class="my-2">
	<h2>RSVP for {data.event.title}</h2>
</Container>

<Container class="mt-1 mb-4">
	<Row class="align-items-center">
		<Col xs="12" lg="6" class="mt-1">
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h6 mb-0">When</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{@html data.event.when}
				</ListGroupItem>
			</ListGroup>
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h6 mb-0">Where</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{data.event.location}<br />{data.event.address}
				</ListGroupItem>
			</ListGroup>
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h6 mb-0">Hosted By</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{data.event.hosts}
				</ListGroupItem>
			</ListGroup>
		</Col>
		<Col xs="12" lg="6" class="p-4">
			<Image fluid class="rounded shadow align-items-center" src={data.event.image_url} />
		</Col>
	</Row>
	<Row class="align-items-center">
		<Col class="mt-1 my-2">
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow">
				<ListGroupItem class="text-reset">
					<div class="h6 mb-0">Details</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					<SvelteMarkdown source={data.event.description} />
				</ListGroupItem>
			</ListGroup>
		</Col>
	</Row>
</Container>

<Container style="background-color: var(--brand-honey);" class="py-4 rounded">
	<Container class="mt-2">
		<Form method="POST" novalidate>
			<input type="hidden" name="event_code" value={data.event.id} />
			<input type="hidden" name="response" value={JSON.stringify(rsvp)} />

			<!-- Toggle for Group Response -->
			<Row class="justify-content-center mx-1 gx-1 gx-md-4 mb-3">
				<div class="toggle-container">
					<label class="toggle-label">
						<input
							type="checkbox"
							bind:checked={isGroupResponse}
							name="group"
							class="custom-switch"
						/>
						<span class="toggle-text">Respond for a Group</span>
					</label>
				</div>
			</Row>

			<hr class="section-divider" />

			<div class="section-header mb-3">
				<h4 class="text-reset">Guest Information</h4>
			</div>

			{#if isGroupResponse}
				{#each additionalGuests as guest, index}
					<GuestCard
						{guest}
						{index}
						diet_list={data.diet_list}
						pronoun_list={data.pronoun_list}
						showRemove={additionalGuests.length > 2}
						{removeGuest}
						on:change={validate}
					/>
				{/each}

				<Row class="mb-4">
					<Col class="text-center">
						<Button type="button" color="secondary" outline on:click={addGuest}>+ Add Guest</Button>
					</Col>
				</Row>
			{:else}
				<GuestCard
					guest={rsvp.respondent}
					index={0}
					diet_list={data.diet_list}
					pronoun_list={data.pronoun_list}
					showRemove={false}
					{removeGuest}
					on:change={validate}
				/>
			{/if}

			<hr class="section-divider" />

			<!-- Contact Information Section -->
			<div class="section-header">
				<h4 class="text-reset mb-1">Contact Information</h4>
				<span class="fst-italic text-center text-muted">
					Provide at least one way to reach you.
				</span>
			</div>

			<Row class="text-start mx-1 gx-1 gx-md-4 mb-3">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><span class="text-reset fw-bold text-responsive fs-5">Phone Number</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						type="tel"
						name="phone"
						bind:value={rsvp.respondent.person.phone}
						on:change={validate}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label><span class="text-reset fw-bold text-responsive fs-5">Email Address</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
					<Input
						class="text-end"
						type="email"
						name="email"
						bind:value={rsvp.respondent.person.email}
						on:change={validate}
					/>
				</Col>
			</Row>

			<hr class="section-divider" />

			<Row class="text-start mx-1 my-2 align-items-center gx-1 gx-md-4 mb-3">
				<Col xs="12" sm="6" md="3">
					<Label>
						<span class="text-reset fw-bold text-responsive fs-5">
							Notes for the Host{#if data.event.hosts.length > 1}s{/if}
						</span><br />
						<span class="fst-italic text-responsive fs-6 text-muted">{data.host_message}</span>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="9">
					<Input type="textarea" name="notes" />
				</Col>
			</Row>

			<Row class="my-4">
				<Col class="col-12 text-center">
					<Button type="submit" disabled={invalid_input} size="lg" class="submit-button">
						Submit RSVP
					</Button>
				</Col>
			</Row>
		</Form>
	</Container>
</Container>

<style>
	.text-responsive {
		font-size: 1rem;
	}

	@media (min-width: 992px) {
		.text-responsive {
			font-size: 1.2rem;
		}
	}

	.toggle-container {
		background: var(--brand-yellow);
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 0;
		cursor: pointer;
	}

	.toggle-text {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--brand-green);
	}

	.custom-switch {
		transform: scale(1.5);
		width: 15px;
		height: 15px;
		appearance: none;
		background-color: var(--brand-yellow);
		border: 1px solid var(--brand-green);
		border-radius: 2px;
		cursor: pointer;
	}

	.custom-switch:checked {
		background-color: var(--brand-green) !important;
		border-color: var(--brand-green) !important;
	}

	.section-divider {
		border-top: 2px solid rgba(11, 71, 59, 0.2);
		margin: 1rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 1rem;
	}

	.section-header h4 {
		color: var(--brand-green);
		font-weight: 600;
	}

	:global(.submit-button) {
		background-color: var(--brand-green) !important;
		color: var(--brand-gold) !important;
		border: none !important;
		padding: 0.75rem 3rem !important;
		font-weight: 600 !important;
		font-size: 1.1rem !important;
		transition: all 0.3s ease !important;
	}

	:global(.submit-button:hover:not(:disabled)) {
		background-color: var(--brand-green) !important;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(11, 71, 59, 0.3) !important;
	}

	:global(.submit-button:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
