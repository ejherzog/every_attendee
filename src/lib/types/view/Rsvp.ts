import type { Option } from 'svelte-multiselect';

export class Rsvp {
	name: string;
	full_name?: string;
	guest_id: number;

	phone?: string;
	email?: string;

	pronouns: Option[];
	diets: Option[];

	attending: string;
	comments?: string;
	confirmation_code: string;

	constructor(
		name: string,
		guest_id: number,
		pronouns: Option[],
		diets: Option[],
		attending: string,
		confirmation_code: string,
		params?: {
			full_name?: string;
			phone?: string;
			email?: string;
			comments?: string;
		}
	) {
		this.name = name;
		this.guest_id = guest_id;

		this.pronouns = pronouns;
		this.diets = diets;
		this.attending = attending;
		this.confirmation_code = confirmation_code;

		if (params) {
			if (params.full_name) this.full_name = params.full_name;
			if (params.phone) this.phone = params.phone;
			if (params.email) this.email = params.email;
			if (params.comments) this.comments = params.comments;
		}
	}
}
