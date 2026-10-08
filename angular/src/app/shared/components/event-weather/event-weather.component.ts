import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { DEFAULT_EVENT_TIME, Event, hasTimeOfDay } from "../../classes/event";
import {
  FORECAST_DAYS,
  Forecast,
  WeatherService,
  describeWeather,
} from "../../services/weather.service";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Forecast at kick-off for upcoming, non-cancelled events (shown only when available)
 */
@Component({
  selector: "app-event-weather",
  template: `@if (forecast; as f) {
    <div
      class="d-flex flex-wrap align-items-center gap-3 small mt-1 mb-2"
      title="Vremenska napoved za začetek tekme (Open-Meteo)"
    >
      <span
        ><i class="fa-solid {{ weather.icon }} fs-5 me-1 align-middle"></i>{{ weather.label }},
        <b>{{ f.temperature | number: "1.0-0" : "sl" }} °C</b></span
      >
      <span title="Verjetnost padavin"
        ><i class="fa-solid fa-umbrella me-1"></i
        >{{ f.precipitationProbability === null ? "–" : f.precipitationProbability + " %" }}</span
      >
      <span title="Veter"
        ><i class="fa-solid fa-wind me-1"></i>{{ f.windSpeed | number: "1.0-0" : "sl" }} km/h</span
      >
    </div>
  }`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventWeatherComponent implements OnChanges {
  constructor(private weatherService: WeatherService) {}

  @Input() event?: Event;

  protected forecast: Forecast | null = null;
  protected weather = describeWeather(0);
  private loadedFor?: string;

  ngOnChanges(changes: SimpleChanges): void {
    const event = this.event;
    if (!changes["event"] || !event) return;
    const kickOff = this.kickOff(event);
    const key = `${event._id}|${kickOff.getTime()}`;
    if (key === this.loadedFor) return; // signups changed, but not the date
    this.loadedFor = key;
    this.forecast = null;
    const ahead = kickOff.getTime() - Date.now();
    if (event.cancelled || ahead < 0 || ahead > FORECAST_DAYS * DAY_MS) return;
    this.weatherService.forecastAt(kickOff).subscribe((forecast) => {
      this.forecast = forecast;
      if (forecast) this.weather = describeWeather(forecast.weatherCode);
    });
  }

  /**
   * Older events have no time of day; their forecast uses the default kick-off time
   */
  private kickOff(event: Event): Date {
    const date = new Date(event.date);
    if (!hasTimeOfDay(event)) {
      const [hours, minutes] = DEFAULT_EVENT_TIME.split(":").map(Number);
      date.setHours(hours, minutes, 0, 0);
    }
    return date;
  }
}
