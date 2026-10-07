import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { DemoDataService } from "./demo-data.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private demoDataService: DemoDataService,
    private router: Router
  ) {}

  public login(user: User): Observable<AuthResponse> {
    return this.demoDataService
      .login(user)
      .pipe(tap((authResponse) => this.saveToken(authResponse.token)));
  }

  public register(user: User): Observable<AuthResponse> {
    return this.demoDataService
      .register(user)
      .pipe(tap((authResponse) => this.saveToken(authResponse.token)));
  }

  public logout(): void {
    this.storage.removeItem("demo-token");
    this.router.navigate(["/login"]);
  }

  public getToken(): string | null {
    return this.storage.getItem("demo-token");
  }

  public saveToken(token: string): void {
    this.storage.setItem("demo-token", token);
  }

  /**
   * Tokens issued before the admin claim was added are treated as expired,
   * so those users log in again and get a token with the correct role
   */
  public isLoggedIn(): boolean {
    const payload = this.getPayload();
    return (
      !!payload &&
      payload.exp > Date.now() / 1000 &&
      typeof payload.admin === "boolean"
    );
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) return null;
    const { _id, email, name, admin } = this.getPayload();
    return { _id, email, name, admin: !!admin };
  }

  /**
   * Decodes the JWT payload, which is base64url-encoded UTF-8 JSON
   */
  private getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const binary = window.atob(base64);
      const bytes = Uint8Array.from(binary, (character) =>
        character.charCodeAt(0)
      );
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }
}
