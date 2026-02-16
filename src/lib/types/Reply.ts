import { Guest } from './Guest';

export class Reply {
	respondent: Guest;
	other_guests: Guest[];
	note?: string;

	constructor(respondent: Guest = new Guest(), other_guests: Guest[] = []) {
		this.respondent = respondent;
		this.other_guests = other_guests;
	}
}
