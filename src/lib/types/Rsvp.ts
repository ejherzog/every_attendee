import { Person } from "./People";
import validator from 'validator';

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

export class RsvpValidator {
    isAcceptable(rsvp: Rsvp, custom_pronoun: string | undefined, custom_diet: string | undefined) {
        return rsvp.guest.name.length > 0
            && validator.isIn(rsvp.attending, ['Y', 'M', 'N'])
            && customPronounIsValid(rsvp, custom_pronoun)
            && (phoneNumberIsValid(rsvp) || emailAddressIsValid(rsvp))
            && customDietIsValid(rsvp, custom_diet)
    }
}

function phoneNumberIsValid(rsvp: Rsvp) {
    if (rsvp.guest.phone) {
        return validator.isMobilePhone(rsvp.guest.phone);
    }
    return false;
}

function emailAddressIsValid(rsvp: Rsvp) {
    return rsvp.guest.email ? validator.isEmail(rsvp.guest.email) : false;
}

function customPronounIsValid(rsvp: Rsvp, custom: string | undefined) {
    if (rsvp.guest.pronoun_list.length > 0) {
        if (rsvp.guest.pronoun_list.includes('other')) {
            return custom ? custom.length > 0 : false;
        }
        return true;
    }
    return false;
}

function customDietIsValid(rsvp: Rsvp, custom: string | undefined) {
    if (rsvp.diets.length > 0 && rsvp.diets.includes('Other')) {
        if (custom) return custom.length > 0;
        return false;
    }
    return true;
}

function fieldIsDefined(field: string | undefined) {
    return field && field.length > 0;
}