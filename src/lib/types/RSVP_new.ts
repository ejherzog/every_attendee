import { Response } from './Response';

export class Rsvp_New {
	respondent: Response;
	other_guests: Response[];
	note?: string;

	constructor(respondent: Response = new Response(), other_guests: Response[] = []) {
		this.respondent = respondent;
		this.other_guests = other_guests;
	}
}
