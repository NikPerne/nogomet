import { Component, OnInit, ChangeDetectionStrategy, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DemoDataService } from "../../services/demo-data.service";
import { PushService } from "../../services/push.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { PlayerStats } from "../../classes/player-stats";
import { SeasonOverview, SeasonPlayer } from "../../classes/season";
import { User } from "../../classes/user";
import { Account } from "../../classes/account";

/** Same minimum as the register form and the API */
const MIN_PASSWORD_LENGTH = 3;
const MAX_PLAYERS_LOADED = 1000;

@Component({
    selector: "app-profile",
    template: `<app-header [content]="header"></app-header>
    @if (user) {
      <div class="row">
        <div class="col-12 col-lg-6">
          <div class="card mt-4">
            <div class="card-header bg-body-tertiary">
              <h4 class="mt-1 mb-1"><i class="fa-regular fa-user pe-2"></i>{{ user.name }}</h4>
            </div>
            <div class="card-body">
              <p class="text-secondary mb-3">
                {{ user.email }}
                @if (user.admin) {
                  <span class="badge bg-primary ms-2">admin</span>
                }
              </p>
              @if (stats) {
                <div class="row g-2 text-center">
                  @for (tile of statTiles; track tile) {
                    <div class="col-6 col-sm-4">
                      <div class="border rounded-3 p-2 h-100">
                        <div class="fs-4 fw-bold">{{ tile.value }}</div>
                        <small class="text-secondary">{{ tile.label }}</small>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-secondary">Statistika še ni na voljo.</p>
              }
              @if (season) {
                <p class="mt-3 mb-0">
                  Članarina {{ season.season }}:
                  @if (ownSeason?.paid) {
                    <span class="badge bg-success">Plačano</span>
                  }
                  @if (!ownSeason?.paid) {
                    <span class="badge bg-warning text-dark"
                      >Neplačano ({{ season.fee | currency : "EUR" : "symbol" : "1.0-2" : "sl" }})</span
                      >
                    }
                    <a routerLink="/clanarina" class="link-primary ms-2 small">Podrobnosti</a>
                  </p>
                }
                @if (account) {
                  <div class="form-check form-switch mt-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="emailNotifications"
                      [checked]="account.emailNotifications"
                      [disabled]="savingSettings || !isConnected()"
                      (change)="toggleNotifications()"
                      />
                    <label class="form-check-label" for="emailNotifications">
                      E-poštna obvestila (opomnik, če še nisi odgovoril/a, in odpovedi tekem)
                    </label>
                  </div>
                }
                @if (pushSupported) {
                  <div class="form-check form-switch mt-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="pushNotifications"
                      [checked]="pushEnabled"
                      [disabled]="savingPush || !isConnected() || pushPermission === 'denied'"
                      (change)="togglePush()"
                    />
                    <label class="form-check-label" for="pushNotifications">
                      <i class="fa-solid fa-mobile-screen me-1"></i>Obvestila na tej napravi
                      (ista obvestila kot po e-pošti)
                    </label>
                  </div>
                  @if (pushPermission === "denied") {
                    <small class="text-secondary d-block">
                      Obvestila so v brskalniku blokirana. Dovoli jih v nastavitvah brskalnika za to stran.
                    </small>
                  }
                } @else {
                  <small class="text-secondary d-block mt-2">
                    <i class="fa-solid fa-mobile-screen me-1"></i>Obvestila na napravi tukaj niso na voljo.
                    Na iPhonu najprej v Safariju izberi »Deli → Dodaj na začetni zaslon« in odpri aplikacijo od tam.
                  </small>
                }
                @if (settingsError) {
                  <div class="alert alert-dark p-2 mt-2 small">
                    {{ settingsError }}
                  </div>
                }
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="card mt-4">
              <div class="card-header bg-body-tertiary">
                <h5 class="mt-1 mb-1"><i class="fa-solid fa-key pe-2"></i>Spremeni geslo</h5>
              </div>
              <div class="card-body">
                <form (ngSubmit)="changePassword()" autocomplete="off">
                  @if (passwordError) {
                    <div class="alert alert-dark p-2">
                      <i class="fas fa-exclamation-triangle pe-2"></i>{{ passwordError }}
                    </div>
                  }
                  @if (passwordChanged) {
                    <div class="alert alert-success p-2">
                      <i class="fa-solid fa-check pe-2"></i>Geslo je spremenjeno.
                    </div>
                  }
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
        </div>
      }`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfileComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    private pushService: PushService,
    private destroyRef: DestroyRef
  ) {}

  protected readonly pushSupported = this.pushService.supported;
  protected pushEnabled = false;
  protected savingPush = false;

  protected get pushPermission(): NotificationPermission | null {
    return this.pushService.permission;
  }

  protected async togglePush(): Promise<void> {
    this.savingPush = true;
    this.settingsError = "";
    try {
      if (this.pushEnabled) await this.pushService.disable();
      else await this.pushService.enable();
    } catch (err) {
      this.settingsError =
        typeof err === "string" && /not configured/i.test(err)
          ? "Obvestila na napravi na strežniku še niso nastavljena."
          : this.pushPermission === "denied"
            ? "Obvestila so v brskalniku blokirana."
            : "Obvestil ni bilo mogoče vklopiti.";
    } finally {
      this.savingPush = false;
    }
  }

  protected header = { title: "Moj profil", subtitle: "", sidebar: "" };
  protected user: User | null = null;
  protected stats?: PlayerStats;
  protected season?: SeasonOverview;
  protected account?: Account;
  protected savingSettings = false;
  protected settingsError = "";
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
    this.demoDataService.getAccount().subscribe({
      next: (account) => (this.account = account),
      error: (err) => (this.settingsError = err),
    });
    if (this.pushSupported)
      this.pushService.subscription
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((subscription) => (this.pushEnabled = !!subscription));
  }

  protected toggleNotifications(): void {
    if (!this.account) return;
    this.savingSettings = true;
    this.settingsError = "";
    this.demoDataService.updateSettings(!this.account.emailNotifications).subscribe({
      next: (account) => {
        this.account = account;
        this.savingSettings = false;
      },
      error: (err) => {
        // Re-render the switch with the saved value
        this.account = { ...this.account! };
        this.settingsError = err;
        this.savingSettings = false;
      },
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
      { label: "Igralec tekme", value: s.mvpAwards },
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
