import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { DemoDataService } from "../../services/demo-data.service";
import { Location } from "../../classes/location";

@Component({
  selector: "app-details-page",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-lg-9">
        <app-location-details [location]="location"></app-location-details>
      </div>
      <app-sidebar
        class="col-12 col-lg-3 mt-4"
        [content]="header.sidebar"
      ></app-sidebar>
    </div>`,
  styles: [],
})
export class DetailsPageComponent implements OnInit {
  constructor(
    private demoDataService: DemoDataService,
    private route: ActivatedRoute
  ) {}

  location!: Location;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let locationId: string = params.get("locationId") ?? "";
          return this.demoDataService.getLocationDetails(locationId);
        })
      )
      .subscribe((location: Location) => {
        this.location = location;
        this.header = {
          title: location.name,
          subtitle: "",
          sidebar: `${location.name} is on our Demo app because it is a fascinating cultural heritage nearby. If you've visited and you like it - or if you don't - please review it to help other people just like you.`,
        };
      });
  }

  header = {
    title: "",
    subtitle: "",
    sidebar: "",
  };
}
