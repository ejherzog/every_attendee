<script lang="ts">
	import { Event, findEvent } from '$lib/types/Event';
	import {
		Button,
		Col,
		Container,
		Form,
		FormGroup,
		Image,
		Input,
		InputGroup,
		InputGroupText,
		Label,
		ListGroup,
		ListGroupItem,
		Row
	} from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;

	let event: Event = findEvent(data.code);
	let when = event.getWhenHtml();
	let hosts = event.getHost();

	let validated = false;
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
    <hr/>
		<Row class="text-start mx-1 my-3">
			<Col class="col-md-2 col-5">
				<Label class="text-reset"><tag class="h5">Pronouns</tag></Label>
			</Col>
			<Col class="col-md-4 col-7">
				<Row>
					<Col class="col-md-6 col-12">
						<Input type="checkbox" label="they/them" />
						<Input type="checkbox" label="she/her" />
					</Col>
					<Col class="col-md-6 col-12">
						<Input type="checkbox" label="he/him" />
						<Input type="checkbox" label="any" />
					</Col>
				</Row>
			</Col>
      <Col class="col-md-6 col-12">
        <Row>
          <i>put full pronoun multi-select list dropdown here</i>
        </Row>
        <Row>
          <i>put custom pronoun input here</i>
          <!-- <p>TODO: nest all the options in another set of rows and columns so that the label always stays in its own column</p> -->
        </Row>
      </Col>
		</Row>
    <hr/>
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
