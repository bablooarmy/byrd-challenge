export class Customer {
    id: string;
    name: string;
    email: string;
    constructor(input: any = {}) {
        Object.assign(this, input);
        return this;
    }
}