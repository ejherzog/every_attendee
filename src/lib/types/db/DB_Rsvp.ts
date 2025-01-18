export class DB_Rsvp {

    id: string;
    guest_id: number;
    name: string;
    full_name?: string;
    phone?: string;
    email?: string;
    attending: string;
    comments?: string;

    constructor(id: string, guest_id: number, name: string, attending: string, params?: { 
            full_name?: string, phone?: string, email?: string, comments?: string 
    }) {
        this.id = id;
        this.guest_id = guest_id;
        this.name = name;
        this.attending = attending;

        if (params) {
            if (params.full_name) this.full_name = params.full_name;
            if (params.phone) this.phone = params.phone;
            if (params.email) this.email = params.email;
            if (params.comments) this.comments = params.comments;
        }
    }
}