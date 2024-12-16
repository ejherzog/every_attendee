<script lang="ts">
	import { Rsvp, RsvpValidator } from '$lib/types/Rsvp';
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
	import MultiSelect from 'svelte-multiselect';

	/** @type {import('./$types').PageData} */
	export let event;
	let name_width: number;
	let custom_width: number;

	let when = event.getWhenHtml();
	let hosts = event.getHost();
	let host_message = event.hosts.length > 1 ? "Anything else we should know?" : "Anything else the host should know?";

	let rsvp = new Rsvp();

	let other_pronoun = false;
	let custom_pronoun: string;
	rsvp.guest.pronoun_list = [];
	const pronoun_list = [
		'they/them',
		'she/her',
		'he/him',
		'any',
		'ze/zir',
		'fae/faer',
		'xey/xem',
		'other'
	];

	const checkOtherPronoun = () => {
		other_pronoun = rsvp.guest.pronoun_list.includes('other') ? true : false;
		validate();
	};

	let other_diet = false;
	let custom_diet: string;
	rsvp.diets = [];
	const diet_list = [
		'Vegan',
		'Vegetarian',
		'Pescatarian',
		'Gluten Free',
		'Tree Nut Allergy',
		'Egg Allergy',
		'Peanut Allergy',
		'Shellfish Allergy',
		'Other'
	];

	const checkOtherDiet = () => {
		other_diet = rsvp.diets.includes('Other') ? true : false;
		validate();
	};

	let invalid_input = true;
	let validator = new RsvpValidator();
	const validate = () => {
		invalid_input = !validator.isAcceptable(rsvp, custom_pronoun, custom_diet);
	}
</script>

<Container class="my-3">
	<h1>RSVP for {event.title}</h1>
</Container>

<Container class="mt-1 mb-4">
	<Row class="align-items-center">
		<Col xs="12" lg="6" class="mt-1">
			<Image
				fluid
				class="rounded shadow align-items-center"
				alt="A full moon glows over the hills and desert near Joshua Tree National Park in California."
				src="https://images.unsplash.com/photo-1653540883470-bf726448911b"
			/>
		</Col>
		<Col xs="12" lg="6" class="mt-1">
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow mb-2">
				<ListGroupItem class="text-reset">
					<div class="h5 mb-0">When</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{@html when}
				</ListGroupItem>
			</ListGroup>
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h5 mb-0">Where</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{event.location}<br />{event.address}
				</ListGroupItem>
			</ListGroup>
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h5 mb-0">What</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{@html event.description}
				</ListGroupItem>
			</ListGroup>
			<ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
				<ListGroupItem class="text-reset">
					<div class="h5 mb-0">Hosted By</div>
				</ListGroupItem>
				<ListGroupItem class="text-reset">
					{hosts}
				</ListGroupItem>
			</ListGroup>
		</Col>
	</Row>
</Container>

<Container style="background-color: #f9b13e66;" class="py-2 rounded">
<Container class="mt-2">
	<Form action="?/rsvp" method="POST">
		<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"
					><tag class="fw-bold text-responsive">Your Name</tag>
					<tag class="fw-lighter fst-italic text-responsive fs-6">(required)</tag></Label
				>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<div bind:clientWidth={name_width}>
				<Input name="name" on:change={validate} bind:value={rsvp.guest.name} required 
					placeholder={name_width > 340 ? "How do you want to be addressed at this event?" : name_width < 240 ? "" : "How should we address you?"}
				/></div>
			</Col>
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"
					><tag class="fw-bold text-responsive">Full Name</tag>
					<tag class="fw-lighter fst-italic text-responsive fs-6">(optional)</tag></Label
				>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<Input name="full_name" bind:value={rsvp.guest.full_name} />
			</Col>
		</Row>
		<Row class="text-start mx-1 gx-1 gx-md-4">
			<!-- <Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"><tag class="fw-bold text-responsive">Number Attending </tag><tag class="fw-lighter fst-italic">(required)</tag></Label>
			</Col>
			<Col class="col-md-4 col-7 my-3">
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
			<Col class="col-md-6 col-12">
				<Row class="gx-0 gx-md-4">
					<Col class="col-md-4 col-5 my-3">
						<Label class="text-reset"><tag class="fw-bold text-responsive">Phone Number</tag></Label>
					</Col>
					<Col class="col-md-8 col-7 my-3">
						<Input type="tel" name="phone" bind:value={rsvp.guest.phone} on:change={validate} />
					</Col>
				</Row>
				<Row class="gx-0 gx-md-4">
					<Col class="col-md-4 col-5 my-3">
						<Label class="text-reset"><tag class="fw-bold text-responsive">Email Address</tag></Label>
					</Col>
					<Col class="col-md-8 col-7 my-3">
						<Input type="email" name="email" bind:value={rsvp.guest.email} on:change={validate} />
					</Col>
					<Col class="fw-bolder fst-italic col-12 my-1 text-center">
						Note: you must provide at least one way to contact you.
					</Col>
				</Row>
			</Col>
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"><tag class="fw-bold text-responsive">Are You Attending?</tag><tag class="fw-lighter fst-italic">(required)</tag></Label>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				{#each ['Yes', 'Maybe', 'No'] as option}
					<Input required name="attending" type="radio" on:change={validate} bind:group={rsvp.attending} value={option.charAt(0).toUpperCase()} label={option} class="h5"/>
				{/each}
			</Col>
		</Row>
		<hr />
		<Row class="text-start mx-1 my-3 gx-1 gx-md-4 align-items-center">
			<Col class="col-md-2 col-5">
				<Label class="text-reset"
					><tag class="fw-bold text-responsive">Pronouns </tag><tag class="fw-lighter fst-italic">(required)</tag></Label
				>
			</Col>
			<Col class="col-md-10 col-7">
				<Row class="align-items-center">
					<Col class="col-lg-7 col-12 my-2">
						<MultiSelect name="pronouns" required
							bind:selected={rsvp.guest.pronoun_list}
							options={pronoun_list}
							--sms-bg="white"
							on:change={checkOtherPronoun}
						></MultiSelect>
					</Col>
					<Col class="col-lg-5 col-12">
						<div bind:clientWidth={custom_width}>
						<Input bsSize="sm" name="custom_pronoun" on:change={validate}
							disabled={!other_pronoun} bind:value={custom_pronoun}
							placeholder={custom_width > 280 ? "select 'other' to add custom pronouns" : "select 'other' to enable"}
						/></div>
					</Col>
				</Row>
			</Col>
		</Row>
		<Row class="text-start mx-1 my-3 align-items-center gx-1 gx-md-4">
			<Col class="col-md-2 col-5">
				<Label class="text-reset"><tag class="fw-bold text-responsive">Dietary Restrictions</tag></Label>
			</Col>
			<Col class="col-md-10 col-7">
				<Row class="align-items-center">
					<Col class="col-lg-7 col-12 my-2">
						<MultiSelect name="diet"
					bind:selected={rsvp.diets}
					options={diet_list}
					--sms-bg="white"
					on:change={checkOtherDiet}
				></MultiSelect>
					</Col>
					<Col class="col-lg-5 col-12">
						<Input bsSize="sm" name="custom_diet" on:change={validate}
							disabled={!other_diet} bind:value={custom_diet}
							placeholder={custom_width > 290 ? "select 'other' to add custom dietary needs" : "select 'other' to enable"}
						/>
					</Col>
				</Row>
			</Col>
		</Row>
		<hr />
		<Row class="align-items-center text-start mx-1">
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"
					><tag class="fw-bold text-responsive">Note for the Host{#if event.hosts.length > 1}s{/if}:</tag>
					<tag class="fw-lighter fst-italic">(optional)</tag></Label
				>
			</Col>
			<Col class="col-md-10 col-7 my-3">
				<Input type="textarea" name="note" placeholder={host_message} />
			</Col>
		</Row>
		<!-- <hr /> -->
		<!-- <Row class="text-start mx-1">
			<h5>~~Section to Add Additional Guest(s)~~</h5>
		</Row> -->
		<Row class="my-2">
			<Col class="col-12">
				<Button type="submit" disabled={invalid_input} style="background-color: #0b473b; color: #f9b13e;">Submit RSVP</Button
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