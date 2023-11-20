import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { Event } from "../../classes/event";
import { User } from "../../classes/user";

@Component({
  selector: 'app-event-list',
  templateUrl: "event-list.component.html",
  styles: [
  ]
})
export class EventListComponent implements OnInit {
  modalRef?: BsModalRef;
  constructor( 
    private modalService: BsModalService,   
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
    ) {}
  
    ngOnInit() {
      this.getEvents();
    }

    private filterLocations = {
      nResults: 10,
    };


  protected events!: Event[];
  protected user!: User;
  protected newEvent: Event = {
    name: "",
    description: "",
    date: new Date(),
    _id: ''
  }

  protected message!: string;

  private getEvents = () => {
    this.message = "Loading nearby events ...";
    this.demoDataService
      .getEvents(
        this.filterLocations.nResults
      )
      .subscribe((events) => {
        this.message = events.length > 0 ? "" : "No events found!";
        this.events = events;
      });
  };

/*    private getEvents = () => {
    this.demoDataService.getEvents(10).subscribe({
      next: (apiEvents: any[]) => {
        this.events = apiEvents.map(apiEvent => {
          const event: Event = {
            // map API event properties to Event interface  
            _id: apiEvent._id,
            name: apiEvent.name,
            description: apiEvent.description,
            date: apiEvent.date
          };
          return event;
        });
      }
    });
  } */

  private isFormDataValid(): boolean {
    let isValid = false;
    if (
      this.newEvent.name &&
      this.newEvent.description &&
      this.newEvent.date
    ) {
      isValid = true;
    }
    return isValid;
  }

  createEvent() {
    this.formDataError = "";
      if (this.isFormDataValid()) {
        this.demoDataService.createEvent(this.newEvent).subscribe({
          next: (createdEvent) => {
            this.getEvents;
            // Add created event to array
            this.events?.unshift(createdEvent);
            // Reload events
            this.demoDataService.getEvents(10);
            // Reset form
            this.newEvent = new Event();
            // Close modal
            this.closeModal();
            this.getEvents;
          },
          error: (error) => {
            this.formDataError = error;
          }
        });
      } else {
        this.formDataError =
          "All fields required, including rating between 1 and 5.";
      }
  }

  protected formDataError!: string;

  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeModal() {
    this.newEvent = {
      _id: "",
      name: "",
      description: "",
      date: new Date,
    };
    this.formDataError = "";
    this.modalRef?.hide();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isConnected(): boolean {
    if (!this.connectionService.isConnected) this.closeModal();
    return this.connectionService.isConnected;
  }

  public getCurrentUser(): boolean {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.admin : false;
  }

  isAdmin(user: User): boolean {
    return this.getCurrentUser() === user.admin;
  }
}
