import { Person } from './People';

export class Response {
	guest: Person;
	attending: string;

	constructor(guest: Person = new Person(''), attending: string = '') {
		this.guest = guest;
		this.attending = attending;
	}
}
