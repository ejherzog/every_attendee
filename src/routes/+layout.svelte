<script lang="ts">
	import { Navbar, Container, Image } from '@sveltestrap/sveltestrap';
</script>

<Navbar style="background-color: #0b473b;">
    <Image class="mx-auto w-50" src="/logo/logo-cropped.svg" alt="Logo for EvA: Every Attendee" />
</Navbar>

<Container class="text-center mt-1 mb-4">
	<slot></slot>
</Container>

<Container class="text-center mt-1 mb-4">
	<hr />
	<p>
		EveryAttendee is the brainchild of <a href="https://github.com/ejherzog" class="text-reset" target="_blank">ejherzog</a>.
	</p>
</Container>