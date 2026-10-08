import { Component, ChangeDetectionStrategy } from "@angular/core";
import { User } from "../../classes/user";
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from "../../services/connection.service";
import { ThemeService } from "../../services/theme.service";
import { PushService } from "../../services/push.service";

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
    private connectionService: ConnectionService,
    private pushService: PushService,
    // Injected here, in the root component, so dark mode follows the device from the start
    _themeService: ThemeService
  ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  /**
   * Stops push notifications to this device first, so it gets no messages meant for this user
   */
  public logout(): void {
    this.pushService
      .disable()
      .catch(() => undefined)
      .finally(() => this.authenticationService.logout());
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
