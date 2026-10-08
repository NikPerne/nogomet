import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Event, Score, Teams } from "../classes/event";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { BROWSER_STORAGE } from "../classes/storage";
import { environment } from "../../../environments/environment";
import { Signup } from "../classes/signup";
import { PlayerStats } from "../classes/player-stats";
import { SeasonOverview } from "../classes/season";
import { Account } from "../classes/account";

/** The current user's player-of-the-match vote status for an event */
export interface MvpStatus {
  canVote: boolean;
  votingOpen: boolean;
  /** Player key the user voted for, or null */
  myVote: string | null;
}

@Injectable({
  providedIn: "root",
})
export class DemoDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private apiUrl = environment.apiUrl;

  public login(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }

  public register(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }

  /**
   * Player statistics, all-time or for one season ("2026/27")
   */
  public getPlayerStats(nResults: number, season?: string): Observable<PlayerStats[]> {
    const url: string = `${this.apiUrl}/users`;
    let params = new HttpParams().set("nResults", nResults);
    if (season) params = params.set("season", season);
    return this.http
      .get<PlayerStats[]>(url, { params })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getAccount(): Observable<Account> {
    const url: string = `${this.apiUrl}/me`;
    return this.http
      .get<Account>(url, { headers: this.headers(true) })
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateSettings(emailNotifications: boolean): Observable<Account> {
    const url: string = `${this.apiUrl}/me/settings`;
    const body = new HttpParams().set("emailNotifications", emailNotifications);
    return this.http
      .put<Account>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public getUsers(): Observable<Account[]> {
    const url: string = `${this.apiUrl}/admin/users`;
    return this.http
      .get<Account[]>(url, { headers: this.headers(true) })
      .pipe(retry(1), catchError(this.handleError));
  }

  public setUserAdmin(userId: string, admin: boolean): Observable<Account> {
    const url: string = `${this.apiUrl}/admin/users/${userId}`;
    const body = new HttpParams().set("admin", admin);
    return this.http
      .put<Account>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public deleteUser(userId: string): Observable<unknown> {
    const url: string = `${this.apiUrl}/admin/users/${userId}`;
    return this.http
      .delete(url, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public getMvpStatus(eventId: string): Observable<MvpStatus> {
    const url: string = `${this.apiUrl}/events/${eventId}/mvp`;
    return this.http
      .get<MvpStatus>(url, { headers: this.headers(true) })
      .pipe(retry(1), catchError(this.handleError));
  }

  public voteMvp(
    eventId: string,
    playerKey: string
  ): Observable<MvpStatus & { event: Event }> {
    const url: string = `${this.apiUrl}/events/${eventId}/mvp`;
    const body = new HttpParams().set("playerKey", playerKey);
    return this.http
      .put<MvpStatus & { event: Event }>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public getEvents(nResults: number): Observable<Event[]> {
    const url: string = `${this.apiUrl}/events?nResults=${nResults}`;
    return this.http
      .get<Event[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getEventDetails(eventId: string): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}`;
    return this.http
      .get<Event>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Mutating requests are not retried, so a flaky connection can't create duplicates

  public createEvent(event: Event): Observable<Event> {
    const url: string = `${this.apiUrl}/events`;
    return this.http
      .post<Event>(url, this.eventBody(event), { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates only the given fields; maxPlayers null removes the limit
   */
  public updateEvent(eventId: string, changes: Partial<Event>): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}`;
    return this.http
      .put<Event>(url, this.eventBody(changes), { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  private eventBody(event: Partial<Event>): HttpParams {
    let body = new HttpParams();
    if (event.name !== undefined) body = body.set("name", event.name);
    if (event.description !== undefined)
      body = body.set("description", event.description);
    if (event.date !== undefined)
      body = body.set("date", new Date(event.date).toISOString());
    if (event.maxPlayers !== undefined)
      body = body.set("maxPlayers", event.maxPlayers ?? "");
    if (event.cancelled !== undefined)
      body = body.set("cancelled", event.cancelled);
    if (event.cancelReason !== undefined)
      body = body.set("cancelReason", event.cancelReason ?? "");
    return body;
  }

  public deleteEvent(eventId: string): Observable<unknown> {
    const url: string = `${this.apiUrl}/events/${eventId}`;
    return this.http
      .delete(url, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Saves the team line-up (admin); teams are sent as JSON
   */
  public saveTeams(eventId: string, teams: Teams): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}/teams`;
    return this.http
      .put<Event>(url, teams, { headers: this.headers(true, true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes the saved teams and the score (admin)
   */
  public clearTeams(eventId: string): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}/teams`;
    return this.http
      .delete<Event>(url, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public saveScore(eventId: string, score: Score): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}/score`;
    const body = new HttpParams()
      .set("rumeni", score.rumeni)
      .set("rdeci", score.rdeci);
    return this.http
      .put<Event>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public clearScore(eventId: string): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}/score`;
    return this.http
      .delete<Event>(url, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Requests a reset email; the response is the same whether or not the account exists
   */
  public forgotPassword(email: string): Observable<{ message: string }> {
    const url: string = `${this.apiUrl}/password/forgot`;
    const body = new HttpParams().set("email", email);
    return this.http
      .post<{ message: string }>(url, body, { headers: this.headers(false) })
      .pipe(catchError(this.handleError));
  }

  public resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/password/reset`;
    const body = new HttpParams().set("token", token).set("newPassword", newPassword);
    return this.http
      .post<AuthResponse>(url, body, { headers: this.headers(false) })
      .pipe(catchError(this.handleError));
  }

  public changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<unknown> {
    const url: string = `${this.apiUrl}/me/password`;
    const body = new HttpParams()
      .set("currentPassword", currentPassword)
      .set("newPassword", newPassword);
    return this.http
      .put(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Changes the answer and/or note; an empty note removes it
   */
  public updateSignup(
    eventId: string,
    signupId: string,
    changes: { attending?: boolean; note?: string }
  ): Observable<Signup> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups/${signupId}`;
    let body = new HttpParams();
    if (changes.attending !== undefined)
      body = body.set("attending", changes.attending);
    if (changes.note !== undefined) body = body.set("note", changes.note);
    return this.http
      .put<Signup>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  /**
   * Season fee overview; without a season label the current (or upcoming) season
   */
  public getSeason(season?: string): Observable<SeasonOverview> {
    const url: string = `${this.apiUrl}/season`;
    const params = season ? new HttpParams().set("season", season) : undefined;
    return this.http
      .get<SeasonOverview>(url, { params, headers: this.headers(true) })
      .pipe(retry(1), catchError(this.handleError));
  }

  public setSeasonPayment(
    userId: string,
    season: string,
    paid: boolean
  ): Observable<{ paid: boolean; paidOn: Date | null }> {
    const url: string = `${this.apiUrl}/season/payments/${userId}`;
    const body = new HttpParams().set("paid", paid).set("season", season);
    return this.http
      .put<{ paid: boolean; paidOn: Date | null }>(url, body, {
        headers: this.headers(true),
      })
      .pipe(catchError(this.handleError));
  }

  public addGuest(eventId: string, name: string): Observable<Signup> {
    const url: string = `${this.apiUrl}/events/${eventId}/guests`;
    const body = new HttpParams().set("name", name);
    return this.http
      .post<Signup>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public signUpForEvent(eventId: string, signup: Signup): Observable<Signup> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups`;
    let body = new HttpParams().set("attending", signup.attending);
    if (signup.note) body = body.set("note", signup.note);
    return this.http
      .post<Signup>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public deleteSignUpFromEvent(
    eventId: string,
    signupId: string
  ): Observable<unknown> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups/${signupId}`;
    return this.http
      .delete(url, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams().set("email", user.email).set("name", user.name);
    if (user.password) body = body.set("password", user.password);
    return this.http
      .post<AuthResponse>(url, body, { headers: this.headers(false) })
      .pipe(catchError(this.handleError));
  }

  private headers(withAuth: boolean, json = false): HttpHeaders {
    let headers = new HttpHeaders().set(
      "Content-Type",
      json ? "application/json" : "application/x-www-form-urlencoded"
    );
    if (withAuth)
      headers = headers.set(
        "Authorization",
        `Bearer ${this.storage.getItem("demo-token")}`
      );
    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      () => error.error?.message || error.statusText || "Unknown error."
    );
  }
}
