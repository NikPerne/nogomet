import { Component, Input, OnInit } from "@angular/core";
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
export class EventDetailsComponent implements OnInit {
  
  pridemCount: number = 0;

  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) { }

  @Input() event!: Event;

  
  ngOnInit() {
    this.fetchEventDetails();
  }

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

  fetchEventDetails() {
    const eventId = this.event._id;
    this.demoDataService.getEventDetails(eventId).subscribe((event) => {
    this.event = event;
    this.pridemCount = event.pridemCount ?? 0; // Update the pridemCount property, defaulting to 0 if undefined
    });
  }

  updateEventInDatabase() {
    const updatedEvent = { ...this.event, pridemCount: this.pridemCount };
    this.demoDataService.updateEvent(this.event._id, updatedEvent).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
      },
      error: (err) => {
        console.log('Error updating event:', err);
      }
    });
  }

  protected signUpForEvent() {
    this.newSignupPridem.name = this.getCurrentUser();
    this.demoDataService
      .signUpForEvent(this.event._id, this.newSignupPridem)
      .subscribe({
        next: (signedUp: Signup) => {
          this.event?.signedup?.unshift(signedUp);
          this.pridemCount++; // Increment the pridemCount
          this.updateEventInDatabase(); // Call a new method to update the event
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
          this.updateEventInDatabase(); // Call the new method to update the event
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