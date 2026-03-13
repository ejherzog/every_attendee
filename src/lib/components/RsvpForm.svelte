<script lang="ts">
	import { onMount } from 'svelte';
	import GuestCard from '$lib/components/GuestCard.svelte';
	import { Guest } from '$lib/types/Guest';
	import type { Reply } from '$lib/types/Reply';
	import validator from 'validator';
	import {
		Button,
		Col,
		Container,
		Form,
		Input,
		Label,
		Row
	} from '@sveltestrap/sveltestrap';

	export let response: Reply;
	export let event_id: string;
	export let pronoun_list: any[];
	export let diet_list: any[];
	export let host_message: string;
	export let hostCount: number;
	export let submitLabel: string;
	export let confirmation_code: string | undefined = undefined;

	const NAME_MAX_LENGTH = 50;

	function isValidName(name: string | undefined): boolean {
		const trimmed = (name ?? '').trim();
		return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
	}

	function hasValidContact(phone: string | undefined, email: string | undefined): boolean {
		const phoneTrimmed = (phone ?? '').trim();
		const emailTrimmed = (email ?? '').trim();
		const hasValidPhone = phoneTrimmed.length > 0 && validator.isMobilePhone(phoneTrimmed, 'any');
		const hasValidEmail = emailTrimmed.length > 0 && validator.isEmail(emailTrimmed);
		return hasValidPhone || hasValidEmail;
	}

	let isGroupResponse = response.other_guests.length > 0;

	let invalid_input = true;

	const validate = () => {
		if (
			!hasValidContact(response.respondent.person.phone, response.respondent.person.email)
		) {
			invalid_input = true;
			return;
		}

		if (isGroupResponse) {
			invalid_input = !(
				response.other_guests.length >= 1 &&
				response.other_guests.every(
					(guest: Guest) =>
						isValidName(guest.person.name) &&
						guest.attending &&
						guest.attending.length > 0
				)
			);
		} else {
			invalid_input = !(
				isValidName(response.respondent.person.name) && response.respondent.attending
			);
		}
	};

	function updateOtherGuests() {
		if (!isGroupResponse) response.other_guests = [];
		validate();
	}

	function addGuest() {
		response.other_guests = [...response.other_guests, new Guest()];
		validate();
	}

	function removeGuest(index: number) {
		response.other_guests = response.other_guests.filter((_: Guest, i: number) => i !== index - 1);
		validate();
	}

	let responseInput: HTMLInputElement;

	function handleSubmit() {
		responseInput.value = JSON.stringify(response);
	}

	onMount(() => validate());
</script>

<Container style="background-color: var(--brand-honey);" class="py-4 rounded">
	<Container class="mt-2">
		<Form method="POST" novalidate on:submit={handleSubmit}>
			<input type="hidden" name="event_code" value={event_id} />
			{#if confirmation_code}
				<input type="hidden" name="confirmation_code" value={confirmation_code} />
			{/if}
			<input type="hidden" name="response" bind:this={responseInput} value={JSON.stringify(response)} />

			<!-- Toggle for Group Response -->
			<Row class="justify-content-center mx-1 gx-1 gx-md-4 mb-3">
				<div class="toggle-container">
					<label class="toggle-label">
						<input
							type="checkbox"
							bind:checked={isGroupResponse}
							id="group"
							class="custom-switch"
							on:change={updateOtherGuests}
						/>
						<span class="toggle-text">Respond for a Group</span>
					</label>
				</div>
			</Row>

			<hr class="section-divider" />

			<div class="section-header mb-3">
				<h4 class="text-reset">Guest Information</h4>
			</div>

			<GuestCard
				guest={response.respondent}
				index={0}
				{diet_list}
				{pronoun_list}
				showRemove={false}
				{removeGuest}
				on:change={validate}
			/>

			{#if isGroupResponse}
				{#each response.other_guests as guest, i}
					<GuestCard
						{guest}
						index={i + 1}
						{diet_list}
						{pronoun_list}
						showRemove={response.other_guests.length > 1}
						{removeGuest}
						on:change={validate}
					/>
				{/each}

				<Row class="mb-4">
					<Col class="text-center">
						<Button type="button" color="secondary" outline on:click={addGuest}>+ Add Guest</Button>
					</Col>
				</Row>
			{/if}

			<hr class="section-divider" />

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
						class="text-start"
						type="tel"
						id="phone"
						bind:value={response.respondent.person.phone}
						on:change={validate}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label><span class="text-reset fw-bold text-responsive fs-5">Email Address</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
					<Input
						class="text-start"
						type="email"
						id="email"
						bind:value={response.respondent.person.email}
						on:change={validate}
					/>
				</Col>
			</Row>

			<hr class="section-divider" />

			<Row class="text-start mx-1 my-2 align-items-center gx-1 gx-md-4 mb-3">
				<Col xs="12" sm="6" md="3">
					<Label>
						<span class="text-reset fw-bold text-responsive fs-5">
							Notes for the Host{#if hostCount > 1}s{/if}
						</span><br />
						<span class="fst-italic text-responsive fs-6 text-muted">{host_message}</span>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="9">
					<Input type="textarea" id="notes" bind:value={response.note} />
				</Col>
			</Row>

			<Row class="my-4">
				<Col class="col-12 text-center">
					<Button type="submit" disabled={invalid_input} size="lg" class="submit-button">
						{submitLabel}
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
