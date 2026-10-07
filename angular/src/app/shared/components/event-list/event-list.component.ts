import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { Event } from "../../classes/event";

const MAX_EVENTS = 1000;

@Component({
  selector: "app-event-list",
  templateUrl: "event-list.component.html",
  styles: [],
})
export class EventListComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  private modalRef?: BsModalRef;

  protected events: Event[] = [];
  protected message = "";
  protected formDataError = "";
  protected newEvent: Event = this.emptyEvent();

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.message = "Loading events ...";
    this.demoDataService.getEvents(MAX_EVENTS).subscribe({
      next: (events) => {
        this.events = events;
        this.message = events.length > 0 ? "" : "No events found!";
      },
      error: (err) => (this.message = err),
    });
  }

  protected createEvent(): void {
    this.formDataError = "";
    if (!this.isFormDataValid()) {
      this.formDataError = "All fields are required.";
      return;
    }
    this.demoDataService.createEvent(this.newEvent).subscribe({
      next: (createdEvent) => {
        this.events = [createdEvent, ...this.events];
        this.message = "";
        this.closeModal();
      },
      error: (err) => (this.formDataError = err),
    });
  }

  private isFormDataValid(): boolean {
    return !!(
      this.newEvent.name?.trim() &&
      this.newEvent.description?.trim() &&
      this.newEvent.date
    );
  }

  private emptyEvent(): Event {
    return { _id: "", name: "", description: "", date: new Date() };
  }

  protected openModal(form: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeModal(): void {
    this.newEvent = this.emptyEvent();
    this.formDataError = "";
    this.modalRef?.hide();
    this.modalRef = undefined;
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  public isConnected(): boolean {
    // Close an open form when the connection drops, since it can't be saved
    if (!this.connectionService.isConnected && this.modalRef) this.closeModal();
    return this.connectionService.isConnected;
  }
}
