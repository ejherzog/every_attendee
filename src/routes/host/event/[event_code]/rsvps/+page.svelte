<script lang="ts">
	import { Col, Container, Row, TabContent, TabPane } from '@sveltestrap/sveltestrap';

	/** @type {import('./$types').PageData} */
	export let data;

	function contactInfoString(rsvp: any) {
		if (rsvp.phone && rsvp.email) return `${rsvp.phone} | ${rsvp.email}`;
		if (rsvp.phone) return rsvp.phone;
		if (rsvp.email) return rsvp.email;
	}
</script>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
	<h3>RSVPs for {data.event.title}</h3>
	<TabContent class="nav-fill">
		<TabPane tabId="summary" tab="Summary" active>
			<h3>Responses*</h3>
			<p><b>Yes: </b>{data.summary.responses.yes}</p>
			<p><b>Maybe: </b>{data.summary.responses.maybe}</p>
			<p><b>No: </b>{data.summary.responses.no}</p>
			<hr />
			<h4>Dietary Restrictions</h4>
			{#each data.summary.diets as diet}
				<p>{diet}</p>
			{/each}
			<hr />
			<p><i>*If guests have responded more than once, these totals may be inaccurate.</i></p>
		</TabPane>
		<TabPane class="tab" tabId="notes" tab="Guest Notes">
			<Row class="m-2">
				<Col class="col-3"><b>Guest</b></Col>
				<Col class="col-3"><b>Response</b></Col>
				<Col class="col-6"><b>Notes</b></Col>
			</Row>
			{#each data.rsvps as rsvp}
				{#if rsvp.comments}
					<Row class="m-2">
						<Col class="col-3">{rsvp.full_name ? rsvp.full_name : rsvp.name}</Col>
						<Col class="col-3">{rsvp.attending}</Col>
						<Col class="col-6">{rsvp.comments}</Col>
					</Row>
				{/if}
			{/each}
		</TabPane>
		<TabPane tabId="contact" tab="Contact Information">
			<Row class="m-2">
				<Col><b>Guest</b></Col>
				<Col><b>Phone</b></Col>
				<Col><b>Email</b></Col>
			</Row>
			{#each data.rsvps as rsvp}
				<Row class="m-2">
					<Col>{rsvp.full_name ? rsvp.full_name : rsvp.name}</Col>
					<Col>{rsvp.phone}</Col>
					<Col>{rsvp.email}</Col>
				</Row>
			{/each}
		</TabPane>
		<TabPane tabId="detailed" tab="Full Details">
			{#each data.rsvps as rsvp}
				<Row class="m-2">
					<Col
						><b>Guest: </b>{rsvp.name}
						{#if rsvp.full_name}(<i>{rsvp.full_name}</i>){/if}</Col
					>
					<Col><b>Attending: </b>{rsvp.attending}</Col>
					<Col><b>Confirmation Code: </b>{rsvp.id}</Col>
				</Row>
				<Row class="m-2">
					<Col class="col-4"><b>Pronouns: </b>{rsvp.pronouns}</Col>
					<Col class="col-8"
						><b>Dietary Restrictions: </b>{#if rsvp.diets}{rsvp.diets}{:else}<i>none</i>{/if}</Col
					>
				</Row>
				<Row class="m-2">
					<Col class="col-4"><b>Contact Info: </b>{contactInfoString(rsvp)}</Col>
					<Col class="col-8"
						><b>Notes: </b>{#if rsvp.comments}{rsvp.comments}{:else}<i>none</i>{/if}</Col
					>
				</Row>
				<hr />
			{/each}
		</TabPane>
	</TabContent>
</Container>
