import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import {
  DEFAULT_EVENT_TIME,
  Event,
  confirmedSignups,
  hasTimeOfDay,
  isEventFull,
  isEventPast,
} from "../../classes/event";

const MAX_EVENTS = 1000;
const PAST_EVENTS_SHOWN = 5;

const eventTime = (event: Event) => new Date(event.date).getTime();

@Component({
    selector: "app-event-list",
    templateUrl: "event-list.component.html",
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
  /** Initial values for the "Add event" form */
  protected formEvent?: Event;
  protected readonly confirmedCount = (event: Event) =>
    confirmedSignups(event).length;
  protected readonly isEventFull = isEventFull;
  protected readonly hasTimeOfDay = hasTimeOfDay;

  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * The next event that will actually take place (cancelled events are skipped)
   */
  protected get nextEvent(): Event | undefined {
    return this.upcomingEvents.find((event) => !event.cancelled);
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

  protected createEvent(event: Event): void {
    this.formDataError = "";
    this.demoDataService.createEvent(event).subscribe({
      next: (createdEvent) => {
        this.setEvents([createdEvent, ...this.upcomingEvents, ...this.pastEvents]);
        this.message = "";
        this.closeModal();
      },
      error: (err) => (this.formDataError = err),
    });
  }

  /**
   * Initial values copied from the latest event, one or more weeks later (the weekly match)
   */
  private prefilledEvent(): Event | undefined {
    const latest = [...this.upcomingEvents, ...this.pastEvents].reduce<
      Event | undefined
    >((max, event) => (!max || eventTime(event) > eventTime(max) ? event : max), undefined);
    if (!latest) return undefined;
    const date = new Date(latest.date);
    if (!hasTimeOfDay(latest)) {
      const [hours, minutes] = DEFAULT_EVENT_TIME.split(":").map(Number);
      date.setHours(hours, minutes);
    }
    do date.setDate(date.getDate() + 7);
    while (date.getTime() < Date.now());
    return {
      _id: "",
      name: latest.name,
      description: latest.description,
      date,
      maxPlayers: latest.maxPlayers ?? null,
    };
  }

  protected openModal(form: TemplateRef<any>): void {
    this.formEvent = this.prefilledEvent();
    this.formDataError = "";
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeModal(): void {
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
