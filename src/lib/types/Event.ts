import { addHours } from "date-fns";
import { User, Guest } from "./People";

export class Event {

    code: string;
    title: string;
    host: User | User[];
    created_by: User;
    start_time: Date;
    end_time: Date;
    guests: Guest[];

    constructor(title: string, created_by: User) {
        this.title = title;
        this.created_by = created_by;
        this.host = created_by;

        this.start_time = new Date();
        this.end_time = addHours(this.start_time, 4);

        this.guests = [];
        this.code = generateCode();
    }
}

export function findEvent(code: string): Event {
    return new Event("Sample Event", new User("eowynecho88@gmail.com", "Eva"));
}

function generateCode() {
    return 'ACACAC';
}