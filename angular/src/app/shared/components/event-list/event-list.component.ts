import { Component, OnInit, TemplateRef } from "@angular/core";
import { formatDate } from "@angular/common";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import {
  Event,
  confirmedSignups,
  hasTimeOfDay,
  isEventFull,
  isEventPast,
} from "../../classes/event";

const MAX_EVENTS = 1000;
const PAST_EVENTS_SHOWN = 5;
const DEFAULT_TIME = "20:00";

const eventTime = (event: Event) => new Date(event.date).getTime();

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
  protected newEventTime = DEFAULT_TIME;
  protected readonly confirmedCount = (event: Event) =>
    confirmedSignups(event).length;
  protected readonly isEventFull = isEventFull;
  protected readonly hasTimeOfDay = hasTimeOfDay;

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
    this.upcomingEvents = events
      .filter((event) => !isEventPast(event))
      .sort((a, b) => eventTime(a) - eventTime(b));
    this.pastEvents = events
      .filter((event) => isEventPast(event))
      .sort((a, b) => eventTime(b) - eventTime(a));
  }

  protected createEvent(): void {
    this.formDataError = "";
    if (!this.isFormDataValid()) {
      this.formDataError =
        "Name, description, date and time are required; max players must be a whole number of at least 1.";
      return;
    }
    const event: Event = { ...this.newEvent, date: this.combinedDate() };
    this.demoDataService.createEvent(event).subscribe({
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
      /^\d{2}:\d{2}$/.test(this.newEventTime ?? "") &&
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

  /**
   * The date picker gives a date; the time comes from the separate time field
   */
  private combinedDate(): Date {
    const date = new Date(this.newEvent.date);
    const [hours, minutes] = this.newEventTime.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * Pre-fills the form from the latest event, one week later (the weekly match)
   */
  private prefillFromLatestEvent(): void {
    const latest = [...this.upcomingEvents, ...this.pastEvents].reduce<
      Event | undefined
    >((max, event) => (!max || eventTime(event) > eventTime(max) ? event : max), undefined);
    if (!latest) {
      this.newEvent = this.emptyEvent();
      this.newEventTime = DEFAULT_TIME;
      return;
    }
    const date = new Date(latest.date);
    do date.setDate(date.getDate() + 7);
    while (date.getTime() < Date.now());
    this.newEvent = {
      _id: "",
      name: latest.name,
      description: latest.description,
      date,
      maxPlayers: latest.maxPlayers ?? null,
    };
    this.newEventTime = hasTimeOfDay(latest)
      ? formatDate(latest.date, "HH:mm", "sl")
      : DEFAULT_TIME;
  }

  protected openModal(form: TemplateRef<any>): void {
    this.prefillFromLatestEvent();
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeModal(): void {
    this.newEvent = this.emptyEvent();
    this.newEventTime = DEFAULT_TIME;
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
