export class Person {
	name: string;
	pronouns: string[];
	diets: string[];
	full_name?: string;
	phone?: string;
	email?: string;

	constructor(name: string, full_name?: string) {
		this.name = name;
		this.pronouns = [];
		this.diets = [];
		this.full_name = full_name;
	}

	setPhone(phone: string) {
		this.phone = phone;
	}

	setEmail(email: string) {
		this.email = email;
	}

	addPronouns(pronouns: string) {
		if (!pronouns) this.pronouns = [];
		this.pronouns!.push(pronouns);
	}
}

export class User extends Person {
	constructor(name: string, email: string, full_name?: string) {
		super(name, full_name);
		this.email = email;
	}
}
