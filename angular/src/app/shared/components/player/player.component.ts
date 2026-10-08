import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { PlayerHistory, PlayerMatch } from "../../classes/player-stats";
import { TEAMS } from "../../classes/event";

/**
 * Player page (/igralec/:userId): statistics and match history of one player
 */
@Component({
  selector: "app-player",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-8">
        @if (message) {
          <div class="alert alert-dark mt-4 p-2">
            <i class="fa-solid fa-triangle-exclamation pe-2"></i>{{ message }}
          </div>
        }
        @if (history; as h) {
          <div class="row g-2 text-center mt-3">
            @for (tile of tiles; track tile.label) {
              <div class="col-6 col-sm-4 col-md-2">
                <div class="border rounded-3 p-2 h-100">
                  <div class="fs-5 fw-bold">{{ tile.value }}</div>
                  <small class="text-secondary">{{ tile.label }}</small>
                </div>
              </div>
            }
          </div>

          <div class="card mt-4">
            <div class="card-header bg-body-tertiary">
              <h5 class="mt-1 mb-1"><i class="fa-solid fa-clock-rotate-left pe-2"></i>Tekme</h5>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover align-middle mb-0">
                <tbody>
                  @for (match of h.matches; track match._id) {
                    <tr>
                      <td class="ps-3 text-nowrap">
                        <a [routerLink]="['/events', match._id]" class="link-primary text-decoration-none">
                          {{ match.date | date: "d. M. yyyy" : undefined : "sl" }}
                        </a>
                      </td>
                      <td>
                        @switch (match.status) {
                          @case ("played") {
                            @if (match.team) {
                              <span
                                class="team-dot me-1"
                                [style.background]="teamColor(match.team)"
                                [title]="teamLabel(match.team)"
                              ></span>
                            }
                            Igral
                          }
                          @case ("waitlisted") {
                            <span class="text-secondary">Rezerva</span>
                          }
                          @case ("declined") {
                            <span class="text-secondary">Ni prišel</span>
                          }
                        }
                      </td>
                      <td class="text-nowrap">
                        @if (match.result) {
                          <span class="badge" [ngClass]="resultClass(match.result)">{{
                            resultLabel(match.result)
                          }}</span>
                          <small class="ms-1">{{ scoreText(match) }}</small>
                        }
                      </td>
                      <td class="pe-3 text-end">
                        @if (match.mvp) {
                          <i class="fa-solid fa-trophy text-warning" title="Igralec tekme"></i>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td class="ps-3 text-secondary">Še ni odigranih tekem.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>`,
  styles: [
    `
      .team-dot {
        display: inline-block;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.25);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlayerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService
  ) {}

  protected header = { title: "Igralec", subtitle: "", sidebar: "" };
  protected history?: PlayerHistory;
  protected message = "";

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.message = "Loading player ...";
          this.history = undefined;
          return this.demoDataService.getPlayerHistory(params.get("userId") ?? "");
        })
      )
      .subscribe({
        next: (history) => {
          this.history = history;
          this.message = "";
          const own = this.authenticationService.getCurrentUser()?._id === history.player._id;
          this.header = { title: history.player.name, subtitle: own ? "(ti)" : "", sidebar: "" };
        },
        error: (err) => (this.message = err),
      });
  }

  protected get tiles(): { label: string; value: string | number }[] {
    const p = this.history?.player;
    if (!p) return [];
    return [
      { label: "Tekme", value: p.gamesPlayed },
      { label: "Udeležba", value: `${Math.round(p.attendanceRate * 100)} %` },
      { label: "Niz", value: p.currentStreak },
      { label: "Z-N-P", value: `${p.wins}-${p.draws}-${p.losses}` },
      { label: "Igralec tekme", value: p.mvpAwards },
      {
        label: "Zadnjič",
        value: p.lastPlayed ? new Date(p.lastPlayed).toLocaleDateString("sl-SI") : "–",
      },
    ];
  }

  protected teamColor(key: string): string {
    return TEAMS.find((team) => team.key === key)?.color ?? "transparent";
  }

  protected teamLabel(key: string): string {
    return TEAMS.find((team) => team.key === key)?.label ?? "";
  }

  protected resultLabel(result: string): string {
    return { win: "Zmaga", draw: "Neodločeno", loss: "Poraz" }[result] ?? "";
  }

  protected resultClass(result: string): string {
    return { win: "bg-success", draw: "bg-secondary", loss: "bg-danger" }[result] ?? "";
  }

  /**
   * Score from the player's point of view, e.g. "3 : 1" for their team's 3 goals
   */
  protected scoreText(match: PlayerMatch): string {
    if (!match.score || !match.team) return "";
    const own = match.score[match.team];
    const other = match.score[match.team === "rumeni" ? "rdeci" : "rumeni"];
    return `${own} : ${other}`;
  }
}
