<script lang="ts">
	import { Row, Col, Button } from "@sveltestrap/sveltestrap";

    export let rsvp;
    let expanded = false;
</script>

<Row>
    <Col>{rsvp.name}</Col>
    <Col>{rsvp.attending}</Col>
    <!-- <Col>{rsvp.pronouns}</Col> -->
    <Col>
        <Button aria-expanded={expanded} on:click={() => expanded = !expanded}>More ⬇️</Button>
    </Col>
</Row>
{#if expanded}
<Row>
    <Col>{rsvp.id}</Col>
    <Col>{rsvp.comments}</Col>
</Row>
{/if}
<hr />