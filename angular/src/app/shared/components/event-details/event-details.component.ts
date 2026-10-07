import { Component, Input } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { Event } from "../../classes/event";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { User } from "../../classes/user";
import { Signup } from "../../classes/signup";

@Component({
  selector: "app-event-details",
  templateUrl: "event-details.component.html",
  styles: [],
})
export class EventDetailsComponent {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  @Input() event!: Event;

  protected errorMessage = "";

  /**
   * Number of users attending ("Pridem"), derived from the signups
   */
  public get attendingCount(): number {
    return this.event?.signedup?.filter((signup) => signup.attending).length ?? 0;
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  protected signUp(attending: boolean): void {
    this.errorMessage = "";
    const signup: Signup = { name: this.getCurrentUserName(), attending };
    this.demoDataService.signUpForEvent(this.event._id, signup).subscribe({
      next: (created: Signup) => {
        this.event.signedup = [created, ...(this.event.signedup ?? [])];
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  protected deleteSignup(signupId: string | undefined): void {
    if (!signupId) return;
    this.errorMessage = "";
    this.demoDataService
      .deleteSignUpFromEvent(this.event._id, signupId)
      .subscribe({
        next: () => {
          this.event.signedup = this.event.signedup?.filter(
            (signup) => signup._id !== signupId
          );
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  public isUserSignedUp(): boolean {
    return this.event?.signedup?.some((signup) => this.isOwnSignup(signup)) ?? false;
  }

  public canDeleteSignUp(signup: Signup): boolean {
    return this.isLoggedIn() && this.isOwnSignup(signup);
  }

  /**
   * Signups created before userId was stored can only be matched by name
   */
  private isOwnSignup(signup: Signup): boolean {
    const user: User | null = this.authenticationService.getCurrentUser();
    if (!user) return false;
    return signup.userId ? signup.userId === user._id : signup.name === user.name;
  }

  private getCurrentUserName(): string {
    return this.authenticationService.getCurrentUser()?.name ?? "Guest";
  }
}
