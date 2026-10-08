import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { VENUE } from "../classes/venue";

/** Hourly forecast at the venue for the kick-off hour */
export interface Forecast {
  /** °C */
  temperature: number;
  /** 0-100 %, null when the model doesn't provide it */
  precipitationProbability: number | null;
  /** mm in that hour */
  precipitation: number;
  /** km/h */
  windSpeed: number;
  /** WMO weather code, see describeWeather() */
  weatherCode: number;
}

/** Open-Meteo forecasts reach 16 days ahead; the last days are unreliable */
export const FORECAST_DAYS = 14;

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: (number | null)[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

/**
 * Venue-local "yyyy-MM-dd" and "yyyy-MM-ddTHH:00" for an instant (Open-Meteo returns local times)
 */
const venueLocal = (date: Date): { day: string; hour: string } => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: VENUE.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  const day = `${parts["year"]}-${parts["month"]}-${parts["day"]}`;
  return { day, hour: `${day}T${parts["hour"]}:00` };
};

/**
 * Weather forecast from Open-Meteo (free, no API key), requested directly by the browser
 */
@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  /**
   * Forecast for the hour that contains `date`, or null when unavailable
   * (too far ahead, offline, or the service failed - weather is never essential)
   */
  public forecastAt(date: Date): Observable<Forecast | null> {
    const { day, hour } = venueLocal(date);
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${VENUE.latitude}&longitude=${VENUE.longitude}` +
      "&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m" +
      `&timezone=${encodeURIComponent(VENUE.timeZone)}&start_date=${day}&end_date=${day}`;
    return this.http.get<OpenMeteoResponse>(url).pipe(
      map(({ hourly }) => {
        const i = hourly.time.indexOf(hour);
        if (i === -1) return null;
        return {
          temperature: hourly.temperature_2m[i],
          precipitationProbability: hourly.precipitation_probability[i] ?? null,
          precipitation: hourly.precipitation[i],
          windSpeed: hourly.wind_speed_10m[i],
          weatherCode: hourly.weather_code[i],
        };
      }),
      catchError(() => of(null))
    );
  }
}

/**
 * Slovenian description and Font Awesome icon for a WMO weather code
 */
export const describeWeather = (code: number): { label: string; icon: string } => {
  if (code === 0) return { label: "Jasno", icon: "fa-sun" };
  if (code <= 2) return { label: "Delno oblačno", icon: "fa-cloud-sun" };
  if (code === 3) return { label: "Oblačno", icon: "fa-cloud" };
  if (code === 45 || code === 48) return { label: "Megla", icon: "fa-smog" };
  if (code >= 51 && code <= 57) return { label: "Rosenje", icon: "fa-cloud-rain" };
  if (code >= 61 && code <= 67) return { label: "Dež", icon: "fa-cloud-showers-heavy" };
  if (code >= 71 && code <= 77) return { label: "Sneg", icon: "fa-snowflake" };
  if (code >= 80 && code <= 82) return { label: "Plohe", icon: "fa-cloud-showers-heavy" };
  if (code === 85 || code === 86) return { label: "Snežne plohe", icon: "fa-snowflake" };
  if (code >= 95) return { label: "Nevihta", icon: "fa-cloud-bolt" };
  return { label: "Spremenljivo", icon: "fa-cloud-sun" };
};
