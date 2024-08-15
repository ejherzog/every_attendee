export class User {

    email: string;
    name_short: string; // How should we address you?
    name_full: string | undefined; // singular name field

    constructor(email: string, name_short: string, name_full?: string) {
        this.email = email;
        this.name_short = name_short;
        this.name_full = name_full || undefined;
    }
}