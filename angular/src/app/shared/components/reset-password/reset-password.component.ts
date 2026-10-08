import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";

/** Same minimum as the register form and the API */
const MIN_PASSWORD_LENGTH = 3;

/**
 * Opened from the reset email link: /ponastavi-geslo?token=...
 */
@Component({
  selector: "app-reset-password",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div *ngIf="!token" class="alert alert-dark p-2 mt-3">
          <i class="fa-solid fa-triangle-exclamation pe-2"></i>Povezava ni veljavna.
          <a routerLink="/pozabljeno-geslo" class="link-primary">Zahtevaj novo povezavo.</a>
        </div>
        <form *ngIf="token" (ngSubmit)="submit()" autocomplete="off">
          <div *ngIf="formError" class="alert alert-dark p-2" role="alert">
            <i class="fas fa-exclamation-triangle pe-2"></i>{{ formError }}
            <div *ngIf="expired">
              <a routerLink="/pozabljeno-geslo" class="link-primary">Zahtevaj novo povezavo.</a>
            </div>
          </div>
          <label for="password" class="form-label mb-1">Novo geslo</label>
          <input
            type="password"
            class="form-control form-control-sm"
            id="password"
            name="password"
            autocomplete="new-password"
            [(ngModel)]="password"
          />
          <label for="repeat" class="form-label mb-1 mt-3">Ponovi novo geslo</label>
          <input
            type="password"
            class="form-control form-control-sm"
            id="repeat"
            name="repeat"
            autocomplete="new-password"
            [(ngModel)]="repeat"
          />
          <button
            type="submit"
            class="btn btn-sm btn-primary mt-3"
            [disabled]="saving || !isConnected()"
          >
            <i class="fa-regular fa-circle-check pe-2"></i>Shrani novo geslo
          </button>
        </form>
      </div>
    </div>`,
  styles: [],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  protected header = { title: "Novo geslo", subtitle: "", sidebar: "" };
  protected token = "";
  protected password = "";
  protected repeat = "";
  protected formError = "";
  protected expired = false;
  protected saving = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token") ?? "";
  }

  protected isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  protected submit(): void {
    this.formError = "";
    this.expired = false;
    if (this.password.length < MIN_PASSWORD_LENGTH) {
      this.formError = `Geslo mora imeti vsaj ${MIN_PASSWORD_LENGTH} znake.`;
      return;
    }
    if (this.password !== this.repeat) {
      this.formError = "Gesli se ne ujemata.";
      return;
    }
    this.saving = true;
    this.authenticationService.resetPassword(this.token, this.password).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: (err) => {
        this.formError = err;
        this.expired = /invalid|expired/i.test(String(err));
        this.saving = false;
      },
    });
  }
}
