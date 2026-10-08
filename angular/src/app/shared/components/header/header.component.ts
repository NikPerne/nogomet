import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-header",
    template: `<div class="row banner">
    <div class="col-12">
      <h1>
        {{ content.title
        }}<span class="fs-6 text-secondary fw-lighter ms-3">{{
          content.subtitle
        }}</span>
      </h1>
    </div>
  </div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent {
  @Input() content: any;
}
