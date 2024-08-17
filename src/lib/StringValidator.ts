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