import { Component, Input } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { Event } from "../../classes/event";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { User } from "../../classes/user";
import { Signup } from "../../classes/signup";

@Component({
  selector: 'app-event-details',
  templateUrl: "event-details.component.html",
  styles: []
})
export class EventDetailsComponent {

  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) { }

  @Input() event!: Event;

  protected newSignupPridem: Signup = {
    name: "",
    createdOn: new Date(),
    attending: true,
  };

  protected newSignupNe: Signup = {
    name: "",
    createdOn: new Date(),
    attending: false,
  };

  public isConnected(): boolean {
    if (!this.connectionService.isConnected) this.isLoggedIn();
    return this.connectionService.isConnected;
  }

  protected signUpForEvent() {
    this.newSignupPridem.name = this.getCurrentUser();
    this.demoDataService
      .signUpForEvent(this.event._id, this.newSignupPridem)
      .subscribe({
        next: (signedUp: Signup) => {
          this.event?.signedup?.unshift(signedUp);
        },
          error: (err) => {
          "Error adding signup.";
        },
    });
  }

  protected signUpForEventNe() {
    this.newSignupNe.name = this.getCurrentUser();
    this.demoDataService
      .signUpForEvent(this.event._id, this.newSignupNe)
      .subscribe({
        next: (signedUp: Signup) => {
          this.event?.signedup?.unshift(signedUp);
        },
          error: (err) => {
          "Error adding signup.";
        },
    });
  }

  isUserSignedUp() {
    return this.event.signedup?.some(signup => {
      return signup.name === this.getCurrentUser(); 
    });
  }

  protected deleteSignup(signupId: string | undefined): void {
    if (signupId) {
      this.demoDataService
        .deleteSignUpFromEvent(this.event._id, signupId)
        .subscribe({
          next: () => {
            this.event.signedup = this.event.signedup?.filter(
              (signup) => signup._id !== signupId
            );
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  public canDeleteSignUp(signedUp: Signup): boolean {
    return this.isLoggedIn() && this.getCurrentUser() === signedUp.name;
  }

}