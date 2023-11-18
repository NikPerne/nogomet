import { Component } from "@angular/core";

@Component({
  selector: "app-homepage",
  template: `<app-header [content]="header"></app-header>
    <div class="row">
      <div class="col-12 col-md-8">
        <app-event-list></app-event-list>
      </div>
      <app-sidebar
        class="col-12 col-md-4 mt-4"
        [content]="header.sidebar"
      ></app-sidebar>
    </div>`,
  styles: [],
})
export class HomepageComponent {
  header = {
    title: "Nogomet",
    subtitle: "",
    sidebar:
      "Looking for an interesting location nearby? Our application helps you find places to explore when your out and without ideas. Do you have any special requirements? Let our application help you find the place you're looking for.",
  };
}
