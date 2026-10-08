import { Injectable, signal } from "@angular/core";

/**
 * Dark mode following the device's light/dark setting. Bootstrap 5.3 switches all its
 * colours with data-bs-theme on <html>; index.html sets it once before the app starts
 * (no light flash), and this service keeps it in sync when the setting changes.
 */
@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly media = window.matchMedia("(prefers-color-scheme: dark)");
  /** True while the device is in dark mode; components like charts react to it */
  readonly isDark = signal(this.media.matches);

  constructor() {
    this.apply();
    this.media.addEventListener("change", (change) => {
      this.isDark.set(change.matches);
      this.apply();
    });
  }

  private apply(): void {
    document.documentElement.setAttribute("data-bs-theme", this.isDark() ? "dark" : "light");
  }
}
