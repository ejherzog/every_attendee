<script lang="ts">
	import type { Person } from '$lib/types/People';
	import {
		Button,
		Col,
		Input,
		Label,
		Row
	} from '@sveltestrap/sveltestrap';
	import MultiSelect from 'svelte-multiselect';

    export let guest: Person;
	export let index: number;
    export let showRemove: boolean;
    export let removeGuest: (index: number) => void;

    export let diet_list: string[];
    export let pronoun_list: string[];
</script>

<div class="guest-card mb-2">
	<div class="guest-card-header">
		<h6 class="mb-0">Guest {index + 1}</h6>
		{#if showRemove}
			<Button color="danger" size="sm" outline on:click={() => removeGuest(index)}>Remove</Button>
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
					options={pronoun_list}
					--sms-bg="white"
					--sms-border="0"
				></MultiSelect>
			</div>
		</Col>
		<Col xs="12" sm="6" md="5" lg="3" xl="3" class="d-flex align-items-center mb-2">
			<Label for={`guest_${index}_diets`}
				><span class="text-reset fw-bold text-responsive fs-5">Dietary Restrictions</span></Label
			>
		</Col>
		<Col xs="12" sm="6" md="7" lg="9" xl="3" class="d-flex align-items-center mb-2">
			<div class="form-control">
				<MultiSelect
					name={`guest_${index}_diets`}
					allowUserOptions
					createOptionMsg="Press enter or click here to add"
					bind:selected={guest.diets}
					options={diet_list}
					--sms-bg="white"
					--sms-border="0"
				></MultiSelect>
			</div>
		</Col>
	</Row>
</div>

<style>
    	.guest-card {
		background: var(--brand-yellow);
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border-left: 3px solid var(--brand-green);
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
		color: var(--brand-green);
		font-weight: 600;
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