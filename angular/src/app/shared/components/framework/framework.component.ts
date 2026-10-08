import { Component, ChangeDetectionStrategy } from "@angular/core";
import { User } from "../../classes/user";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";

@Component({
    selector: "app-framework",
    templateUrl: "./framework.component.html",
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FrameworkComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService
  ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authenticationService.getCurrentUser()?.admin ?? false;
  }

  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }
}
