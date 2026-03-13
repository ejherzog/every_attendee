<script lang="ts">
	import { Button, Col, Container, Form, Input, Label, Row } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;

	let showPassword = false;
	let showPasswordConfirm = false;
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
		<p class="small" style="color: #8b0000;"><strong>Note:</strong> We don't have a password reset feature—choose a password you'll remember or store it with a password manager.</p>
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
							class="text-start"
							autocomplete="username"
						/>
					</Col>
				</Row>
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label for="password"><span class="text-reset fw-bold text-responsive fs-5">Password</span></Label>
						<p class="small text-muted mb-0">At least 10 characters</p>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<div class="input-group">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								required
								aria-required="true"
								class="text-start"
								autocomplete="new-password"
							/>
							<button
								type="button"
								class="btn btn-outline-secondary"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								on:click={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
								{/if}
							</button>
						</div>
					</Col>
				</Row>
				<Row class="align-items-center text-start mx-1 gx-1 gx-md-4">
					<Col xs="12" sm="6" md="5" lg="3" class="my-auto">
						<Label for="passwordConfirm"><span class="text-reset fw-bold text-responsive fs-5">Confirm password</span></Label>
					</Col>
					<Col xs="12" sm="6" md="7" lg="4" class="my-auto pb-2">
						<div class="input-group">
							<Input
								id="passwordConfirm"
								type={showPasswordConfirm ? 'text' : 'password'}
								name="passwordConfirm"
								required
								aria-required="true"
								class="text-start"
								autocomplete="new-password"
							/>
							<button
								type="button"
								class="btn btn-outline-secondary"
								aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
								on:click={() => (showPasswordConfirm = !showPasswordConfirm)}
							>
								{#if showPasswordConfirm}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
								{/if}
							</button>
						</div>
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
