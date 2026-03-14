<script lang="ts">
	import { Button, Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>Invite a Host</title>
</svelte:head>

<Container class="my-4">
	<h1>Invite a Host</h1>
	{#if data?.username}
		<p class="text-muted">Hello, {data.username}.</p>
	{/if}
	<p class="text-muted">Do you know someone who might enjoy this app?</p>
	<p class="text-muted">Enter their email address and we'll generate a signup link for you to share with them.</p>
</Container>

<Container style="background-color: var(--brand-honey);" class="py-2 rounded">
	<Container class="mt-2">
		{#if form?.success && form?.inviteLink}
			<p class="text-success fw-bold">Invite created for {form.email}.</p>
			<p>Send them this link (it expires in 14 days):</p>
			<Row class="mb-3">
				<Col xs="12">
					<Input type="text" readonly value={form.inviteLink} id="invite-link" class="font-monospace" />
				</Col>
			</Row>
			<Button
				class="my-1"
				style="background-color: var(--brand-green); color: var(--brand-gold);"
				on:click={() => {
					const input = document.getElementById('invite-link');
					if (input instanceof HTMLInputElement) {
						input.select();
						navigator.clipboard.writeText(input.value);
					}
				}}
			>
				Copy Link
			</Button>
		{:else}
			<Form method="POST" class="d-flex flex-column align-items-center">
				{#if form?.message && !form?.success}
					<p class="text-danger">{form.message}</p>
				{/if}
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4 justify-content-center w-100">
					<Col xs="12" sm="4" md="2" lg="1" class="my-auto">
						<Label for="email"><span class="text-reset fw-bold text-responsive fs-5">Email</span></Label>
					</Col>
					<Col xs="12" sm="8" md="7" lg="4" class="my-auto pb-2">
						<Input
							id="email"
							type="email"
							name="email"
							value={form?.email ?? ''}
							required
							aria-required="true"
							class="text-start"
						/>
					</Col>
				</Row>
				<Row class="my-2 justify-content-center w-100">
					<Col class="col-12 d-flex justify-content-center">
						<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Create Invite Link</Button>
					</Col>
				</Row>
			</Form>
		{/if}
	</Container>
</Container>

<p class="mt-2"><a href="/host/dashboard">Back to Dashboard</a></p>
