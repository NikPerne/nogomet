import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { SeasonOverview, SeasonPlayer, shiftSeason } from "../../classes/season";

/**
 * Season membership fee: who has paid this season (October – April). Admins tick payments.
 */
@Component({
    selector: "app-season",
    template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="alert alert-dark mt-4 p-2" [hidden]="!message">
          <i class="fa-solid fa-triangle-exclamation pe-2"></i>{{ message }}
        </div>
        @if (overview; as o) {
          <div class="d-flex align-items-center gap-2 mt-4">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              title="Prejšnja sezona"
              (click)="load(shiftSeason(o.season, -1))"
              >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <h4 class="mb-0">Sezona {{ o.season }}</h4>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              title="Naslednja sezona"
              (click)="load(shiftSeason(o.season, 1))"
              >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <small class="text-secondary ms-2"
              >{{ o.start | date : "d. M. yyyy" : undefined : "sl" }} –
              {{ o.end | date : "d. M. yyyy" : undefined : "sl" }}</small
              >
            </div>
            <div class="card mt-3">
              <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    Članarina: <b>{{ o.fee | currency : "EUR" : "symbol" : "1.0-2" : "sl" }}</b>
                    na sezono
                  </div>
                  <div>
                    Plačalo: <b>{{ o.paidCount }}/{{ o.players.length }}</b> ·
                    zbrano
                    <b>{{ o.collected | currency : "EUR" : "symbol" : "1.0-2" : "sl" }}</b>
                  </div>
                </div>
                <div class="progress mt-2" style="height: 6px">
                  <div
                    class="progress-bar bg-success"
                    [style.width.%]="o.players.length ? (o.paidCount / o.players.length) * 100 : 0"
                  ></div>
                </div>
                @if (ownStatus; as own) {
                  <div class="mt-3">
                    @if (own.paid) {
                      <span class="text-success"
                        ><i class="fa-solid fa-circle-check me-1"></i>Tvoja članarina je
                        plačana ({{ own.paidOn | date : "d. M. yyyy" : undefined : "sl" }}).</span
                        >
                      } @else {
                        <span class="text-danger"
                          ><i class="fa-solid fa-circle-exclamation me-1"></i>Tvoja članarina
                          še ni plačana ({{ o.fee | currency : "EUR" : "symbol" : "1.0-2" : "sl" }}).</span
                          >
                        }
                      </div>
                    }
                  </div>
                </div>
                <div class="card mt-3">
                  <div class="table-responsive">
                    <table class="table table-sm table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th class="ps-3">Igralec</th>
                          <th class="text-end" title="Odigrane tekme v tej sezoni">Tekme</th>
                          <th class="text-end pe-3">Članarina</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (player of o.players; track player) {
                          <tr
                            [ngClass]="{ 'table-success': isCurrentUser(player) }"
                            >
                            <td class="ps-3">
                              {{ player.name }}
                              @if (isCurrentUser(player)) {
                                <small class="text-secondary">(ti)</small>
                              }
                            </td>
                            <td class="text-end">{{ player.gamesPlayed }}</td>
                            <td class="text-end pe-3 text-nowrap">
                              @if (isAdmin()) {
                                <label class="show-pointer mb-0">
                                  <input
                                    type="checkbox"
                                    class="form-check-input me-1"
                                    [checked]="player.paid"
                                    [disabled]="saving.has(player._id) || !isConnected()"
                                    (change)="togglePaid(player, o.season)"
                                    />
                                  {{
                                  player.paid
                                  ? (player.paidOn | date : "d. M." : undefined : "sl")
                                  : "neplačano"
                                  }}
                                </label>
                              } @else {
                                @if (player.paid) {
                                  <span class="badge bg-success">Plačano</span>
                                }
                                @if (!player.paid) {
                                  <span class="badge bg-warning text-dark"
                                    >Neplačano</span
                                    >
                                  }
                                }
                              </td>
                            </tr>
                          }
                          @if (o.players.length === 0) {
                            <tr>
                              <td colspan="3" class="ps-3 text-secondary">
                                V tej sezoni še ni igralcev.
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p class="text-secondary small mt-2">
                    Sezona traja od 1. oktobra do 30. aprila. Na seznamu so vsi, ki so se v
                    sezoni vsaj enkrat prijavili s »Pridem«, in vsi, ki so že plačali.
                  </p>
                }
              </div>
            </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SeasonComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  protected header = { title: "Članarina", subtitle: "", sidebar: "" };
  protected overview?: SeasonOverview;
  protected message = "";
  /** IDs of players whose payment is being saved */
  protected saving = new Set<string>();

  ngOnInit(): void {
    this.load();
  }

  /**
   * Loads a season (default: current); messageAfterLoad is shown once loaded, e.g. an error
   */
  protected load(season?: string, messageAfterLoad = ""): void {
    this.message = "Loading season ...";
    this.demoDataService.getSeason(season).subscribe({
      next: (overview) => {
        this.overview = overview;
        this.message = messageAfterLoad;
      },
      error: (err) => (this.message = err),
    });
  }

  protected readonly shiftSeason = shiftSeason;

  protected get ownStatus(): SeasonPlayer | undefined {
    return this.overview?.players.find((player) => this.isCurrentUser(player));
  }

  protected togglePaid(player: SeasonPlayer, season: string): void {
    const paid = !player.paid;
    this.saving.add(player._id);
    this.message = "";
    this.demoDataService.setSeasonPayment(player._id, season, paid).subscribe({
      next: (result) => {
        player.paid = result.paid;
        player.paidOn = result.paidOn;
        this.recountTotals();
        this.saving.delete(player._id);
      },
      error: (err) => {
        this.saving.delete(player._id);
        // Reload so the checkbox shows the real state, then show what went wrong
        this.load(season, err);
      },
    });
  }

  private recountTotals(): void {
    if (!this.overview) return;
    this.overview.paidCount = this.overview.players.filter((p) => p.paid).length;
    this.overview.collected = this.overview.paidCount * this.overview.fee;
  }

  protected isCurrentUser(player: SeasonPlayer): boolean {
    return this.authenticationService.getCurrentUser()?._id === player._id;
  }

  public isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }
}
