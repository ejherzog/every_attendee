<script lang="ts">
	import { Event, findEvent } from '$lib/types/Event';
	import {
		Col,
		Container,
		Image,
		ListGroup,
		ListGroupItem,
		Row
	} from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;

	let event: Event = findEvent(data.code);
	let when = event.getWhenHtml();
	let hosts = event.getHost();
</script>

<Container class="mt-1 mb-4">
	<h1>{event.title}</h1>
</Container>
<Container class="mt-1 mb-4">
	<Row class="align-items-center">
		<Col xs="12" md="6" class="mt-1">
			<Image
				fluid class="rounded shadow align-items-center"
				alt="Group of five friends taking a selfie"
				src="https://i0.wp.com/canweallgo.com/wp-content/uploads/2019/11/2A2A7302-1.jpg?w=1080&ssl=1"
			/>
		</Col>
		<Col xs="12" md="6" class="mt-1">
      <ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow mb-2">
        <ListGroupItem>
          <div class="h5">When</div>
        </ListGroupItem>
        <ListGroupItem>
          {@html when}
        </ListGroupItem>
        </ListGroup>
        <ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
        <ListGroupItem>
          <div class="h5">Where</div>
        </ListGroupItem>
        <ListGroupItem>
          {event.location}<br />{event.address}
        </ListGroupItem>
      </ListGroup>
      <ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
        <ListGroupItem>
          <div class="h5">What</div>
        </ListGroupItem>
        <ListGroupItem>
          {event.description}
        </ListGroupItem>
        </ListGroup>
        <ListGroup flush={false} horizontal={false} numbered={false} class="text-start shadow my-2">
        <ListGroupItem>
          <div class="h5">Hosted By</div>
        </ListGroupItem>
        <ListGroupItem>
          {hosts}
        </ListGroupItem>
      </ListGroup>
		</Col>
	</Row>
</Container>
