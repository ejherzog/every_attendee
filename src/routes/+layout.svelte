<script lang="ts">
	import { Navbar, NavbarBrand, Container, Image, NavLink, Icon, Row, Col } from '@sveltestrap/sveltestrap';

	// const kofi_words = ['coffee', 'pizza', 'bacon', 'chocolate', 'cheese'];
	// const kofi_emojis = ['☕️', '🍕', '🥓', '🍫', '🧀'];
	// const index = Math.floor(Math.random() * kofi_emojis.length);
	// const treat = kofi_words[index];
	// const emoji = kofi_emojis[index];
</script>

<Navbar style="background-color: #0b473b;" container="md">
	<Row class="w-100 justify-content-between align-items-center">
		<Col class="col-md-3 col-6">
			<!-- <Image class="w-100" src="/logo/logo-icon-cropped.svg" alt="Logo for EvA: Every Attendee" /> -->
			<NavbarBrand href="/" style="color: #f9b13e" class="fs-2">EveryAttendee <tag class="fs-4 fw-lighter fst-italic">(𝛂 v0.1)</tag></NavbarBrand>
		</Col>
		<Col class="col-md-3 col-6 text-end">
			<NavLink href="/rsvp/" style="color: #f9b13e" class="fs-5">RSVP</NavLink>
		</Col>
	</Row>
</Navbar>

<Container class="text-center mt-1 mb-4">
	<slot></slot>
</Container>

<Container class="text-center mt-1 mb-4 fs-6">
	<hr />
	<p>
		<i>EveryAttendee</i> is built and maintained Eva J Herzog.<br />
		<!-- {emoji} Buy her some {treat} via <a href="https://ko-fi.com/evajherzog" target="_blank" class="text-reset">ko-fi</a> <Icon name="arrow-up-right-square-fill" style="font-size: .9rem;"/>. -->
	</p>
	<hr>
	<a href="/credits" class="text-reset">Credits</a>
</Container>