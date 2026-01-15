import { Person } from './People';

export class Guest {
	person: Person;
	attending: string;

	constructor(person: Person = new Person(''), attending: string = '') {
		this.person = person;
		this.attending = attending;
	}
}
