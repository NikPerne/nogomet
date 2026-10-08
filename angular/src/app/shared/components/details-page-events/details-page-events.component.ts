import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { DemoDataService } from "../../services/demo-data.service";
import { Event } from "../../classes/event";

@Component({
    selector: "app-details-page",
    template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-9">
        <app-event-details
          [event]="event"
          (eventChange)="setEvent($event)"
        ></app-event-details>
      </div>
      <app-sidebar
        class="col-12 col-lg-3 mt-4"
        [content]="header.sidebar"
      ></app-sidebar>
    </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DetailsPageEventsComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private route: ActivatedRoute
  ) {}

  event!: Event;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let eventId: string = params.get("eventId") ?? "";
          return this.demoDataService.getEventDetails(eventId);
        })
      )
      .subscribe((event: Event) => this.setEvent(event));
  }

  protected setEvent(event: Event): void {
    this.event = event;
    this.header = { title: event.name, subtitle: "", sidebar: "" };
  }

  header = {
    title: "",
    subtitle: "",
    sidebar: "",
  };
}
