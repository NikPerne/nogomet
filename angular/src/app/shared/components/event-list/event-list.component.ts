import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { Event, attendingCount, isEventPast } from "../../classes/event";

const MAX_EVENTS = 1000;
const PAST_EVENTS_SHOWN = 5;

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

  protected upcomingEvents: Event[] = [];
  protected pastEvents: Event[] = [];
  protected showAllPast = false;
  protected message = "";
  protected formDataError = "";
  protected newEvent: Event = this.emptyEvent();
  protected readonly attendingCount = attendingCount;

  ngOnInit(): void {
    this.loadEvents();
  }

  protected get visiblePastEvents(): Event[] {
    return this.showAllPast
      ? this.pastEvents
      : this.pastEvents.slice(0, PAST_EVENTS_SHOWN);
  }

  protected get hiddenPastCount(): number {
    return this.pastEvents.length - this.visiblePastEvents.length;
  }

  private loadEvents(): void {
    this.message = "Loading events ...";
    this.demoDataService.getEvents(MAX_EVENTS).subscribe({
      next: (events) => {
        this.setEvents(events);
        this.message = events.length > 0 ? "" : "No events found!";
      },
      error: (err) => (this.message = err),
    });
  }

  /**
   * Upcoming events are shown soonest first, past events most recent first
   */
  private setEvents(events: Event[]): void {
    const time = (event: Event) => new Date(event.date).getTime();
    this.upcomingEvents = events
      .filter((event) => !isEventPast(event))
      .sort((a, b) => time(a) - time(b));
    this.pastEvents = events
      .filter((event) => isEventPast(event))
      .sort((a, b) => time(b) - time(a));
  }

  protected createEvent(): void {
    this.formDataError = "";
    if (!this.isFormDataValid()) {
      this.formDataError =
        "Name, description and date are required; max players must be a whole number of at least 1.";
      return;
    }
    this.demoDataService.createEvent(this.newEvent).subscribe({
      next: (createdEvent) => {
        this.setEvents([createdEvent, ...this.upcomingEvents, ...this.pastEvents]);
        this.message = "";
        this.closeModal();
      },
      error: (err) => (this.formDataError = err),
    });
  }

  private isFormDataValid(): boolean {
    const maxPlayers = this.newEvent.maxPlayers;
    return !!(
      this.newEvent.name?.trim() &&
      this.newEvent.description?.trim() &&
      this.newEvent.date &&
      (maxPlayers == null || (Number.isInteger(maxPlayers) && maxPlayers >= 1))
    );
  }

  private emptyEvent(): Event {
    return {
      _id: "",
      name: "",
      description: "",
      date: new Date(),
      maxPlayers: null,
    };
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
