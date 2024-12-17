import { User } from "./People";
import type { Rsvp } from "./Rsvp";

const six_letters = new RegExp('([A-Za-z]{6})');

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short"
});

export class Event {

    code: string;
    title: string;
    hosts: User[];
    created_by: User;

    start_time: Date;
    end_time: Date;
    location: string;
    address: string;

    description: string;
    rsvps: Rsvp[];

    constructor(title: string, created_by: User) {
        this.title = title;
        this.created_by = created_by;
        this.hosts = [created_by];

        this.description = '';
        this.location = '';
        this.address = '';
        
        this.start_time = new Date("September 18, 2024 6:30 PM");
        this.end_time = new Date("September 18, 2024 10:00 PM");

        this.rsvps = [];
        this.code = generateCode();
    }

    addDescription(description: string) {
        this.description = description;
    }

    setLocation(location: string, address: string) {
        this.location = location;
        this.address = address;
    }

    addHosts(additionalHosts: User[]) {
        this.hosts.push(...additionalHosts);
    }

    getHost() {
        const lf = new Intl.ListFormat('en');
        let host_names: string[] = [];
        this.hosts.forEach(user => {
            host_names.push(user.full_name || user.name);
        });
        return lf.format(host_names);
    }

    getDate() {
        if (areSameDay(this.start_time, this.end_time)) {
            return dateFormatter.format(this.start_time);
        }
        return `${dateFormatter.format(this.start_time)} - ${dateFormatter.format(this.end_time)}`;
    }

    getTime() {
        return `${timeFormatter.format(this.start_time)} - ${timeFormatter.format(this.end_time)}`;
    }

    getWhenHtml() {
        let when = dateFormatter.format(this.start_time);
        console.log(when);
        if (areSameDay(this.start_time, this.end_time)) {
            console.log("same day");
            when = when.concat(`<br>${this.getTime()}`);
        } else {
            when = when.concat(`  ${timeFormatter.format(this.start_time)}<br>until<br>`);
            when = when.concat(`${dateFormatter.format(this.end_time)}  ${timeFormatter.format(this.end_time)}`);
        }
        console.log(when);
        return when;
    }
}

function generateCode() {
    return 'OEIFNI';
}

function areSameDay(time1: Date, time2: Date) {
    return time1.getFullYear() == time2.getFullYear()
        && time1.getMonth() == time2.getMonth()
        && time1.getDate() == time2.getDate();
}

export class EventCodeValidator {

    isAcceptable(code: string) {
        return code.length == 6 && six_letters.test(code);
    }
}