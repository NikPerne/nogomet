import { Component, Input } from "@angular/core";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { DemoDataService } from "../../services/demo-data.service";
import {
  Event,
  confirmedSignups,
  hasTimeOfDay,
  isEventFull,
  isEventPast,
  waitlistedSignups,
} from "../../classes/event";
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
    private connectionService: ConnectionService,
    private router: Router
  ) {}

  @Input() event!: Event;

  protected errorMessage = "";
  protected infoMessage = "";
  protected teams: [string[], string[]] | null = null;

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
    if (this.isPast || !this.isConnected()) return false;
    const own = this.ownSignup;
    return !own || !!own.attending !== attending;
  }

  /**
   * Signs up, or changes the answer when the user has already signed up
   */
  protected answer(attending: boolean): void {
    this.errorMessage = "";
    const own = this.ownSignup;
    if (own?._id) this.updateSignup(own._id, attending);
    else this.createSignup(attending);
  }

  private createSignup(attending: boolean): void {
    const signup: Signup = { name: this.getCurrentUserName(), attending };
    this.demoDataService.signUpForEvent(this.event._id, signup).subscribe({
      next: (created: Signup) => {
        this.setSignups([created, ...(this.event.signedup ?? [])]);
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  private updateSignup(signupId: string, attending: boolean): void {
    this.demoDataService
      .updateSignup(this.event._id, signupId, attending)
      .subscribe({
        next: (updated: Signup) => {
          this.setSignups(
            (this.event.signedup ?? []).map((signup) =>
              signup._id === signupId ? updated : signup
            )
          );
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
          this.setSignups(
            (this.event.signedup ?? []).filter((signup) => signup._id !== signupId)
          );
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  protected deleteEvent(): void {
    if (!confirm(`Izbrišem dogodek "${this.event.name}"?`)) return;
    this.errorMessage = "";
    this.demoDataService.deleteEvent(this.event._id).subscribe({
      next: () => this.router.navigate(["/events"]),
      error: (err) => (this.errorMessage = err),
    });
  }

  /**
   * Shares the event via the device share sheet (e.g. WhatsApp), or copies it to the clipboard
   */
  protected async share(): Promise<void> {
    this.errorMessage = "";
    this.infoMessage = "";
    const when = formatDate(
      this.event.date,
      this.hasTime ? "EEEE, d. MMMM 'ob' HH:mm" : "EEEE, d. MMMM",
      "sl"
    );
    const players = this.event.maxPlayers
      ? `${this.confirmedCount}/${this.event.maxPlayers}`
      : `${this.confirmedCount}`;
    const text = `⚽ ${this.event.name}: ${when}\nPrijavljenih: ${players}\nPrijavi se:`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: this.event.name, text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        this.infoMessage = "Povezava je kopirana v odložišče.";
      }
    } catch (err) {
      // Closing the share sheet rejects with AbortError, which is not an error for the user
      if ((err as DOMException)?.name !== "AbortError")
        this.errorMessage = "Deljenje ni uspelo.";
    }
  }

  /**
   * Randomly splits confirmed players (not the waitlist) into two teams of (almost) equal size
   */
  protected generateTeams(): void {
    const players = confirmedSignups(this.event).map((signup) => signup.name);
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    const half = Math.ceil(players.length / 2);
    this.teams = [players.slice(0, half), players.slice(half)];
  }

  public canDeleteSignUp(signup: Signup): boolean {
    return this.isLoggedIn() && !this.isPast && this.isOwnSignup(signup);
  }

  /**
   * Teams are cleared whenever signups change, so they never list stale players
   */
  private setSignups(signups: Signup[]): void {
    this.event.signedup = signups;
    this.teams = null;
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
