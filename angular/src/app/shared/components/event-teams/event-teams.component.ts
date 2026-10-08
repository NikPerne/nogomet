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
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { ShareService } from "../../services/share.service";
import {
  Event,
  Score,
  TEAMS,
  TeamKey,
  TeamPlayer,
  Teams,
  confirmedSignups,
  hasTimeOfDay,
  playerKey,
} from "../../classes/event";
import { Signup } from "../../classes/signup";
import { PlayerStats } from "../../classes/player-stats";

/** Random jitter added to ratings, so "Premešaj" gives different but still balanced teams */
const RATING_JITTER = 0.1;

const toTeamPlayer = (signup: Signup): TeamPlayer => ({
  name: signup.name,
  ...(signup.userId ? { userId: signup.userId } : {}),
  ...(signup.guestOf ? { guest: true } : {}),
});

/**
 * Teams card on the event page: anyone can shuffle a preview of Rumeni / Rdeči,
 * admins save it so everyone sees the same line-up, and enter the final score.
 */
@Component({
    selector: "app-event-teams",
    templateUrl: "event-teams.component.html",
    styles: [
        `
      .team-dot {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.25);
      }
      .score {
        font-size: 1.6rem;
        font-weight: bold;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EventTeamsComponent implements OnChanges {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    private shareService: ShareService
  ) {}

  @Input() event!: Event;
  /** All-time player statistics, used to balance the teams */
  @Input() players: PlayerStats[] = [];
  /** Emits the event after teams or score are saved or removed */
  @Output() eventChange = new EventEmitter<Event>();

  protected readonly teamsMeta = TEAMS;
  /** Unsaved shuffle; shown instead of the saved teams until saved or discarded */
  protected preview: Teams | null = null;
  protected scoreDraft: Partial<Record<TeamKey, number | null>> = {};
  protected errorMessage = "";
  protected infoMessage = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["event"]) {
      // Signups or saved teams changed, so an old preview could list stale players
      this.preview = null;
      this.scoreDraft = { ...(this.event?.score ?? {}) };
    }
  }

  protected get confirmed(): Signup[] {
    return this.event ? confirmedSignups(this.event) : [];
  }

  protected get shown(): Teams | null {
    return this.preview ?? this.event?.teams ?? null;
  }

  protected get visible(): boolean {
    return this.confirmed.length >= 2 || !!this.event?.teams;
  }

  /**
   * Non-admins can only shuffle while nothing is saved, so they don't hide the official teams
   */
  protected get canShuffle(): boolean {
    return this.confirmed.length >= 2 && (this.isAdmin() || !this.event.teams);
  }

  /**
   * Saved teams no longer match the confirmed players (someone joined or dropped out)
   */
  protected get outdated(): boolean {
    const saved = this.event?.teams;
    if (!saved || this.preview) return false;
    const savedKeys = TEAMS.flatMap((team) => saved[team.key].map(playerKey)).sort();
    const confirmedKeys = this.confirmed.map((signup) => playerKey(toTeamPlayer(signup))).sort();
    return savedKeys.join("|") !== confirmedKeys.join("|");
  }

  protected isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  protected isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  /**
   * Player strength 0..1 from match results: (wins + ½·draws + 1) / (games + 2).
   * The +1/+2 pulls players with few results towards 0.5; guests and new players are 0.5.
   */
  protected rating(player: TeamPlayer): number {
    const stats = player.guest
      ? undefined
      : this.players.find((p) =>
          player.userId ? p._id === player.userId : p.name === player.name
        );
    if (!stats) return 0.5;
    const games = stats.wins + stats.draws + stats.losses;
    return (stats.wins + stats.draws / 2 + 1) / (games + 2);
  }

  /**
   * Whether anyone in the match has results, i.e. balancing makes a difference
   */
  protected get hasRatings(): boolean {
    return this.confirmed.some((signup) => this.rating(toTeamPlayer(signup)) !== 0.5);
  }

  /**
   * Average rating of a team as a percentage, e.g. 54
   */
  protected strength(players: TeamPlayer[]): number {
    if (players.length === 0) return 0;
    const total = players.reduce((sum, player) => sum + this.rating(player), 0);
    return Math.round((total / players.length) * 100);
  }

  /**
   * Splits confirmed players (not the waitlist) into two teams of (almost) equal size and
   * strength: strongest first, each player joins the currently weaker team that has room.
   * Small random jitter keeps reshuffles varied; without results it's a random split.
   */
  protected shuffle(): void {
    this.clearMessages();
    const rated = this.confirmed
      .map(toTeamPlayer)
      .map((player) => ({
        player,
        rating: this.rating(player) + (Math.random() - 0.5) * RATING_JITTER,
      }))
      .sort((a, b) => b.rating - a.rating);
    const size = Math.ceil(rated.length / 2);
    const teams: Teams = { rumeni: [], rdeci: [] };
    const sums: Record<TeamKey, number> = { rumeni: 0, rdeci: 0 };
    for (const { player, rating } of rated) {
      const weaker: TeamKey = sums.rumeni <= sums.rdeci ? "rumeni" : "rdeci";
      const other: TeamKey = weaker === "rumeni" ? "rdeci" : "rumeni";
      const team = teams[weaker].length < size ? weaker : other;
      teams[team].push(player);
      sums[team] += rating;
    }
    this.preview = teams;
  }

  protected discardPreview(): void {
    this.preview = null;
  }

  protected save(): void {
    if (!this.preview) return;
    this.clearMessages();
    this.demoDataService.saveTeams(this.event._id, this.preview).subscribe({
      next: (updated) => this.eventChange.emit(updated),
      error: (err) => (this.errorMessage = err),
    });
  }

  protected clearSaved(): void {
    if (!confirm("Odstranim shranjene ekipe in rezultat?")) return;
    this.clearMessages();
    this.demoDataService.clearTeams(this.event._id).subscribe({
      next: (updated) => this.eventChange.emit(updated),
      error: (err) => (this.errorMessage = err),
    });
  }

  protected saveScore(): void {
    this.clearMessages();
    const { rumeni, rdeci } = this.scoreDraft;
    const valid = (goals: unknown): goals is number =>
      typeof goals === "number" && Number.isInteger(goals) && goals >= 0 && goals <= 99;
    if (!valid(rumeni) || !valid(rdeci)) {
      this.errorMessage = "Vnesi oba rezultata (cela števila od 0 do 99).";
      return;
    }
    const score: Score = { rumeni, rdeci };
    this.demoDataService.saveScore(this.event._id, score).subscribe({
      next: (updated) => this.eventChange.emit(updated),
      error: (err) => (this.errorMessage = err),
    });
  }

  protected clearScore(): void {
    this.clearMessages();
    this.demoDataService.clearScore(this.event._id).subscribe({
      next: (updated) => this.eventChange.emit(updated),
      error: (err) => (this.errorMessage = err),
    });
  }

  /**
   * Shares the shown line-up (and the score, if any) with the group
   */
  protected async share(): Promise<void> {
    const teams = this.shown;
    if (!teams) return;
    this.clearMessages();
    const when = formatDate(
      this.event.date,
      hasTimeOfDay(this.event) ? "EEEE, d. MMMM 'ob' HH:mm" : "EEEE, d. MMMM",
      "sl"
    );
    const lines = TEAMS.map(
      (team) =>
        `${team.emoji} ${team.label}: ${teams[team.key].map((p) => p.name).join(", ")}`
    );
    const score = this.event.score && !this.preview ? this.event.score : null;
    if (score) lines.push(`Rezultat: Rumeni ${score.rumeni} : ${score.rdeci} Rdeči`);
    const text = `⚽ Ekipe – ${when}\n${lines.join("\n")}\n`;
    const result = await this.shareService.share(this.event.name, text, window.location.href);
    if (result === "copied") this.infoMessage = "Ekipe so kopirane v odložišče.";
    if (result === "failed") this.errorMessage = "Deljenje ni uspelo.";
  }

  private clearMessages(): void {
    this.errorMessage = "";
    this.infoMessage = "";
  }
}
