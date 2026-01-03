<script lang="ts">
	import { Button, Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';
</script>

<svelte:head>
	<title>Host Login</title>
</svelte:head>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Username</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input class="text-end" name="username" required aria-required="true" />
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label><tag class="text-reset fw-bold text-responsive fs-5">Password</tag></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input type="password" class="text-end" name="password" />
				</Col>
			</Row>
			<Row class="my-2">
				<Col class="col-12">
					<Button type="submit" style="background-color: #0b473b; color: #f9b13e;">Login</Button>
				</Col>
			</Row>
		</Form>
	</Container>
</Container>
