import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DemoDataService } from "../../services/demo-data.service";
import {
  Event,
  areSignupsClosed,
  confirmedSignups,
  hasTimeOfDay,
  isEventFull,
  isEventPast,
  waitlistedSignups,
} from "../../classes/event";
import { eventToIcs } from "../../classes/calendar";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { ShareService } from "../../services/share.service";
import { User } from "../../classes/user";
import { Signup } from "../../classes/signup";
import { PlayerStats } from "../../classes/player-stats";

/** Same limits as the API (signup note field, guest name) */
const NOTE_MAX_LENGTH = 100;
const GUEST_NAME_MAX_LENGTH = 40;
const MAX_PLAYERS_LOADED = 1000;

@Component({
  selector: "app-event-details",
  templateUrl: "event-details.component.html",
  styles: [],
})
export class EventDetailsComponent implements OnInit, OnChanges {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    private modalService: BsModalService,
    private shareService: ShareService,
    private router: Router
  ) {}

  @Input() event!: Event;
  /** Emits the event after an admin edits, cancels or restores it */
  @Output() eventChange = new EventEmitter<Event>();

  protected errorMessage = "";
  protected infoMessage = "";
  protected formError = "";
  protected noteDraft = "";
  protected guestName = "";
  protected readonly noteMaxLength = NOTE_MAX_LENGTH;
  protected readonly guestNameMaxLength = GUEST_NAME_MAX_LENGTH;
  /** All players with statistics, used for "who hasn't replied yet" */
  private players: PlayerStats[] = [];
  private modalRef?: BsModalRef;

  ngOnInit(): void {
    this.demoDataService.getPlayerStats(MAX_PLAYERS_LOADED).subscribe({
      next: (players) => (this.players = players),
      // The reminder list is optional, so the page works without it
      error: () => (this.players = []),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["event"]) this.noteDraft = this.ownSignup?.note ?? "";
  }

  /**
   * Regular players (at least one game played) who haven't answered this event yet
   */
  public get notResponded(): PlayerStats[] {
    if (!this.event || this.signupsClosed) return [];
    const signups = (this.event.signedup ?? []).filter((signup) => !signup.guestOf);
    return this.players.filter(
      (player) =>
        player.gamesPlayed > 0 &&
        !signups.some((signup) =>
          signup.userId ? signup.userId === player._id : signup.name === player.name
        )
    );
  }

  public get notRespondedNames(): string {
    return this.notResponded.map((player) => player.name).join(", ");
  }

  /**
   * Players who will play, derived from the signups (waitlisted players excluded)
   */
  public get confirmedCount(): number {
    return this.event ? confirmedSignups(this.event).length : 0;
  }

  public get waitlistCount(): number {
    return this.event ? waitlistedSignups(this.event).length : 0;
  }

  public get isFull(): boolean {
    return isEventFull(this.event);
  }

  public get isPast(): boolean {
    return isEventPast(this.event);
  }

  public get signupsClosed(): boolean {
    return areSignupsClosed(this.event);
  }

  public get hasTime(): boolean {
    return hasTimeOfDay(this.event);
  }

  /**
   * 1-based position on the waitlist, or 0 when the signup is not waitlisted
   */
  public waitlistPosition(signup: Signup): number {
    return waitlistedSignups(this.event).indexOf(signup) + 1;
  }

  /**
   * "Pridem" puts the user on the waitlist when the event is full and they aren't playing yet
   */
  public get joinsWaitlist(): boolean {
    return this.isFull && !this.ownSignup?.attending;
  }

  public get ownSignup(): Signup | undefined {
    return this.event?.signedup?.find((signup) => this.isOwnSignup(signup));
  }

  public get noteChanged(): boolean {
    return this.noteDraft.trim() !== (this.ownSignup?.note ?? "");
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  public canAnswer(attending: boolean): boolean {
    if (this.signupsClosed || !this.isConnected()) return false;
    const own = this.ownSignup;
    return !own || !!own.attending !== attending;
  }

  /**
   * Signs up, or changes the answer when the user has already signed up
   */
  protected answer(attending: boolean): void {
    this.clearMessages();
    const own = this.ownSignup;
    const note = this.noteDraft.trim();
    if (own?._id) this.updateSignup(own._id, { attending, note });
    else this.createSignup({ name: this.getCurrentUserName(), attending, note });
  }

  /**
   * Adds a guest (a friend, or for admins anyone who answered elsewhere)
   */
  protected addGuest(): void {
    const name = this.guestName.trim();
    if (!name) return;
    this.clearMessages();
    this.demoDataService.addGuest(this.event._id, name).subscribe({
      next: (guest: Signup) => {
        this.setSignups([guest, ...(this.event.signedup ?? [])]);
        this.guestName = "";
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  protected saveNote(): void {
    const own = this.ownSignup;
    if (!own?._id) return;
    this.clearMessages();
    this.updateSignup(own._id, { note: this.noteDraft.trim() });
  }

  private createSignup(signup: Signup): void {
    this.demoDataService.signUpForEvent(this.event._id, signup).subscribe({
      next: (created: Signup) => {
        this.setSignups([created, ...(this.event.signedup ?? [])]);
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  private updateSignup(
    signupId: string,
    changes: { attending?: boolean; note?: string }
  ): void {
    this.demoDataService
      .updateSignup(this.event._id, signupId, changes)
      .subscribe({
        next: (updated: Signup) => {
          this.setSignups(
            (this.event.signedup ?? []).map((signup) =>
              signup._id === signupId ? updated : signup
            )
          );
          this.noteDraft = updated.note ?? "";
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  protected deleteSignup(signupId: string | undefined): void {
    if (!signupId) return;
    this.clearMessages();
    this.demoDataService
      .deleteSignUpFromEvent(this.event._id, signupId)
      .subscribe({
        next: () => {
          this.setSignups(
            (this.event.signedup ?? []).filter((signup) => signup._id !== signupId)
          );
          this.noteDraft = "";
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  protected deleteEvent(): void {
    if (!confirm(`Izbrišem dogodek "${this.event.name}"?`)) return;
    this.clearMessages();
    this.demoDataService.deleteEvent(this.event._id).subscribe({
      next: () => this.router.navigate(["/events"]),
      error: (err) => (this.errorMessage = err),
    });
  }

  protected openEditForm(form: TemplateRef<any>): void {
    this.formError = "";
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  protected closeEditForm(): void {
    this.formError = "";
    this.modalRef?.hide();
    this.modalRef = undefined;
  }

  protected saveEdit(edited: Event): void {
    const { name, description, date, maxPlayers } = edited;
    this.demoDataService
      .updateEvent(this.event._id, { name, description, date, maxPlayers })
      .subscribe({
        next: (updated) => {
          this.applyEventUpdate(updated);
          this.closeEditForm();
        },
        error: (err) => (this.formError = err),
      });
  }

  /**
   * Cancels the event (asking for an optional reason), or restores a cancelled one
   */
  protected toggleCancelled(): void {
    let changes: Partial<Event>;
    if (this.event.cancelled) {
      if (!confirm(`Obnovim dogodek "${this.event.name}"?`)) return;
      changes = { cancelled: false };
    } else {
      const reason = prompt("Razlog za odpoved (neobvezno):", "");
      if (reason === null) return;
      changes = { cancelled: true, cancelReason: reason.trim() };
    }
    this.clearMessages();
    this.demoDataService.updateEvent(this.event._id, changes).subscribe({
      next: (updated) => this.applyEventUpdate(updated),
      error: (err) => (this.errorMessage = err),
    });
  }

  protected applyEventUpdate(updated: Event): void {
    this.event = updated;
    this.eventChange.emit(updated);
  }

  /**
   * Downloads an .ics file that calendar apps (Google, Apple, Outlook) can import
   */
  protected addToCalendar(): void {
    const ics = eventToIcs(this.event, window.location.href);
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `nogomet-${formatDate(this.event.date, "yyyy-MM-dd", "sl")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Shares the event (when, how many signed up) with the group
   */
  protected share(): Promise<void> {
    return this.shareText(`${this.eventSummary()}\nPrijavi se:`);
  }

  /**
   * Shares a reminder naming the regulars who haven't answered yet
   */
  protected remind(): Promise<void> {
    return this.shareText(
      `${this.eventSummary()}\nŠe niste odgovorili: ${this.notRespondedNames}\nPrijavi se:`
    );
  }

  private eventSummary(): string {
    const when = formatDate(
      this.event.date,
      this.hasTime ? "EEEE, d. MMMM 'ob' HH:mm" : "EEEE, d. MMMM",
      "sl"
    );
    const players = this.event.maxPlayers
      ? `${this.confirmedCount}/${this.event.maxPlayers}`
      : `${this.confirmedCount}`;
    return `⚽ ${this.event.name}: ${when}\nPrijavljenih: ${players}`;
  }

  /**
   * Shares text plus the page link (share sheet, or clipboard as a fallback)
   */
  private async shareText(text: string): Promise<void> {
    this.clearMessages();
    const result = await this.shareService.share(
      this.event.name,
      text,
      window.location.href
    );
    if (result === "copied") this.infoMessage = "Povezava je kopirana v odložišče.";
    if (result === "failed") this.errorMessage = "Deljenje ni uspelo.";
  }

  /**
   * Users can remove their own signup and guests they added
   */
  public canDeleteSignUp(signup: Signup): boolean {
    if (!this.isLoggedIn() || this.signupsClosed) return false;
    const user = this.authenticationService.getCurrentUser();
    return this.isOwnSignup(signup) || (!!signup.guestOf && signup.guestOf === user?._id);
  }

  private clearMessages(): void {
    this.errorMessage = "";
    this.infoMessage = "";
  }

  /**
   * Replaces the event object (not just its signups), so child components such as
   * the teams card notice the change and drop stale previews
   */
  private setSignups(signups: Signup[]): void {
    this.event = { ...this.event, signedup: signups };
  }

  /**
   * The user's own signup (never a guest they added). Signups created before
   * userId was stored can only be matched by name.
   */
  private isOwnSignup(signup: Signup): boolean {
    const user: User | null = this.authenticationService.getCurrentUser();
    if (!user || signup.guestOf) return false;
    return signup.userId ? signup.userId === user._id : signup.name === user.name;
  }

  private getCurrentUserName(): string {
    return this.authenticationService.getCurrentUser()?.name ?? "Guest";
  }
}
