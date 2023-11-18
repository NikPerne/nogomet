import { Signup } from "./signup";

export class Event {
    _id!: string;
    name!: string;
    description!: string;
    date!: Date;
    signedup?: Signup[];
}
