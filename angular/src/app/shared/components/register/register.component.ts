import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../../classes/user";
import { AuthenticationService } from "../../services/authentication.service";
import { HistoryService } from "../../services/history.service";
import { ConnectionService } from "../../services/connection.service";
import { DemoDataService } from "../../services/demo-data.service";

@Component({
  selector: "app-register",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-md-8">
        <p>
          Already a member? Please
          <a routerLink="/login" class="link-primary">login</a> instead.
        </p>
        <form (ngSubmit)="onRegisterSubmit()" autocomplete="off">
          @if (formError) {
            <div class="form-group">
              <div class="alert alert-dark p-2 mt-4" role="alert">
                <i class="fas fa-exclamation-triangle pe-2"></i>{{ formError }}
              </div>
            </div>
          }
          <div class="form-group">
            <label for="name" class="form-label mb-1">Full name</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="name"
              name="name"
              placeholder="Enter your name"
              [(ngModel)]="credentials.name"
            />
          </div>
          <div class="form-group">
            <label for="email" class="form-label mb-1 mt-3">E-mail address</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="email"
              name="email"
              placeholder="Enter e-mail address"
              [(ngModel)]="credentials.email"
            />
          </div>
          <div class="form-group">
            <label for="password" class="form-label mb-1 mt-3">Password</label>
            <input
              type="password"
              class="form-control form-control-sm"
              id="password"
              name="password"
              placeholder="Enter password"
              [(ngModel)]="credentials.password"
            />
          </div>
          @if (inviteCodeRequired) {
            <div class="form-group">
              <label for="inviteCode" class="form-label mb-1 mt-3">Koda za povabilo</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="inviteCode"
                name="inviteCode"
                autocapitalize="none"
                placeholder="Kodo dobiš od organizatorja (npr. v skupinskem klepetu)"
                [(ngModel)]="inviteCode"
              />
            </div>
          }
          <div class="form-group mt-3">
            <button [disabled]="!isConnected()" type="submit" class="btn btn-sm btn-primary me-2">
              <i class="fa-regular fa-circle-check pe-2"></i>Register
            </button>
          </div>
        </form>
      </div>
    </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService,
    private connectionService: ConnectionService,
    private demoDataService: DemoDataService
  ) {}

  protected formError!: string;
  protected credentials: User = {
    name: "",
    email: "",
    password: "",
    admin: false,
  };
  /** Whether the server requires an invite code to register */
  protected inviteCodeRequired = false;
  protected inviteCode = "";
  public header = {
    title: "Create a new account",
    subtitle: "",
    sidebar: "",
  };

  ngOnInit(): void {
    this.demoDataService.getRegistrationInfo().subscribe({
      next: (info) => (this.inviteCodeRequired = info.inviteCodeRequired),
      // If unknown, the server still enforces the code and reports a clear error
      error: () => (this.inviteCodeRequired = true),
    });
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  public onRegisterSubmit() {
    this.formError = "";
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    )
      this.formError = "All fields are required, please try again.";
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(
        this.credentials.email
      )
    )
      this.formError = "Please enter a valid e-mail address.";
    else if (this.credentials.password.length < 3)
      this.formError = "Password must be at least 3 characters long.";
    else if (this.inviteCodeRequired && !this.inviteCode.trim())
      this.formError = "Vnesi kodo za povabilo.";
    else this.doRegister();
  }

  private doRegister() {
    this.authenticationService
      .register(this.credentials, this.inviteCode.trim() || undefined)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = /invite code/i.test(String(error))
            ? "Koda za povabilo ni pravilna."
            : error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      });
  }
}
