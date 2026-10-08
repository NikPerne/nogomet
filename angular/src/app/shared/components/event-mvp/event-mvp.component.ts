import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy
} from "@angular/core";
import { DemoDataService, MvpStatus } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import {
  Event,
  MvpTallyEntry,
  confirmedSignups,
  isMvpVotingOpen,
  playerKey,
} from "../../classes/event";
import { Signup } from "../../classes/signup";

/**
 * "Igralec tekme" card: players of a match vote for the best player (secret ballot,
 * public tally). Shown from kick-off, for a week, and afterwards while there are votes.
 */
@Component({
    selector: "app-event-mvp",
    template: `@if (visible) {
  <div class="card mt-4">
    <div class="card-header bg-light">
      <h5 class="mt-1 mb-1">
        <i class="fa-solid fa-trophy text-warning pe-2"></i>Igralec tekme
      </h5>
    </div>
    <div class="card-body">
      @if (errorMessage) {
        <div class="alert alert-dark p-2 small">{{ errorMessage }}</div>
      }
      @if (tally.length > 0) {
        <ul class="list-unstyled mb-3">
          @for (entry of tally; track entry) {
            <li
              class="d-flex justify-content-between"
              [ngClass]="{ 'fw-bold': entry.votes === topVotes }"
              >
              <span class="text-break">
                @if (entry.votes === topVotes) {
                  <i class="fa-solid fa-crown text-warning me-1"></i
                    >
                    }{{ entry.name }}
                  </span>
                  <span class="text-nowrap ms-2">{{ entry.votes }} {{ votesLabel(entry.votes) }}</span>
                </li>
              }
            </ul>
          }
          @if (tally.length === 0) {
            <p class="text-secondary small">Še ni glasov.</p>
          }
          @if (status?.canVote) {
            <form
              class="d-flex flex-wrap gap-2 align-items-center"
              (ngSubmit)="vote()"
              >
              <select
                name="candidate"
                class="form-select form-select-sm w-auto"
                aria-label="Izberi igralca tekme"
                [(ngModel)]="selectedKey"
                >
                <option value="" disabled>Izberi igralca</option>
                @for (player of candidates; track player) {
                  <option [value]="key(player)">
                    {{ player.name }}{{ player.guestOf ? " (gost)" : "" }}
                  </option>
                }
              </select>
              <button
                type="submit"
                class="btn btn-sm btn-primary m-0"
                [disabled]="!selectedKey || selectedKey === status?.myVote || saving || !isConnected()"
                >
                {{ status?.myVote ? "Spremeni glas" : "Glasuj" }}
              </button>
              @if (myVoteName) {
                <small class="text-secondary">Tvoj glas: {{ myVoteName }}</small>
              }
            </form>
          }
          @if (status && !status.canVote && status.votingOpen) {
            <small class="text-secondary">
              Glasujejo lahko igralci te tekme (ne zase), do tedna po tekmi.
            </small>
          }
          @if (!votingOpen) {
            <small class="text-secondary">Glasovanje je zaključeno.</small>
          }
        </div>
      </div>
    }`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EventMvpComponent implements OnChanges {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  @Input() event!: Event;
  /** Emits the event with the updated tally after voting */
  @Output() eventChange = new EventEmitter<Event>();

  protected status?: MvpStatus;
  protected selectedKey = "";
  protected saving = false;
  protected errorMessage = "";
  protected readonly key = playerKey;
  private loadedFor?: string;

  ngOnChanges(changes: SimpleChanges): void {
    // The vote status only needs loading once per event (not on every signup change)
    if (changes["event"] && this.event && this.loadedFor !== this.event._id && this.visible) {
      this.loadedFor = this.event._id;
      this.demoDataService.getMvpStatus(this.event._id).subscribe({
        next: (status) => this.setStatus(status),
        error: () => (this.status = undefined),
      });
    }
  }

  protected get votingOpen(): boolean {
    return isMvpVotingOpen(this.event);
  }

  protected get tally(): MvpTallyEntry[] {
    return this.event?.mvpTally ?? [];
  }

  protected get topVotes(): number {
    return this.tally[0]?.votes ?? 0;
  }

  protected get visible(): boolean {
    return !!this.event && !this.event.cancelled && (this.votingOpen || this.tally.length > 0);
  }

  /**
   * Confirmed players of the match, except the current user (no voting for yourself)
   */
  protected get candidates(): Signup[] {
    const user = this.authenticationService.getCurrentUser();
    return confirmedSignups(this.event).filter(
      (signup) =>
        !user ||
        signup.guestOf ||
        (signup.userId ? signup.userId !== user._id : signup.name !== user.name)
    );
  }

  protected get myVoteName(): string {
    const myVote = this.status?.myVote;
    return myVote ? this.candidates.find((p) => playerKey(p) === myVote)?.name ?? "" : "";
  }

  protected votesLabel(votes: number): string {
    // Slovenian dual/plural forms
    if (votes % 100 === 1) return "glas";
    if (votes % 100 === 2) return "glasova";
    if (votes % 100 === 3 || votes % 100 === 4) return "glasovi";
    return "glasov";
  }

  protected isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  protected vote(): void {
    if (!this.selectedKey) return;
    this.saving = true;
    this.errorMessage = "";
    this.demoDataService.voteMvp(this.event._id, this.selectedKey).subscribe({
      next: ({ event, ...status }) => {
        this.setStatus(status);
        this.saving = false;
        this.eventChange.emit(event);
      },
      error: (err) => {
        this.errorMessage = err;
        this.saving = false;
      },
    });
  }

  private setStatus(status: MvpStatus): void {
    this.status = status;
    this.selectedKey = status.myVote ?? "";
  }
}
