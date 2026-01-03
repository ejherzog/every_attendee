<script lang="ts">
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

	/** @type {import('./$types').PageData} */
	export let data;
	let event_description = data.event.description;
</script>

<svelte:head>
	<title>RSVP Preview</title>
</svelte:head>

<Container class="my-2">
	<Row>
		<Col><Button href={`/host/event/${data.event.id}/edit`}>⬅️ Edit Event</Button></Col>
		<Col><h4><i>RSVP Page Preview</i></h4></Col>
		<Col><Button href={`/host/dashboard`}>Dashboard ➡️</Button></Col>
	</Row>
	<hr />
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
					<SvelteMarkdown source={event_description} />
				</ListGroupItem>
			</ListGroup>
		</Col>
	</Row>
</Container>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input disabled type="hidden" name="event_code" value={data.event.id} />
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Your Name </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag><br />
						<tag class="fst-italic text-responsive fs-6">How should we address you?</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input disabled class="text-end" name="name" required aria-required="true" />
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Full Name </tag>
						<tag class="fst-italic text-responsive fs-6">(optional)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input disabled class="text-end" name="full_name" />
				</Col>
			</Row>
			<hr />
			<Row class="text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Phone Number</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input disabled class="text-end" type="tel" name="phone" />
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Email Address</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
					<Input disabled class="text-end" type="email" name="email" />
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
							disabled
							required
							aria-required="true"
							name="attending"
							type="radio"
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
							disabled
							name="pronouns"
							required
							allowUserOptions
							createOptionMsg="Press enter or click here to add your custom option"
							--sms-bg="white"
							options={[]}
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
							disabled
							name="diets"
							allowUserOptions
							options={[]}
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
					<Input disabled type="textarea" name="notes" />
				</Col>
			</Row>
			<Row class="my-2">
				<Col class="col-12">
					<Button disabled type="submit" style="background-color: #0b473b; color: #f9b13e;"
						>Submit RSVP</Button
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
