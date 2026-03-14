<script lang="ts">
	import { Button, Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Host Login</title>
</svelte:head>

<h1 class="visually-hidden">Host Login</h1>
<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<Container class="mt-2">
		<Form method="POST">
			{#if data?.redirect}
				<input type="hidden" name="redirect" value={data.redirect} />
			{/if}
			<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
				<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
					<Label for="login-username"><span class="text-reset fw-bold text-responsive fs-5">Username</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="3" class="my-auto pb-2">
					<Input id="login-username" class="text-start" name="username" required aria-required="true" autocomplete="username" />
				</Col>
				<Col xs="12" sm="6" md="5" lg="2" class="my-auto">
					<Label for="login-password"><span class="text-reset fw-bold text-responsive fs-5">Password</span></Label>
				</Col>
				<Col xs="12" sm="6" md="7" lg="4" class="my-auto">
					<Input id="login-password" type="password" class="text-start" name="password" autocomplete="current-password" />
				</Col>
			</Row>
			<Row class="my-2">
				<Col class="col-12">
					<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Login</Button>
				</Col>
			</Row>
		</Form>
	</Container>
</Container>
