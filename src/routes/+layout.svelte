<script lang="ts">
	import { Navbar, NavbarBrand, Container, NavLink, Row, Col, Form, Button } from '@sveltestrap/sveltestrap';

	// const kofi_words = ['coffee', 'pizza', 'bacon', 'chocolate', 'cheese', 'soda'];
	// const kofi_emojis = ['☕️', '🍕', '🥓', '🍫', '🧀', '🥤'];
	// const index = Math.floor(Math.random() * kofi_emojis.length);
	// const treat = kofi_words[index];
	// const emoji = kofi_emojis[index];
	let innerWidth = 0;
	$: showSmall = innerWidth < 768;

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:window bind:innerWidth />

<Navbar style="background-color: #0b473b;" container="sm">
	<Row class="w-100 justify-content-between align-items-center">
		<Col class="col-md-3 col-6">
			{#if showSmall}
				<NavbarBrand href="/" style="color: #f9b13e" class="fs-2">EvA</NavbarBrand>
			{:else}
				<NavbarBrand href="/" style="color: #f9b13e" class="fs-2"
					>EveryAttendee <tag class="fs-4 fw-lighter fst-italic">(𝛂 v0.2)</tag></NavbarBrand
				>
			{/if}
		</Col>
		<Col class="col-md-3 col-6 text-end">
			<Row>
				<Col>
					<NavLink href="/event/" style="color: #f9b13e" class="fs-5">RSVP</NavLink>
				</Col>
				{#if data.username}
					<Col><NavLink href="/host/dashboard" style="color: #f9b13e" class="fs-5">Dashboard</NavLink></Col>
					<Col><Form method="POST" action="/host/auth?/logout"><button style="all: unset; cursor: pointer; color: #f9b13e" class="fs-5">Logout</button></Form></Col>
				{:else}
					<Col><NavLink href="/host/auth" style="color: #f9b13e" class="fs-5">Host Login</NavLink></Col>
				{/if}
			</Row>
		</Col>
	</Row>
</Navbar>

<Container class="text-center mt-1 mb-4">
	<slot></slot>
	<hr />
</Container>

<Container class="text-center mt-1 mb-4 w-75 fs-6">
	<p>
		<i>EveryAttendee</i> is built and maintained Eva J Herzog.<br />
		<!-- {emoji} Buy her some {treat} via <a href="https://ko-fi.com/evajherzog" target="_blank" class="text-reset">ko-fi</a> <Icon name="arrow-up-right-square-fill" style="font-size: .9rem;"/>. -->
	</p>
	<a href="/credits" class="text-reset">Credits</a>
</Container>


<style>
	button:focus { outline: revert }
</style>