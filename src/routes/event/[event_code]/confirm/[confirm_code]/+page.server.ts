export function load({ params }) {
	return {
		event: params.event_code,
		rsvp: params.confirm_code
	};
}
