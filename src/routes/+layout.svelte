<script lang="ts">
	import {
		Navbar,
		NavbarBrand,
		Container,
		NavLink,
		Row,
		Col,
		Form
	} from '@sveltestrap/sveltestrap';

	// const kofi_words = ['coffee', 'pizza', 'bacon', 'chocolate', 'cheese', 'soda'];
	// const kofi_emojis = ['☕️', '🍕', '🥓', '🍫', '🧀', '🥤'];
	// const index = Math.floor(Math.random() * kofi_emojis.length);
	// const treat = kofi_words[index];
	// const emoji = kofi_emojis[index];
	let innerWidth = 0;
	$: showSmall = innerWidth < 768;

	/** @type {import('./$types').PageData} */
	export let data;

	let home = data.username ? '/host/dashboard' : '/';
</script>

<svelte:window bind:innerWidth />

<div id="wrapper" style="
	--brand-honey: #FFE2B3;
    --brand-green: #0B473B;
	--brand-gold: #F9B13E;
	--brand-yellow: #FFFBF2;
	background-color: var(--brand-yellow);
	min-height: 100vh;
  ">

<a href="#main-content" class="visually-hidden-focusable btn btn-light position-absolute top-0 start-0 m-2 z-3">Skip to main content</a>
<Navbar style="background-color: var(--brand-green);" container="sm">
	<Row class="w-100 justify-content-end align-items-center">
		<Col>
			{#if showSmall}
				<NavbarBrand href={home} style="color: var(--brand-gold)" class="fs-2">EvA</NavbarBrand>
			{:else}
				<NavbarBrand href={home} style="color: var(--brand-gold)" class="fs-2"
					>EveryAttendee <tag class="fs-4 fw-lighter fst-italic">(𝛂 v0.3)</tag></NavbarBrand
				>
			{/if}
		</Col>
		<Col class="col-5 col-md-3 col-lg-2 text-start">
			<Row>
				<Col class="col-6">
					<NavLink href="/event/" style="color: var(--brand-gold)" class="fs-5"
						>{data.username ? 'RSVP' : 'Guests'}</NavLink
					>
				</Col>
				<Col class="col-6">
					{#if data.username}
						<Form method="POST" action="/api/logout"
							><button style="all: unset; cursor: pointer; color: var(--brand-gold)" class="fs-5"
								>Logout</button
							></Form
						>
					{:else}
						<NavLink href="/login" style="color: var(--brand-gold)" class="fs-5">Hosts</NavLink>
					{/if}
				</Col>
			</Row>
		</Col>
	</Row>
</Navbar>

<main id="main-content" tabindex="-1">
	<Container class="text-center mt-1 mb-4">
		<slot></slot>
		<hr />
	</Container>
</main>

<Container class="text-center mt-1 mb-4 w-75 fs-6">
	<p>
		<i>EveryAttendee</i> is built and maintained Eva J Herzog.<br />
		<!-- {emoji} Buy her some {treat} via <a href="https://ko-fi.com/evajherzog" target="_blank" class="text-reset">ko-fi</a> <Icon name="arrow-up-right-square-fill" style="font-size: .9rem;"/>. -->
	</p>
	<a href="/credits" class="text-reset">Credits</a>
</Container>
</div>

<style>
	button:focus {
		outline: revert;
	}
</style>
