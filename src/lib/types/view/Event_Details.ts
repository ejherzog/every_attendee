export class Event_Details {

    id: string;
    title: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    description: string;
    image_url: string;

    constructor(id: string, title: string, start_time: string , end_time: string ,
        location: string, address: string, description: string, image_url: string) {

        this.id = id;
        this.title = title;
        this.start_time = start_time;
        this.end_time = end_time;
        this.location = location;
        this.address = address;
        this.description = description;
        this.image_url = image_url;
    }
}