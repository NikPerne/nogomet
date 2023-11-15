export class Signup {
    _id?: string;
  eventId!: string;
  userId!: string;
  signedUpOn?: Date;

  constructor(
    eventId: string,
    userId: string
  ) {
    this.eventId = eventId;
    this.userId = userId;
  }
}
