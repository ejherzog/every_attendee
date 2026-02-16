export class Event {
	id?: string;
	title: string;
	hosts?: string;
	hostCount?: number;
	when?: string;
	location?: string;
	address?: string;
	description?: string;
	image_url?: string;

	constructor(
		title: string,
		params?: {
			id?: string;
			hosts?: string;
			hostCount?: number;
			when?: string;
			location?: string;
			address?: string;
			description?: string;
			image_url?: string;
		}
	) {
		this.title = title;

		if (params) {
			if (params.id) this.id = params.id;
			if (params.hosts) this.hosts = params.hosts;
			if (params.hostCount) this.hostCount = params.hostCount;
			if (params.when) this.when = params.when;
			if (params.location) this.location = params.location;
			if (params.address) this.address = params.address;
			if (params.description) this.description = params.description;
			if (params.image_url) this.image_url = params.image_url;
		}
	}
}
