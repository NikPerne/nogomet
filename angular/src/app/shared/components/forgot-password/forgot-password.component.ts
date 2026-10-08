import { Component } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { ConnectionService } from "../../services/connection.service";

const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

@Component({
  selector: "app-forgot-password",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div *ngIf="sent; else requestForm" class="alert alert-success p-2 mt-3">
          <i class="fa-solid fa-envelope-circle-check pe-2"></i>Če račun s tem e-naslovom
          obstaja, smo ti poslali povezavo za ponastavitev gesla. Povezava velja 1 uro.
          Preveri tudi mapo z neželeno pošto.
        </div>
        <ng-template #requestForm>
          <p>Vnesi e-naslov svojega računa in poslali ti bomo povezavo za novo geslo.</p>
          <form (ngSubmit)="submit()" autocomplete="on">
            <div *ngIf="formError" class="alert alert-dark p-2" role="alert">
              <i class="fas fa-exclamation-triangle pe-2"></i>{{ formError }}
            </div>
            <label for="email" class="form-label mb-1">E-mail address</label>
            <input
              type="email"
              class="form-control form-control-sm"
              id="email"
              name="email"
              placeholder="Enter e-mail address"
              [(ngModel)]="email"
            />
            <button
              type="submit"
              class="btn btn-sm btn-primary mt-3"
              [disabled]="sending || !isConnected()"
            >
              <i class="fa-regular fa-paper-plane pe-2"></i>Pošlji povezavo
            </button>
          </form>
        </ng-template>
        <p class="mt-3">
          <a routerLink="/login" class="link-primary">Nazaj na prijavo</a>
        </p>
      </div>
    </div>`,
  styles: [],
})
export class ForgotPasswordComponent {
  constructor(
    private demoDataService: DemoDataService,
    private connectionService: ConnectionService
  ) {}

  protected header = { title: "Pozabljeno geslo", subtitle: "", sidebar: "" };
  protected email = "";
  protected formError = "";
  protected sending = false;
  protected sent = false;

  protected isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  protected submit(): void {
    this.formError = "";
    const email = this.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      this.formError = "Please enter a valid e-mail address.";
      return;
    }
    this.sending = true;
    this.demoDataService.forgotPassword(email).subscribe({
      next: () => (this.sent = true),
      error: (err) => {
        this.formError = err;
        this.sending = false;
      },
    });
  }
}
