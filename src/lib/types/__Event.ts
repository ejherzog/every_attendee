// import { User } from "./People";
// import type { Rsvp } from "./Rsvp";



// const dateFormatter = new Intl.DateTimeFormat("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "2-digit",
//     year: "numeric"
// });

// const timeFormatter = new Intl.DateTimeFormat("en-US", {
//     timeStyle: "short"
// });

// export class Event {

//     code: string;
//     title: string;
//     hosts: User[];
//     created_by: User;

//     start_time: Date;
//     end_time: Date;
//     location: string;
//     address: string;

//     description: string;
//     rsvps: Rsvp[];

//     constructor(title: string, created_by: User) {
//         this.title = title;
//         this.created_by = created_by;
//         this.hosts = [created_by];

//         this.description = '';
//         this.location = '';
//         this.address = '';
        
//         this.start_time = new Date("September 18, 2024 6:30 PM");
//         this.end_time = new Date("September 18, 2024 10:00 PM");

//         this.rsvps = [];
//         this.code = generateCode();
//     }

//     addDescription(description: string) {
//         this.description = description;
//     }

//     setLocation(location: string, address: string) {
//         this.location = location;
//         this.address = address;
//     }

//     addHosts(additionalHosts: User[]) {
//         this.hosts.push(...additionalHosts);
//     }



//     // getDate() {
//     //     if (areSameDay(this.start_time, this.end_time)) {
//     //         return dateFormatter.format(this.start_time);
//     //     }
//     //     return `${dateFormatter.format(this.start_time)} - ${dateFormatter.format(this.end_time)}`;
//     // }
// }

// function generateCode() {
//     return 'OEIFNI';
// }



