import { Inject, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Comment } from "../classes/comment";
import { Event } from "../classes/event";
import { Location } from "../classes/location";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { BROWSER_STORAGE } from "../classes/storage";
import { environment } from '../../../environments/environment';

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

  getEvents(limit?: number): Observable<Event[]> {
    return this.http.get<Event[]>(`/api/events?limit=${limit}`); 
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

  public getLocations(
    lng: number,
    lat: number,
    distance: number,
    nResults: number
  ): Observable<Location[]> {
    const url: string = `${this.apiUrl}/locations/distance?lng=${lng}&lat=${lat}&distance=${distance}&nResults=${nResults}`;
    return this.http
      .get<Location[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getLocationDetails(locationId: string): Observable<Location> {
    const url: string = `${this.apiUrl}/locations/${locationId}`;
    return this.http
      .get<Location>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addCommentToLocation(
    locationId: string,
    comment: Comment
  ): Observable<Comment> {
    const url: string = `${this.apiUrl}/locations/${locationId}/comments`;
    let body = new HttpParams()
      .set("author", comment.author)
      .set("rating", comment.rating)
      .set("comment", comment.comment);
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${this.storage.getItem("demo-token")}`);
    return this.http
      .post<Comment>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteCommentFromLocation(
    locationId: string,
    commentId: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}/locations/${locationId}/comments/${commentId}`;
    let headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.storage.getItem("demo-token")}`
    );
    return this.http
      .delete(url, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}
