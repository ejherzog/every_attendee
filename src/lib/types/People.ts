import type { Pronouns } from "./Pronouns";

export class Person {

    name: string;
    pronounList: Pronouns[];
    full_name?: string;
    phone?: string;
    email?: string;

    constructor(name: string, full_name?: string) {
        this.name = name;
        this.pronounList = [];
        this.full_name = full_name;
    }

    setPhone(phone: string) {
        this.phone = phone;
    }

    setEmail(email: string) {
        this.email = email;
    }

    addPronouns(pronouns: Pronouns) {
        this.pronounList.push(pronouns);
    }
}

export class User extends Person {

    constructor(name: string, email: string, full_name?: string) {
        super(name, full_name);
        this.email = email;
    }
}

export class Guest extends Person {

    diet: string[];
    attending: string;
    note: string;

    constructor(name: string) {
        super(name);
        this.diet = [];
        this.attending = '';
        this.note = '';
    }
}