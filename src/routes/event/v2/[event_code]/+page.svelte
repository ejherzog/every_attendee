<script lang="ts">
	import { Rsvp_New } from '$lib/types/RSVP_new';
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
	import MultiSelect from 'svelte-multiselect';
	import validator from 'validator';

	/** @type {import('./$types').PageData} */
	export let data;

	let rsvp = new Rsvp_New();
	rsvp.respondent.guest.pronoun_list = [];
	rsvp.respondent.guest.diets = [];

	let isGroupResponse = true;
	let additionalGuests = [
		{ name: '', pronoun_list: [], diets: [] },
		{ name: '', pronoun_list: [], diets: [] }
	];

	let invalid_input = true;
	const validate = () => {
		invalid_input = !(
			rsvp.respondent.guest.name.length > 0 &&
			rsvp.respondent.attending &&
			rsvp.respondent.guest.pronoun_list.length > 0 &&
			((rsvp.respondent.guest.phone && validator.isMobilePhone(rsvp.respondent.guest.phone)) ||
				(rsvp.respondent.guest.email && validator.isEmail(rsvp.respondent.guest.email)))
		);
	};

	function addGuest() {
		additionalGuests = [...additionalGuests, { name: '', pronoun_list: [], diets: [] }];
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

<Container style="background-color: #ffcf8355;" class="py-4 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input type="hidden" name="event_code" value={data.event.id} />

			<!-- Toggle for Group Response -->
			<Row class="justify-content-center mx-1 gx-1 gx-md-4 mb-3">
				<div class="toggle-container">
					<label class="toggle-label">
						<input
							type="checkbox"
							bind:checked={isGroupResponse}
							name="additional"
							class="custom-switch"
						/>
						<span class="toggle-text">Respond for a Group</span>
					</label>
				</div>
			</Row>

			<hr class="section-divider" />

			<!-- Contact Information Section -->
			<div class="section-header">
				<h4 class="text-reset mb-1">
					{isGroupResponse ? 'Contact Information' : 'Your Information'}
				</h4>
				{#if isGroupResponse}
					<span class="fst-italic text-center text-muted">
						Provide at least one way to reach you.
					</span>
				{/if}
			</div>

			{#if !isGroupResponse}
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4 mb-3">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label>
							<span class="text-reset fw-bold text-responsive fs-5">Your Name </span>
							<span class="fst-italic text-muted text-responsive fs-6">(required)</span>
						</Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
						<Input
							class="text-end"
							name="name"
							on:change={validate}
							bind:value={rsvp.respondent.guest.name}
							required
							aria-required="true"
						/>
					</Col>
					<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
						<Label>
							<span class="text-reset fw-bold text-responsive fs-5">Full Name </span>
							<span class="fst-italic text-muted text-responsive fs-6">(optional)</span>
						</Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<Input class="text-end" name="full_name" bind:value={rsvp.respondent.guest.full_name} />
					</Col>
				</Row>
			{/if}

			<Row class="text-start mx-1 gx-1 gx-md-4 mb-3">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><span class="text-reset fw-bold text-responsive fs-5">Phone Number</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						type="tel"
						name="phone"
						bind:value={rsvp.respondent.guest.phone}
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
						bind:value={rsvp.respondent.guest.email}
						on:change={validate}
					/>
				</Col>
			</Row>

			{#if !isGroupResponse}
				<!-- Single Response - Show all fields for respondent -->
				<hr class="section-divider" />

				<Row class="text-start mx-1 gx-1 gx-md-4 mb-3">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label
							><span class="text-reset fw-bold text-responsive fs-5">Are You Attending?</span
							></Label
						>
					</Col>
					<Col xs="12" sm="6" md="7" lg="9" class="my-auto pb-2">
						{#each ['Yes', 'No', 'Maybe'] as option}
							<Input
								required
								aria-required="true"
								name="attending"
								type="radio"
								on:change={validate}
								bind:group={rsvp.respondent.attending}
								value={option}
								label={option}
								class="h5 form-check form-check-inline"
							/>
						{/each}
					</Col>
				</Row>

				<hr class="section-divider" />

				<Row class="text-start mx-1 my-2 gx-1 gx-md-4 align-items-center mb-3">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label><span class="text-reset fw-bold text-responsive fs-5">Pronouns</span></Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="9" class="my-auto pb-1">
						<div class="form-control">
							<MultiSelect
								name="pronouns"
								required
								allowUserOptions
								createOptionMsg="Press enter or click here to add your custom option"
								bind:selected={rsvp.respondent.guest.pronoun_list}
								options={data.pronoun_list}
								on:change={validate}
								--sms-bg="white"
								--sms-border="0"
							></MultiSelect>
						</div>
					</Col>
				</Row>

				<hr class="section-divider" />

				<Row class="text-start mx-1 gx-1 gx-md-4 mb-3">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label
							><span class="text-reset fw-bold text-responsive fs-5">Dietary Restrictions</span
							></Label
						>
					</Col>
					<Col xs="12" sm="6" md="7" lg="9" class="my-auto pb-1">
						<div class="form-control">
							<MultiSelect
								name="diets"
								allowUserOptions
								createOptionMsg="Press enter or click here to add your custom option"
								bind:selected={rsvp.respondent.guest.diets}
								options={data.diet_list}
								--sms-bg="white"
								--sms-border="0"
							></MultiSelect>
						</div>
					</Col>
				</Row>
			{/if}

			{#if isGroupResponse}
				<!-- Group Response - Show guest sections -->
				<hr class="section-divider" />

				<div class="section-header mb-3">
					<h4 class="text-reset">Guest Information</h4>
				</div>

				{#each additionalGuests as guest, index}
					<div class="guest-card mb-2">
						<div class="guest-card-header">
							<h6 class="mb-0">Guest {index + 1}</h6>
							{#if additionalGuests.length > 2}
								<Button color="danger" size="sm" outline on:click={() => removeGuest(index)}>
									Remove
								</Button>
							{/if}
						</div>

						<Row class="text-start gx-2 gx-md-4">
							<Col xs="12" sm="4" md="5" lg="3" xl="2" class="my-auto mb-2">
								<Label>
									<span class="text-reset fw-bold text-responsive fs-5">Name </span>
									<span class="fst-italic text-muted text-responsive fs-6">(required)</span>
								</Label>
							</Col>
							<Col xs="12" sm="8" md="7" lg="3" xl="4" class="mb-2">
								<Input name={`guest_${index}_name`} bind:value={guest.name} required />
							</Col>
							<Col xs="12" sm="4" md="5" lg="2" class="d-flex align-items-center mb-2">
								<Label class="mb-0"
									><span class="text-reset fw-bold text-responsive fs-5">Attending?</span></Label
								>
							</Col>
							<Col xs="12" sm="8" md="7" lg="4" xl="3" class="d-flex align-items-center mb-2">
								{#each ['Yes', 'No', 'Maybe'] as option}
									<Input
										name={`guest_${index}_attending`}
										type="radio"
										value={option}
										label={option}
										class="form-check form-check-inline responsive-radio mb-0"
									/>
								{/each}
							</Col>
						</Row>

						<Row class="text-start gx-2 gx-md-4 mb-3">
							<Col xs="12" sm="4" md="5" lg="3" xl="2" class="my-auto mb-2">
								<Label for={`guest_${index}_pronouns`}
									><span class="text-reset fw-bold text-responsive fs-5">Pronouns</span></Label
								>
							</Col>
							<Col xs="12" sm="8" md="7" lg="9" xl="4" class="mb-2">
								<div class="form-control">
									<MultiSelect
										name={`guest_${index}_pronouns`}
										allowUserOptions
										createOptionMsg="Press enter or click here to add"
										bind:selected={guest.pronoun_list}
										options={data.pronoun_list}
										--sms-bg="white"
										--sms-border="0"
									></MultiSelect>
								</div>
							</Col>
							<Col xs="12" sm="6" md="5" lg="3" xl="3" class="d-flex align-items-center mb-2">
								<Label for={`guest_${index}_diets`}
									><span class="text-reset fw-bold text-responsive fs-5">Dietary Restrictions</span
									></Label
								>
							</Col>
							<Col xs="12" sm="6" md="7" lg="9" xl="3" class="d-flex align-items-center mb-2">
								<div class="form-control">
									<MultiSelect
										name={`guest_${index}_diets`}
										allowUserOptions
										createOptionMsg="Press enter or click here to add"
										bind:selected={guest.diets}
										options={data.diet_list}
										--sms-bg="white"
										--sms-border="0"
									></MultiSelect>
								</div>
							</Col>
						</Row>
					</div>
				{/each}

				<Row class="mb-4">
					<Col class="text-center">
						<Button color="secondary" outline on:click={addGuest}>+ Add Guest</Button>
					</Col>
				</Row>
			{/if}
			<!-- Single response notes at bottom -->
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
		background: white;
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
		color: #0b473b;
	}

	.custom-switch {
		transform: scale(1.5);
		width: 15px;
		height: 15px;
		appearance: none;
		background-color: #fef3df48;
		border: 1px solid #0b473b;
		border-radius: 2px;
		cursor: pointer;
	}

	.custom-switch:checked {
		background-color: #0b473b !important;
		border-color: #0b473b !important;
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
		color: #0b473b;
		font-weight: 600;
	}

	.guest-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border-left: 3px solid #0b473b;
	}

	.guest-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		padding-bottom: 0.2rem;
		font-style: italic;
	}

	.guest-card-header h6 {
		color: #0b473b;
		font-weight: 600;
	}

	:global(.submit-button) {
		background-color: #0b473b !important;
		color: #f9b13e !important;
		border: none !important;
		padding: 0.75rem 3rem !important;
		font-weight: 600 !important;
		font-size: 1.1rem !important;
		transition: all 0.3s ease !important;
	}

	:global(.submit-button:hover:not(:disabled)) {
		background-color: #083529 !important;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(11, 71, 59, 0.3) !important;
	}

	:global(.submit-button:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.responsive-radio) {
		margin-bottom: 0 !important;
	}

	:global(.responsive-radio label) {
		font-size: 1.1rem;
		margin-bottom: 0;
		display: flex;
		align-items: center;
	}

	@media (min-width: 576px) {
		:global(.responsive-radio label) {
			font-size: 1.2rem;
		}
	}
</style>
