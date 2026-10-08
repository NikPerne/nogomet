import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { PlayerStats } from "../../classes/player-stats";
import { seasonLabelFor, shiftSeason } from "../../classes/season";

const MAX_PLAYERS = 1000;
const SEASONS_LISTED = 5;

@Component({
    selector: "app-leaderboard",
    template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="alert alert-dark mt-4 p-2" [hidden]="!message">
          <i class="fa-solid fa-triangle-exclamation pe-2"></i>{{ message }}
        </div>
        @if (loaded) {
          <div class="card mt-4">
            <div
              class="card-header bg-light d-flex justify-content-between align-items-center flex-wrap gap-2"
              >
              <h4 class="mt-1 mb-1">
                <i class="fa-solid fa-ranking-star pe-2"></i>Lestvica igralcev
              </h4>
              <select
                class="form-select form-select-sm w-auto"
                aria-label="Sezona"
                [ngModel]="season"
                (ngModelChange)="load($event)"
                >
                <option value="">Vse sezone</option>
                @for (option of seasonOptions; track option) {
                  <option [value]="option">
                    Sezona {{ option }}
                  </option>
                }
              </select>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th class="ps-3">#</th>
                    <th>Igralec</th>
                    <th class="text-end" title="Odigrane tekme (potrjen igralec, ne rezerva)">
                      Tekme
                    </th>
                    <th class="text-end" title="Delež tekem od prve prijave naprej">
                      Udeležba
                    </th>
                    <th class="text-end" title="Zaporedne zadnje tekme">Niz</th>
                    <th class="text-end text-nowrap" title="Zmage - neodločeno - porazi (tekme z vpisanim rezultatom)">
                      Z-N-P
                    </th>
                    <th class="text-end" title="Igralec tekme (največ glasov)">
                      <i class="fa-solid fa-trophy text-warning"></i>
                    </th>
                    <th class="text-end pe-3">Zadnjič</th>
                  </tr>
                </thead>
                <tbody>
                  @for (player of players; track player; let i = $index) {
                    <tr
                      [ngClass]="{ 'table-success': isCurrentUser(player) }"
                      >
                      <td class="ps-3">
                        @if (i < 3 && player.gamesPlayed > 0) {
                          <i
                            class="fa-solid fa-medal"
                            [ngClass]="medalClass(i)"
                          ></i>
                        } @else {
                          {{ i + 1 }}
                        }
                      </td>
                      <td>
                        {{ player.name }}
                        @if (isCurrentUser(player)) {
                          <small class="text-secondary">(ti)</small>
                        }
                      </td>
                      <td class="text-end fw-bold">{{ player.gamesPlayed }}</td>
                      <td class="text-end">
                        {{ player.attendanceRate | percent : "1.0-0" : "sl" }}
                      </td>
                      <td class="text-end">
                        @if (player.currentStreak > 0) {
                          @if (player.currentStreak >= 3) {
                            <i
                              class="fa-solid fa-fire text-danger me-1"
                              title="Vroč niz!"
                              ></i
                              >
                              }{{ player.currentStreak }}
                            } @else {
                              –
                            }
                          </td>
                          <td class="text-end text-nowrap">
                            {{
                            player.wins + player.draws + player.losses > 0
                            ? player.wins + "-" + player.draws + "-" + player.losses
                            : "–"
                            }}
                          </td>
                          <td class="text-end">{{ player.mvpAwards || "–" }}</td>
                          <td class="text-end pe-3 text-nowrap">
                            {{
                            player.lastPlayed
                            ? (player.lastPlayed | date : "d. M. yyyy" : undefined : "sl")
                            : "–"
                            }}
                          </td>
                        </tr>
                      }
                      @if (players.length === 0) {
                        <tr>
                          <td colspan="9" class="ps-3 text-secondary">
                            {{ season ? "V tej sezoni še ni odigranih tekem." : "Še ni igralcev." }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
            <p class="text-secondary small mt-2">
              Štejejo samo pretekli, neodpovedani dogodki, kjer si bil potrjen igralec
              (ne rezerva). Udeležba se računa od tvoje prve prijave naprej. Z-N-P
              (zmage, neodločeno, porazi) šteje tekme s shranjenimi ekipami in rezultatom,
              <i class="fa-solid fa-trophy text-warning"></i> pa tekme, kjer si dobil največ
              glasov za igralca tekme. Sezona traja od oktobra do aprila.
            </p>
          </div>
        </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaderboardComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService
  ) {}

  protected header = { title: "Lestvica", subtitle: "", sidebar: "" };
  protected players: PlayerStats[] = [];
  protected message = "";
  protected loaded = false;
  /** Selected season label, or "" for all-time */
  protected season = "";
  /** The current (or upcoming) season and the previous ones */
  protected readonly seasonOptions = Array.from({ length: SEASONS_LISTED }, (_, i) =>
    shiftSeason(seasonLabelFor(), -i)
  );

  ngOnInit(): void {
    this.load("");
  }

  protected load(season: string): void {
    this.season = season;
    this.message = "Loading statistics ...";
    this.demoDataService.getPlayerStats(MAX_PLAYERS, season || undefined).subscribe({
      next: (players) => {
        // A season view lists only players who played in it
        this.players = season ? players.filter((p) => p.gamesPlayed > 0) : players;
        this.message = "";
        this.loaded = true;
      },
      error: (err) => (this.message = err),
    });
  }

  protected isCurrentUser(player: PlayerStats): boolean {
    return this.authenticationService.getCurrentUser()?._id === player._id;
  }

  protected medalClass(index: number): string {
    return ["text-warning", "text-secondary", "text-danger-emphasis"][index];
  }
}
