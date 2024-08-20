<script lang="ts">
	import { Navbar, Container, Image, NavItem, NavLink, Icon } from '@sveltestrap/sveltestrap';

	const kofi_words = ['coffee', 'pizza', 'bacon', 'chocolate', 'cheese'];
	const kofi_emojis = ['☕️', '🍕', '🥓', '🍫', '🧀'];
	const index = Math.floor(Math.random() * kofi_emojis.length);
	const treat = kofi_words[index];
	const emoji = kofi_emojis[index];
</script>

<Navbar style="background-color: #0b473b;" container="md">
	<NavItem>
		<Image class="w-25" src="/logo/logo-icon-cropped.svg" alt="Logo for EvA: Every Attendee" />
	</NavItem>
	<NavItem class="fs-4">
		<NavLink href="/rsvp/" style="color: #f9b13e">RSVP</NavLink>
	</NavItem>
</Navbar>

<Container class="text-center mt-1 mb-4">
	<slot></slot>
</Container>

<Container class="text-center mt-1 mb-4 fs-6">
	<hr />
	<p>
		<i>EveryAttendee</i> is built and maintained Eva J Herzog.<br />
		{emoji} Buy her some {treat} via <a href="https://ko-fi.com/evajherzog" target="_blank" class="text-reset">ko-fi</a> <Icon name="arrow-up-right-square-fill" />.
	</p>
	<hr>
	<a href="/credits" class="text-reset">Credits</a>
</Container>