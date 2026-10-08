export class Signup {
  _id?: string;
  userId?: string;
  name!: string;
  attending!: boolean;
  createdOn?: Date;
  attendingSince?: Date;
  note?: string;
  /** Set for guests: the user who added them (guests have no userId) */
  guestOf?: string;
  guestOfName?: string;
}
