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
import { environment } from '../../../environments/environment';
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

  public getUsers(
    nResults: number
  ): Observable<User[]> {
    const url: string = `${this.apiUrl}/users?nResults=${nResults}`;
    return this.http
      .get<User[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteSignUpFromEvent(
    eventId: string,
    signupId: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups/${signupId}`;
    let headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storage.getItem("demo-token")}`
    );
    return this.http
      .delete(url, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getEvents(
    nResults: number
  ): Observable<Event[]> {
    const url: string = `${this.apiUrl}/events?nResults=${nResults}`;
    return this.http
      .get<Event[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }


/*   getEvents(limit?: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events?limit=${limit}`); 
  } */

  public getEventDetails(eventId: string): Observable<Event> {
    const url: string = `${this.apiUrl}/events/${eventId}`;
    return this.http
      .get<Event>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public signUpForEvent(
    eventId: string,
    signup: Signup
  ): Observable<Signup> {
    const url: string = `${this.apiUrl}/events/${eventId}/signups`;
    let body = new HttpParams()
      .set("name", signup.name)
      .set("attending", signup.attending);
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http
      .post<Signup>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  createEvent(
    event: Event,
    ): Observable<Event> {
    const url: string = `${this.apiUrl}/events`;
    let body = new HttpParams()
      .set("name", event.name)
      .set("description", event.description)
      .set("date", event.date.toISOString());
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http
      .post<Event>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public register(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }

  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams().set("email", user.email).set("name", user.name);
    if (user.password) body = body.set("password", user.password);
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post<AuthResponse>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}
