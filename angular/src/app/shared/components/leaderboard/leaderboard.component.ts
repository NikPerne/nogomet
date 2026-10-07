import { Component, OnInit } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { PlayerStats } from "../../classes/player-stats";

const MAX_PLAYERS = 1000;

@Component({
  selector: "app-leaderboard",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="alert alert-dark mt-4 p-2" [hidden]="!message">
          <i class="fa-solid fa-triangle-exclamation pe-2"></i>{{ message }}
        </div>
        <div class="card mt-4" *ngIf="players.length > 0">
          <div class="card-header bg-light">
            <h4 class="mt-1 mb-1">
              <i class="fa-solid fa-ranking-star pe-2"></i>Lestvica igralcev
            </h4>
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
                  <th class="text-end pe-3">Zadnjič</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let player of players; index as i"
                  [ngClass]="{ 'table-success': isCurrentUser(player) }"
                >
                  <td class="ps-3">
                    <i
                      *ngIf="i < 3 && player.gamesPlayed > 0; else rank"
                      class="fa-solid fa-medal"
                      [ngClass]="medalClass(i)"
                    ></i>
                    <ng-template #rank>{{ i + 1 }}</ng-template>
                  </td>
                  <td>
                    {{ player.name }}
                    <small *ngIf="isCurrentUser(player)" class="text-secondary">(ti)</small>
                  </td>
                  <td class="text-end fw-bold">{{ player.gamesPlayed }}</td>
                  <td class="text-end">
                    {{ player.attendanceRate | percent : "1.0-0" : "sl" }}
                  </td>
                  <td class="text-end">
                    <ng-container *ngIf="player.currentStreak > 0; else noStreak">
                      <i
                        *ngIf="player.currentStreak >= 3"
                        class="fa-solid fa-fire text-danger me-1"
                        title="Vroč niz!"
                      ></i
                      >{{ player.currentStreak }}
                    </ng-container>
                    <ng-template #noStreak>–</ng-template>
                  </td>
                  <td class="text-end pe-3 text-nowrap">
                    {{
                      player.lastPlayed
                        ? (player.lastPlayed | date : "d. M. yyyy" : undefined : "sl")
                        : "–"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p class="text-secondary small mt-2">
          Štejejo samo pretekli, neodpovedani dogodki, kjer si bil potrjen igralec
          (ne rezerva). Udeležba se računa od tvoje prve prijave naprej.
        </p>
      </div>
    </div>`,
  styles: [],
})
export class LeaderboardComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService
  ) {}

  protected header = { title: "Lestvica", subtitle: "", sidebar: "" };
  protected players: PlayerStats[] = [];
  protected message = "";

  ngOnInit(): void {
    this.message = "Loading statistics ...";
    this.demoDataService.getPlayerStats(MAX_PLAYERS).subscribe({
      next: (players) => {
        this.players = players;
        this.message = players.length > 0 ? "" : "No players yet!";
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
