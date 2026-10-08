/**
 * The current user's account (GET /api/me), also used in the admin user list
 */
export class Account {
  _id!: string;
  name!: string;
  email!: string;
  admin!: boolean;
  /** Reminder and cancellation emails */
  emailNotifications!: boolean;
}
