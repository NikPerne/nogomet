export class User {
  _id?: string;
  timesSignedUp!: number;
  admin!: boolean;
  email!: string;
  name!: string;
  password?: string;
}
