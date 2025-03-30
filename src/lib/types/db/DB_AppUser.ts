export class DB_AppUser {

    id: number;
    username: string;
    password_hash: string;

    constructor(id: number, username: string, password_hash: string) {
        this.id = id;
        this.username = username;
        this.password_hash = password_hash;
    }
}