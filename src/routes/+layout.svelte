<script lang="ts">
	import { Navbar, Container, Image, NavbarBrand, Nav, NavItem, NavLink } from '@sveltestrap/sveltestrap';
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

<Container class="text-center mt-1 mb-4 fs-5">
	<hr />
	<p>
		EveryAttendee is built and maintained with <strike>☕️ and 🍕</strike><br />
		...<i>errr that is</i>... with 🧡 by Eva J Herzog.
	</p>
	<hr>
	<a href="/credits" class="text-reset">Credits</a>
</Container>