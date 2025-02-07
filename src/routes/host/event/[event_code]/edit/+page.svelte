<script>
	import { Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>RSVP for {data.event.title}</title>
</svelte:head>

<Container class="my-2">
	<h2>Editing {data.event.title}</h2>
</Container>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<input type="hidden" name="event_code" value={data.event.id} />
            <Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Event Title </tag>
						<tag class="fst-italic text-responsive fs-6">(required)</tag>
					</Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
						<Input
							class="text-end"
							name="title"
							required
							aria-required="true"
                            bind:value={data.event.title}
						/>
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label
						><tag class="text-reset fw-bold text-responsive fs-5">Event Code </tag>
						<tag class="fst-italic text-responsive fs-6">(optional)</tag></Label
					>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input class="text-end" name="code" bind:value={data.event.id}/>
				</Col>
			</Row>
			<hr />
            <Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
            <Col xs="12" sm="6" md="5" lg="3" class="my-auto">
                <Label
                    ><tag class="text-reset fw-bold text-responsive fs-5">Start </tag>
                    <tag class="fst-italic text-responsive fs-6">(required)</tag>
                </Label>
                <Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
                    <Input
                        class="text-end"
                        name="start_time"
                        required
                        aria-required="true"
                    />
            </Col>
        </Col>
            <Col xs="12" sm="6" md="5" lg="3" class="my-auto">
                <Label
                    ><tag class="text-reset fw-bold text-responsive fs-5">End </tag>
                    <tag class="fst-italic text-responsive fs-6">(required)</tag>
                </Label>
            </Col>
                <Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
                    <Input
                        class="text-end"
                        name="end_time"
                        required
                        aria-required="true"
                    />
            </Col>
        </Row>
		</Form>
	</Container>
</Container>
