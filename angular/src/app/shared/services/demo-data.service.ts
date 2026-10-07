import { Inject, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Event } from "../classes/event";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { BROWSER_STORAGE } from "../classes/storage";
import { environment } from "../../../environments/environment";
import { Signup } from "../classes/signup";

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

  public getUsers(nResults: number): Observable<User[]> {
    const url: string = `${this.apiUrl}/users?nResults=${nResults}`;
    return this.http
      .get<User[]>(url)
      .pipe(retry(1), catchError(this.handleError));
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
    const body = new HttpParams()
      .set("name", event.name)
      .set("description", event.description)
      .set("date", new Date(event.date).toISOString());
    return this.http
      .post<Event>(url, body, { headers: this.headers(true) })
      .pipe(catchError(this.handleError));
  }

  public signUpForEvent(eventId: string, signup: Signup): Observable<Signup> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups`;
    const body = new HttpParams().set("attending", signup.attending);
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

  private headers(withAuth: boolean): HttpHeaders {
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
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
