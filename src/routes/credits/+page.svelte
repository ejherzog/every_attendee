<script>
	import {
		Card,
		CardBody,
		CardHeader,
		CardLink,
		CardSubtitle,
		CardTitle,
		Container,
		ListGroup,
		ListGroupItem
	} from '@sveltestrap/sveltestrap';
</script>

<h1 class="text-center my-3">Credits</h1>

<Container class="col-md-8 justify-content-center">
	<Card class="m-5 text-reset">
		<CardHeader>
			<CardTitle>Eva J Herzog</CardTitle>
			<CardSubtitle>Creator & Maintainer</CardSubtitle>
		</CardHeader>
		<CardBody>
			<CardLink href="https://github.com/ejherzog" target="_blank" rel="noopener noreferrer" class="text-reset" aria-label="Github (opens in new window)"
				>Github</CardLink
			>
			<CardLink href="https://ejherzog.github.io" target="_blank" rel="noopener noreferrer" class="text-reset" aria-label="Portfolio (opens in new window)"
				>Portfolio</CardLink
			>
			<CardLink href="https://www.linkedin.com/in/ejherzog" target="_blank" rel="noopener noreferrer" class="text-reset" aria-label="LinkedIn (opens in new window)"
				>LinkedIn</CardLink
			>
			<CardLink href="https://ko-fi.com/evajherzog" target="_blank" rel="noopener noreferrer" class="text-reset" aria-label="Ko-Fi (opens in new window)"
				>Ko-Fi</CardLink
			>
		</CardBody>
	</Card>
	<Card class="m-5 text-reset">
		<CardHeader>
			<CardTitle>Resources</CardTitle>
		</CardHeader>
		<ListGroup>
			<ListGroupItem class="text-reset bg-transparent">
				Favicon: Made with <a href="https://favicon.io/favicon-generator/"
					>favicon.io Favicon Generator</a
				>
			</ListGroupItem>
			<ListGroupItem class="text-reset bg-transparent">
				Logo: Made with <a href="https://favicon.io/logo-generator/">favicon.io Logo Generator</a>
			</ListGroupItem>
			<ListGroupItem class="text-reset bg-transparent">
				Logo & Favicon Font: <a href="https://tribby.com/fonts/barlow/">Barlow Condensed</a>
			</ListGroupItem>
			<ListGroupItem class="text-reset bg-transparent">
				Sample Event Image: <a href="https://canweallgo.com/plus-size-stock-photos/"
					>AllGo Free Stock Photos</a
				>
			</ListGroupItem>
			<ListGroupItem class="text-reset bg-transparent">
				Karaoke Event Image: Photo by <a
					href="https://unsplash.com/@kitera?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
					>Kitera Dent</a
				>
				on
				<a
					href="https://unsplash.com/photos/a-full-moon-rises-over-a-desert-landscape-NPU1YdmnAvw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
					>Unsplash</a
				>
			</ListGroupItem>
		</ListGroup>
	</Card>
</Container>
