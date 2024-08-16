export class Person {

    name: string;
    full_name?: string;
    phone?: string;
    email?: string;

    constructor(name: string, full_name?: string) {
        this.name = name;
        this.full_name = full_name;
    }

    setPhone(phone: string) {
        this.phone = phone;
    }

    setEmail(email: string) {
        this.email = email;
    }
}

export class User extends Person {

    constructor(name: string, email: string, full_name?: string) {
        super(name, full_name);
        this.email = email;
    }
}

export class Guest extends Person {

    diet: string[];

    constructor(name: string) {
        super(name);
        this.diet = [];
    }
}