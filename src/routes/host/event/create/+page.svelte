<script lang="ts">
	import { Container, Form, Input, Label } from "@sveltestrap/sveltestrap";

    
</script>

<Container style="background-color: #ffcf8355;" class="py-2 rounded">
    <h3>Create Your Event</h3>

    <Form method="POST">
        <Label>Event Name</Label>
        <Input
						class="text-end"
						name="title"
						required
						aria-required="true"
					/>
    </Form>
</Container>