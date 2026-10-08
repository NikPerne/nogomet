import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { Observable, firstValueFrom } from "rxjs";
import { take } from "rxjs/operators";
import { DemoDataService } from "./demo-data.service";

/**
 * Push notifications on this device (phone or computer) through the Angular service worker.
 * Only works in production builds (the service worker is off in development), and on
 * iPhone only after the app was added to the home screen (iOS 16.4+).
 */
@Injectable({
  providedIn: "root",
})
export class PushService {
  constructor(
    private swPush: SwPush,
    private demoDataService: DemoDataService
  ) {}

  public get supported(): boolean {
    return this.swPush.isEnabled && "Notification" in window;
  }

  /** "denied" means the user blocked notifications in the browser settings */
  public get permission(): NotificationPermission | null {
    return "Notification" in window ? Notification.permission : null;
  }

  /** This device's current subscription, or null */
  public get subscription(): Observable<PushSubscription | null> {
    return this.swPush.subscription;
  }

  /**
   * Asks for permission (the browser shows its prompt) and registers this device
   */
  public async enable(): Promise<void> {
    const { publicKey } = await firstValueFrom(this.demoDataService.getPushPublicKey());
    const subscription = await this.swPush.requestSubscription({ serverPublicKey: publicKey });
    await firstValueFrom(this.demoDataService.savePushSubscription(subscription.toJSON()));
  }

  /**
   * Unregisters this device on the server and in the browser (also used on logout)
   */
  public async disable(): Promise<void> {
    if (!this.supported) return;
    const subscription = await firstValueFrom(this.swPush.subscription.pipe(take(1)));
    if (!subscription) return;
    try {
      await firstValueFrom(this.demoDataService.deletePushSubscription(subscription.endpoint));
    } finally {
      await this.swPush.unsubscribe();
    }
  }
}
