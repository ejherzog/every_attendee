import { Person } from "./People";

export class Rsvp {

    guest: Person;
    attending: string;
    diets: string[];
    note?: string;

    constructor(guest: Person = new Person(''), attending: string = '') {
        this.guest = guest;
        this.attending = attending;
        this.diets = [];
        this.note = '';
    }

    static fromFormData(data: any): Rsvp {
        const guest = new Person(data.get("name"));
        if (fieldIsDefined(data.get("full_name"))) guest.full_name = data.get("full_name");

        if (fieldIsDefined(data.get("phone"))) guest.phone = data.get("phone");
        if (fieldIsDefined(data.get("email"))) guest.email = data.get("email");

        guest.pronoun_list = JSON.parse(data.get("pronouns"));
        if (fieldIsDefined(data.get("custom_pronoun"))) guest.addPronouns(data.get("custom_pronoun"));

        const rsvp = new Rsvp(guest, data.get("attending"));
        if (fieldIsDefined(data.get("diets"))) rsvp.diets = JSON.parse(data.get("diets"));
        if (fieldIsDefined(data.get("custom_diet"))) rsvp.diets.push(data.get("custom_diet"));
        if (fieldIsDefined(data.get("note"))) rsvp.note = data.get("note");

        return rsvp;
    }
}

export function findRsvp(code: string) {
    return 'Except not really -- this app isn\'t hooked up to a functional database yet!';
}

function fieldIsDefined(field: string | undefined) {
    return field && field.length > 0;
}