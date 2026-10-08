import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DemoDataService } from "../../services/demo-data.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { Account } from "../../classes/account";

/**
 * Admin page: all user accounts, grant/remove admin rights, delete accounts
 */
@Component({
    selector: "app-admin-users",
    template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-8">
        @if (!isAdmin()) {
          <div class="alert alert-dark mt-4 p-2">
            <i class="fa-solid fa-lock pe-2"></i>Ta stran je samo za administratorje.
          </div>
        }
        @if (isAdmin()) {
          <div class="alert alert-dark mt-4 p-2" [hidden]="!message">
            <i class="fa-solid fa-triangle-exclamation pe-2"></i>{{ message }}
          </div>
          <input
            type="search"
            class="form-control form-control-sm mt-4"
            placeholder="Išči po imenu ali e-naslovu"
            aria-label="Išči uporabnike"
            [(ngModel)]="filter"
            />
          <div class="card mt-3">
            <div class="table-responsive">
              <table class="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th class="ps-3">Ime</th>
                    <th>E-naslov</th>
                    <th class="text-center">Admin</th>
                    <th class="pe-3"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of filteredUsers; track user) {
                    <tr>
                      <td class="ps-3 text-break">
                        {{ user.name }}
                        @if (isSelf(user)) {
                          <small class="text-secondary">(ti)</small>
                        }
                      </td>
                      <td class="text-break small">{{ user.email }}</td>
                      <td class="text-center">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          [attr.aria-label]="'Admin: ' + user.name"
                          [checked]="user.admin"
                          [disabled]="isSelf(user) || busy.has(user._id) || !isConnected()"
                          [title]="isSelf(user) ? 'Svojih pravic ne moreš odstraniti' : ''"
                          (change)="toggleAdmin(user)"
                          />
                      </td>
                      <td class="pe-3 text-end">
                        @if (!isSelf(user)) {
                          <button
                            type="button"
                            class="btn btn-link btn-sm text-danger p-1 m-0"
                            [disabled]="busy.has(user._id) || !isConnected()"
                            [attr.aria-label]="'Izbriši ' + user.name"
                            title="Izbriši račun"
                            (click)="deleteUser(user)"
                            >
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                  @if (filteredUsers.length === 0 && !message) {
                    <tr>
                      <td colspan="4" class="ps-3 text-secondary">Ni uporabnikov.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          <p class="text-secondary small mt-2">
            Izbrisan uporabnik izgubi račun in plačila članarine. Njegove pretekle prijave
            ostanejo vidne na dogodkih, a se ne štejejo več v statistiko.
          </p>
        }
      </div>
    </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminUsersComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  protected header = { title: "Uporabniki", subtitle: "", sidebar: "" };
  protected users: Account[] = [];
  protected filter = "";
  protected message = "";
  /** IDs of users with a request in progress */
  protected busy = new Set<string>();

  ngOnInit(): void {
    if (this.isAdmin()) this.load();
  }

  private load(messageAfterLoad = ""): void {
    this.message = "Loading users ...";
    this.demoDataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.message = messageAfterLoad;
      },
      error: (err) => (this.message = err),
    });
  }

  protected get filteredUsers(): Account[] {
    const filter = this.filter.trim().toLowerCase();
    return filter
      ? this.users.filter(
          (user) =>
            user.name.toLowerCase().includes(filter) ||
            user.email.toLowerCase().includes(filter)
        )
      : this.users;
  }

  protected toggleAdmin(user: Account): void {
    this.busy.add(user._id);
    this.message = "";
    this.demoDataService.setUserAdmin(user._id, !user.admin).subscribe({
      next: (updated) => {
        user.admin = updated.admin;
        this.busy.delete(user._id);
      },
      error: (err) => {
        this.busy.delete(user._id);
        // Reload so the checkbox shows the real state
        this.load(err);
      },
    });
  }

  protected deleteUser(user: Account): void {
    if (!confirm(`Izbrišem račun "${user.name}" (${user.email})? Tega ni mogoče razveljaviti.`))
      return;
    this.busy.add(user._id);
    this.message = "";
    this.demoDataService.deleteUser(user._id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u._id !== user._id);
        this.busy.delete(user._id);
      },
      error: (err) => {
        this.busy.delete(user._id);
        this.message = err;
      },
    });
  }

  protected isSelf(user: Account): boolean {
    return this.authenticationService.getCurrentUser()?._id === user._id;
  }

  public isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }
}
