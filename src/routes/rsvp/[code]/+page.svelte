<script lang="ts">
	import { Event, findEvent } from '$lib/types/Event';
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
	export let data;

	let event: Event = findEvent(data.code);
	let when = event.getWhenHtml();
	let hosts = event.getHost();

	let validated = false;
	let other_pronoun = false;
	let selected: string[] = [];
	const more_pronouns = [
		'they/them',
		'she/her',
		'he/him',
		'any',
		'ze/zir',
		'fae/faer',
		'xey/xem',
		'other'
	];

	const checkOther = () => {
		other_pronoun = selected.includes('other') ? true : false;
	};
</script>

<Container class="my-3">
	<h1>RSVP for {event.title}</h1>
</Container>

<Container class="mt-1 mb-4">
	<Row class="align-items-center">
		<Col xs="12" md="6" class="mt-1">
			<Image
				fluid
				class="rounded shadow align-items-center"
				alt="Group of five friends taking a selfie"
				src="https://i0.wp.com/canweallgo.com/wp-content/uploads/2019/11/2A2A7302-1.jpg?w=1080&ssl=1"
			/>
		</Col>
		<Col xs="12" md="6" class="mt-1">
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
					{event.description}
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

<hr />

<Container class="mt-2">
	<Form {validated} action="/rsvp" method="POST">
		<Row class="align-items-center text-start mx-1">
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"
					><tag class="h5">Your Name</tag>
					<tag class="fw-lighter fst-italic">(required)</tag></Label
				>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<Input required placeholder="How should we address you?" />
			</Col>
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"
					><tag class="h5">Full Name</tag>
					<tag class="fw-lighter fst-italic">(optional)</tag></Label
				>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<Input />
			</Col>
		</Row>
		<Row class="align-items-center text-start mx-1">
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"><tag class="h5">Phone Number</tag></Label>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<Input required />
			</Col>
			<Col class="col-md-2 col-5 my-3">
				<Label class="text-reset"><tag class="h5">Email Address</tag></Label>
			</Col>
			<Col class="col-md-4 col-7 my-3">
				<Input required />
			</Col>
			<Col class="fw-bolder fst-italic col-12 my-1 text-center">
				Note: you must provide at least one way to contact you.
			</Col>
		</Row>
		<hr />
		<Row class="text-start mx-1 my-3">
			<Col class="col-md-2 col-5">
				<Label class="text-reset"><tag class="h5">Pronouns</tag></Label>
			</Col>
			<Col class="col-md-10 col-7">
				<Row class="align-items-center">
					<Col class="col-lg-7 col-12">
						<MultiSelect bind:selected options={more_pronouns} --sms-bg="white" --sms-min-height="2.2rem"
							on:add={checkOther} on:remove={checkOther}></MultiSelect>
					</Col>
					{#if other_pronoun}
						<Col class="col-lg-5 col-12">
							<Input class="my-1" bsSize="sm" placeholder="enter your custom pronouns" />
						</Col>
					{/if}
				</Row>
			</Col>
		</Row>
		<hr />
		<Row class="text-start mx-1 my-3">
			<Col class="col-md-2 col-5">
				<Label class="text-reset"><tag class="h5">Dietary Restrictions</tag></Label>
			</Col>
			<Col class="col-md-4 col-7">
				<Row>
					<Col class="col-md-6 col-12">
						<Input type="checkbox" label="Vegan" />
						<Input type="checkbox" label="Vegetarian" />
						<Input type="checkbox" label="Pescatarian" />
						<Input type="checkbox" label="Gluten Free" />
					</Col>
					<Col class="col-md-6 col-12">
						<Input type="checkbox" label="Tree Nut Allergy" />
						<Input type="checkbox" label="Egg Allergy" />
						<Input type="checkbox" label="Soy Allergy" />
					</Col>
				</Row>
			</Col>
			<Col class="col-md-6 col-12">
				<Input type="checkbox" label="Peanut Allergy" />
				<Input type="checkbox" label="Wheat Allergy" />
				<Input type="checkbox" label="Shellfish Allergy" />
			</Col>
		</Row>
		<hr />
		<Row class="text-start mx-1">
			<h5>Section to Add Additional Guests</h5>
		</Row>
		<Row class="my-2">
			<Col class="col-12">
				<Button type="submit" style="background-color: #0b473b; color: #f9b13e;">Submit RSVP</Button
				>
			</Col>
		</Row>
	</Form>
</Container>
