import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy
} from "@angular/core";
import { formatDate } from "@angular/common";
import { DEFAULT_EVENT_TIME, Event, hasTimeOfDay } from "../../classes/event";

/**
 * Modal body for creating or editing an event (used inside an ngx-bootstrap modal).
 * Emits the edited fields on save; the parent does the API call and passes back errors.
 */
@Component({
    selector: "app-event-form",
    templateUrl: "event-form.component.html",
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EventFormComponent implements OnChanges {
  @Input() title = "";
  @Input() hint = "";
  /** Initial values; for editing, the event being edited */
  @Input() event?: Event;
  /** Error from the parent's API call */
  @Input() error = "";
  @Output() save = new EventEmitter<Event>();
  @Output() dismiss = new EventEmitter<void>();

  protected name = "";
  protected description = "";
  /** Native date input value, "yyyy-MM-dd" */
  protected date = "";
  protected time = DEFAULT_EVENT_TIME;
  protected maxPlayers: number | null = null;
  protected validationError = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["event"]) this.reset();
  }

  private reset(): void {
    const event = this.event;
    this.name = event?.name ?? "";
    this.description = event?.description ?? "";
    this.date = formatDate(event ? event.date : new Date(), "yyyy-MM-dd", "sl");
    this.time =
      event && hasTimeOfDay(event)
        ? formatDate(event.date, "HH:mm", "sl")
        : DEFAULT_EVENT_TIME;
    this.maxPlayers = event?.maxPlayers ?? null;
    this.validationError = "";
  }

  protected submit(): void {
    this.validationError = "";
    const { maxPlayers } = this;
    const valid =
      this.name.trim() &&
      this.description.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(this.date ?? "") &&
      /^\d{2}:\d{2}$/.test(this.time ?? "") &&
      (maxPlayers == null || (Number.isInteger(maxPlayers) && maxPlayers >= 1));
    if (!valid) {
      this.validationError =
        "Name, description, date and time are required; max players must be a whole number of at least 1.";
      return;
    }
    this.save.emit({
      _id: this.event?._id ?? "",
      name: this.name.trim(),
      description: this.description.trim(),
      date: this.combinedDate(),
      maxPlayers,
    });
  }

  /**
   * Combines the date ("yyyy-MM-dd") and time ("HH:mm") inputs into a local Date
   */
  private combinedDate(): Date {
    const [year, month, day] = this.date.split("-").map(Number);
    const [hours, minutes] = this.time.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
}
