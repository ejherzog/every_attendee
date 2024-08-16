import { addHours } from "date-fns";
import { User } from "./User";

export class Event {

    title: string;
    host: User | User[];
    created_by: User;
    start_time: Date;
    end_time: Date;

    constructor(title: string, created_by: User) {
        this.title = title;
        this.created_by = created_by;
        this.host = created_by;

        this.start_time = new Date();
        this.end_time = addHours(this.start_time, 4);
    }
}

export function findEvent(code: string): Event | undefined {
    return new Event("Sample Event", new User("eowynecho88@gmail.com", "Eva"));
}