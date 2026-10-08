import { Injectable } from "@angular/core";

/** "shared" via the share sheet, "copied" to the clipboard, "cancelled" by the user, or "failed" */
export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

@Injectable({
  providedIn: "root",
})
export class ShareService {
  /**
   * Shares text plus a link via the device share sheet (e.g. WhatsApp),
   * or copies both to the clipboard where sharing isn't supported
   */
  public async share(title: string, text: string, url: string): Promise<ShareResult> {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return "shared";
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      return "copied";
    } catch (err) {
      // Closing the share sheet rejects with AbortError, which is not an error for the user
      return (err as DOMException)?.name === "AbortError" ? "cancelled" : "failed";
    }
  }
}
