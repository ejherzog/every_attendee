import { addHours } from "date-fns";
import { User, Guest } from "./People";

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
    guests: Guest[];

    constructor(title: string, created_by: User) {
        this.title = title;
        this.created_by = created_by;
        this.hosts = [created_by];

        this.description = '';
        this.location = '';
        this.address = '';

        const now = new Date();
        this.start_time = addHours(now, 4)
        this.end_time = addHours(now, 8);

        this.guests = [];
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
        let host_names = '';
        this.hosts.forEach(user => {
            const name_to_use = user.full_name || user.name;
            host_names = host_names.concat(name_to_use)
        });
        return host_names;
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
        if (areSameDay(this.start_time, this.end_time)) {
            when = when.concat(`<br>${this.getTime()}`);
        } else {
            when = when.concat(`  ${timeFormatter.format(this.start_time)}<br>until<br>`);
            when = when.concat(`${dateFormatter.format(this.end_time)}  ${timeFormatter.format(this.end_time)}`);
        }
        return when;
    }
}

export function findEvent(code: string): Event {
    const sampleEvent = new Event("Sample Event", new User("Eva", "eowynecho88@gmail.com"));
    sampleEvent.addDescription("Join us to celebrate a random occurrence of a thing. BYOB. Friends and partners welcome.");
    sampleEvent.setLocation("Andrew's House", "4321 Maine Street, USA");
    return sampleEvent;
}

function generateCode() {
    return 'ACACAC';
}

function areSameDay(time1: Date, time2: Date) {
    return time1.getFullYear() == time2.getFullYear()
        && time1.getMonth() == time2.getMonth()
        && time1.getDate() == time2.getDate();
}