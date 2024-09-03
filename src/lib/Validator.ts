import type { Guest } from "./types/People";

interface StringValidator {
    isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;
const six_letters = new RegExp('([A-Za-z]{6})');

export class EventCodeValidator implements StringValidator {

    isAcceptable(s: string) {
        return s.length == 6 && six_letters.test(s);
    }
}

export class RsvpValidator {
    isAcceptable(formData: any) {
        console.log(formData.phone);
        return (formData.phone || formData['email']);
    }
}