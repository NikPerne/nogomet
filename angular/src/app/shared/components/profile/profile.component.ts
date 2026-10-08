import { Component, OnInit } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { PlayerStats } from "../../classes/player-stats";
import { SeasonOverview, SeasonPlayer } from "../../classes/season";
import { User } from "../../classes/user";

/** Same minimum as the register form and the API */
const MIN_PASSWORD_LENGTH = 3;
const MAX_PLAYERS_LOADED = 1000;

@Component({
  selector: "app-profile",
  template: `<app-header [content]="header"></app-header>
    <div class="row" *ngIf="user">
      <div class="col-12 col-lg-6">
        <div class="card mt-4">
          <div class="card-header bg-light">
            <h4 class="mt-1 mb-1"><i class="fa-regular fa-user pe-2"></i>{{ user.name }}</h4>
          </div>
          <div class="card-body">
            <p class="text-secondary mb-3">
              {{ user.email }}
              <span *ngIf="user.admin" class="badge bg-primary ms-2">admin</span>
            </p>
            <div *ngIf="stats; else noStats" class="row g-2 text-center">
              <div class="col-6 col-sm-3" *ngFor="let tile of statTiles">
                <div class="border rounded-3 p-2 h-100">
                  <div class="fs-4 fw-bold">{{ tile.value }}</div>
                  <small class="text-secondary">{{ tile.label }}</small>
                </div>
              </div>
            </div>
            <ng-template #noStats>
              <p class="text-secondary">Statistika še ni na voljo.</p>
            </ng-template>
            <p *ngIf="season" class="mt-3 mb-0">
              Članarina {{ season.season }}:
              <span *ngIf="ownSeason?.paid" class="badge bg-success">Plačano</span>
              <span *ngIf="!ownSeason?.paid" class="badge bg-warning text-dark"
                >Neplačano ({{ season.fee | currency : "EUR" : "symbol" : "1.0-2" : "sl" }})</span
              >
              <a routerLink="/clanarina" class="link-primary ms-2 small">Podrobnosti</a>
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card mt-4">
          <div class="card-header bg-light">
            <h5 class="mt-1 mb-1"><i class="fa-solid fa-key pe-2"></i>Spremeni geslo</h5>
          </div>
          <div class="card-body">
            <form (ngSubmit)="changePassword()" autocomplete="off">
              <div *ngIf="passwordError" class="alert alert-dark p-2">
                <i class="fas fa-exclamation-triangle pe-2"></i>{{ passwordError }}
              </div>
              <div *ngIf="passwordChanged" class="alert alert-success p-2">
                <i class="fa-solid fa-check pe-2"></i>Geslo je spremenjeno.
              </div>
              <label for="current" class="form-label mb-1">Trenutno geslo</label>
              <input
                type="password"
                id="current"
                name="current"
                class="form-control form-control-sm"
                autocomplete="current-password"
                [(ngModel)]="currentPassword"
              />
              <label for="new" class="form-label mb-1 mt-2">Novo geslo</label>
              <input
                type="password"
                id="new"
                name="new"
                class="form-control form-control-sm"
                autocomplete="new-password"
                [(ngModel)]="newPassword"
              />
              <label for="repeat" class="form-label mb-1 mt-2">Ponovi novo geslo</label>
              <input
                type="password"
                id="repeat"
                name="repeat"
                class="form-control form-control-sm"
                autocomplete="new-password"
                [(ngModel)]="repeatPassword"
              />
              <button
                type="submit"
                class="btn btn-sm btn-primary mt-3"
                [disabled]="saving || !isConnected()"
              >
                <i class="fa-regular fa-circle-check pe-2"></i>Shrani geslo
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>`,
  styles: [],
})
export class ProfileComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  protected header = { title: "Moj profil", subtitle: "", sidebar: "" };
  protected user: User | null = null;
  protected stats?: PlayerStats;
  protected season?: SeasonOverview;
  protected currentPassword = "";
  protected newPassword = "";
  protected repeatPassword = "";
  protected passwordError = "";
  protected passwordChanged = false;
  protected saving = false;

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    this.demoDataService.getPlayerStats(MAX_PLAYERS_LOADED).subscribe({
      next: (players) => (this.stats = players.find((p) => p._id === this.user?._id)),
      error: () => (this.stats = undefined),
    });
    this.demoDataService.getSeason().subscribe({
      next: (season) => (this.season = season),
      error: () => (this.season = undefined),
    });
  }

  protected get ownSeason(): SeasonPlayer | undefined {
    return this.season?.players.find((p) => p._id === this.user?._id);
  }

  protected get statTiles(): { label: string; value: string | number }[] {
    const s = this.stats;
    if (!s) return [];
    return [
      { label: "Tekme", value: s.gamesPlayed },
      { label: "Udeležba", value: `${Math.round(s.attendanceRate * 100)} %` },
      { label: "Niz", value: s.currentStreak },
      { label: "Z-N-P", value: `${s.wins}-${s.draws}-${s.losses}` },
    ];
  }

  protected isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  protected changePassword(): void {
    this.passwordError = "";
    this.passwordChanged = false;
    if (!this.currentPassword || !this.newPassword) {
      this.passwordError = "Izpolni vsa polja.";
      return;
    }
    if (this.newPassword.length < MIN_PASSWORD_LENGTH) {
      this.passwordError = `Novo geslo mora imeti vsaj ${MIN_PASSWORD_LENGTH} znake.`;
      return;
    }
    if (this.newPassword !== this.repeatPassword) {
      this.passwordError = "Gesli se ne ujemata.";
      return;
    }
    this.saving = true;
    this.demoDataService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordChanged = true;
        this.currentPassword = this.newPassword = this.repeatPassword = "";
        this.saving = false;
      },
      error: (err) => {
        this.passwordError = err;
        this.saving = false;
      },
    });
  }
}
