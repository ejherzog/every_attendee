export class DB_Event {

    id: string;
    host_id: number;
    title: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    address?: string;
    description?: string;
    image_url?: string;

    constructor(id: string, host_id: number, title: string, params?: {
        start_time?: string, end_time?: string, location?: string,
        address?: string, description?: string, image_url?: string
    }) {
        this.id = id;
        this.host_id = host_id;
        this.title = title;

        if (params) {
            if (params.start_time) this.start_time = params.start_time;
            if (params.end_time) this.end_time = params.end_time;
            if (params.end_time) this.end_time = params.end_time;
            if (params.location) this.location = params.location;
            if (params.address) this.address = params.address;
            if (params.description) this.description = params.description;
            if (params.image_url) this.image_url = params.image_url;
        }
    }
}