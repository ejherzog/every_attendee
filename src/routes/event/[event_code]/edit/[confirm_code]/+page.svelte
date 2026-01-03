<script lang="ts">
	import { Rsvp } from '$lib/types/view/Rsvp';
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

	let rsvp: Rsvp = data.rsvp;

	let invalid_input = false;
	const validate = () => {
		invalid_input = !(
			rsvp.name.length > 0 &&
			rsvp.attending &&
			rsvp.pronouns.length > 0 &&
			((rsvp.phone && validator.isMobilePhone(rsvp.phone)) ||
				(rsvp.email && validator.isEmail(rsvp.email)))
		);
	};
</script>

<svelte:head>
	<title>RSVP for {data.event.title}</title>
</svelte:head>

<Container class="my-2">
	<h2>Edit Your RSVP for {data.event.title}</h2>
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

<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input type="hidden" name="event_code" value={data.event.id} />
			<input type="hidden" name="confirmation_code" value={data.rsvp.confirmation_code} />
			<input type="hidden" name="guest_id" value={data.rsvp.guest_id} />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Your Name </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag><br />
						<tag class="fst-italic text-responsive fs-6">How should we address you?</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						name="name"
						on:change={validate}
						bind:value={rsvp.name}
						required
						aria-required="true"
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Full Name </tag>
						<tag class="fst-italic text-responsive fs-6">(optional)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input class="text-end" name="full_name" bind:value={rsvp.full_name} />
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 gx-1 gx-md-4">
				<!-- <Col class="col-md-2 col-4 my-2">
				<Label class="text-reset"><tag class="fw-bold text-responsive">Number Attending </tag><tag class="fw-lighter fst-italic">(required aria-required="true")</tag></Label>
			</Col>
			<Col class="col-md-4 col-8 my-2">
				<InputGroup class="my-1" size="sm">
					<InputGroupText style="max-width: 40%; min-width: 35%;">Yes:</InputGroupText>
					<Input name="yes" type="number" min="0"/>
				</InputGroup>
				<InputGroup class="my-1" size="sm">
					<InputGroupText style="max-width: 40%; min-width: 35%;">Maybe:</InputGroupText>
					<Input name="maybe" type="number" min="0"/>
				</InputGroup>
				<InputGroup class="my-1" size="sm">
					<InputGroupText style="max-width: 40%; min-width: 35%;">No:</InputGroupText>
					<Input name="no" type="number" min="0"/>
				</InputGroup>
			</Col> -->
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Phone Number</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input
						class="text-end"
						type="tel"
						name="phone"
						bind:value={rsvp.phone}
						on:change={validate}
					/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Email Address</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
					<Input
						class="text-end"
						type="email"
						name="email"
						bind:value={rsvp.email}
						on:change={validate}
					/>
				</Col>
				<Col class="fst-italic col-12 my-1 text-center">
					You must provide at least one way to contact you.
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Are You Attending?</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="9" class="my-auto">
					{#each ['Yes', 'No', 'Maybe'] as option}
						<Input
							required
							aria-required="true"
							name="attending"
							type="radio"
							on:change={validate}
							bind:group={rsvp.attending}
							value={option}
							label={option}
							class="h5 form-check form-check-inline"
						/>
					{/each}
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 my-2 gx-1 gx-md-4 align-items-center">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Pronouns</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="9" class="my-auto pb-1">
					<div class="form-control">
						<MultiSelect
							name="pronouns"
							required
							allowUserOptions
							createOptionMsg="Press enter or click here to add your custom option"
							bind:selected={rsvp.pronouns}
							options={data.pronoun_list}
							on:change={validate}
							--sms-bg="white"
							--sms-border="0"
						></MultiSelect>
					</div>
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Dietary Restrictions</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="9" class="my-auto pb-1">
					<div class="form-control">
						<MultiSelect
							name="diets"
							allowUserOptions
							createOptionMsg="Press enter or click here to add your custom option"
							bind:selected={rsvp.diets}
							options={data.diet_list}
							--sms-bg="white"
							--sms-border="0"
						></MultiSelect>
					</div>
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 my-2 align-items-center gx-1 gx-md-4">
				<Col xs="12" sm="6" md="3">
					<Label>
						<tag class="text-reset fw-bold text-responsive fs-5"
							>Notes for the Host{#if data.event.hosts.length > 1}s{/if}</tag
						><br />
						<tag class="fst-italic text-responsive fs-6">{data.host_message}</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="9">
					<Input type="textarea" name="notes" bind:value={rsvp.comments} />
				</Col>
			</Row>
			<!-- <hr /> -->
			<!-- <Row class="text-start mx-1">
			<h5>~~Section to Add Additional Guest(s)~~</h5>
		</Row> -->
			<Row class="my-2">
				<Col class="col-12">
					<Button
						type="submit"
						disabled={invalid_input}
						style="background-color: var(--brand-green); color: var(--brand-gold);">Update RSVP</Button
					>
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
</style>
