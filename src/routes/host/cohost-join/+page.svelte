<script lang="ts">
	import { Button, Container, Form } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Co-host invite – {data.eventTitle ?? 'Every Attendee'}</title>
</svelte:head>

<Container class="my-4">
	{#if !data.valid}
		<h1>Invalid or expired link</h1>
		<p class="text-muted">This co-host invite link is invalid or has expired. If you need a new link, ask the event host.</p>
		<p><a href="/host/dashboard">Go to Dashboard</a></p>
	{:else if !data.loggedIn}
		<h1>Log in or create an account</h1>
		<p>You've been invited to be a co-host for <strong>{data.eventTitle}</strong>. Your name will appear in the "Hosted by" section on the event page.</p>
		{#if data.inviteEmail}
			<p>Use the email address this invite was sent to: <strong>{data.inviteEmail}</strong></p>
			<p>
				<a href="/login?redirect={encodeURIComponent('/host/cohost-join?token=' + data.token)}">Log in</a>
				<span class="mx-2">or</span>
				<a href="/create-account?cohost_token={encodeURIComponent(data.token)}">Create account</a>
			</p>
			<p class="small text-muted">After you log in or create an account, you'll accept the co-host invite and your name will appear on the event.</p>
		{:else}
			<p>
				{#if data.token}
					<a href="/login?redirect={encodeURIComponent('/host/cohost-join?token=' + data.token)}">Log in</a>
				{:else}
					<a href="/login">Log in</a>
				{/if}
			</p>
			<p class="small text-muted">Don't have an account? Ask the person who sent you this link for an invite to join as a host.</p>
		{/if}
	{:else}
		<h1>Be a co-host?</h1>
		<p>You've been invited to be a co-host for <strong>{data.eventTitle}</strong>.</p>
		<p>If you accept, your name will appear in the "Hosted by" section on the event page. You can be removed by the event host at any time.</p>
		<Form method="POST" action="?/accept" class="d-inline">
			<Button type="submit" style="background-color: var(--brand-green); color: var(--brand-gold);">Accept</Button>
		</Form>
		<Form method="POST" action="?/decline" class="d-inline ms-2">
			<Button type="submit" color="secondary">Decline</Button>
		</Form>
	{/if}
</Container>
