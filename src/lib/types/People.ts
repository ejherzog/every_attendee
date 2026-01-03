export class Person {
	name: string;
	pronoun_list: string[];
	diets?: string[];
	full_name?: string;
	phone?: string;
	email?: string;

	constructor(name: string, full_name?: string) {
		this.name = name;
		this.pronoun_list = [];
		this.full_name = full_name;
	}

	setPhone(phone: string) {
		this.phone = phone;
	}

	setEmail(email: string) {
		this.email = email;
	}

	addPronouns(pronouns: string) {
		this.pronoun_list.push(pronouns);
	}
}

export class User extends Person {
	constructor(name: string, email: string, full_name?: string) {
		super(name, full_name);
		this.email = email;
	}
}
