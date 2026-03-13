<script lang="ts">
	import { Button, Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>Set your password</title>
</svelte:head>

<Container class="mt-1 mb-4">
	<h1>Set your password</h1>
	{#if !data.valid}
		<p class="text-danger">This link is invalid or has expired.</p>
		<p><a href="/login">Go to login</a></p>
	{:else}
		<p class="text-muted">Create a username and password for {data.email}.</p>
		<p class="small text-warning"><strong>Note:</strong> We don't have a password reset feature—choose a password you'll remember or store it with a password manager.</p>
	{/if}
</Container>

{#if data.valid && data.token}
	<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
		<Container class="mt-2">
			<Form method="POST">
				<input type="hidden" name="token" value={data.token} />
				{#if form?.message}
					<p class="text-danger">{form.message}</p>
				{/if}
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label for="username"><span class="text-reset fw-bold text-responsive fs-5">Username</span></Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<Input
							id="username"
							type="text"
							name="username"
							value={form?.username ?? ''}
							required
							aria-required="true"
							class="text-end"
							autocomplete="username"
						/>
					</Col>
				</Row>
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label for="password"><span class="text-reset fw-bold text-responsive fs-5">Password</span></Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<Input
							id="password"
							type="password"
							name="password"
							required
							aria-required="true"
							class="text-end"
							autocomplete="new-password"
						/>
					</Col>
				</Row>
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label for="passwordConfirm"><span class="text-reset fw-bold text-responsive fs-5">Confirm password</span></Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<Input
							id="passwordConfirm"
							type="password"
							name="passwordConfirm"
							required
							aria-required="true"
							class="text-end"
							autocomplete="new-password"
						/>
					</Col>
				</Row>
				<Row class="my-2">
					<Col class="col-12">
						<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Create account</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	</Container>
{/if}
