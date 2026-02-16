import { Person } from './People';

export class Guest {
	person: Person;
	attending: string;
	/** When editing, the existing person_id for update; undefined for new guests. */
	person_id?: number;

	constructor(person: Person = new Person(''), attending: string = '', person_id?: number) {
		this.person = person;
		this.attending = attending;
		this.person_id = person_id;
	}
}
