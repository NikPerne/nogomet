import { Component } from "@angular/core";

@Component({
  selector: "app-about",
  template: `<h1>About</h1>
    <div class="row">
      <div class="col-12 col-lg-8">
        <p>
          Even though we have more activities and information serving our days
          than ever before – work, family, friends, travel, the internet, books,
          movies – boredom is still a part of life. If you’ve found yourself
          staring blankly at a wall or failing to come up with something to fill
          your time, you’ve experienced boredom. We created a demo app to help
          you drive away boredom, a widespread feeling.
        </p>
        <p>
          Here are rounded up some quotes about being bored. These aren’t dull
          quotes; they’re interesting ones that reveal the many different
          aspects of boredom.
        </p>
        <figure>
          <blockquote>
            "Is life not a thousand times too short for us to bore ourselves?"
          </blockquote>
          <figcaption class="blockquote-footer">Friedrich Nietzsche</figcaption>
        </figure>
        <figure>
          <blockquote>
            "There are no uninteresting things, only uninterested people."
          </blockquote>
          <figcaption class="blockquote-footer">G. K. Chesterton</figcaption>
        </figure>
        <figure>
          <blockquote>
            "People say nothing is impossible, but I do nothing every day."
          </blockquote>
          <figcaption class="blockquote-footer">A. A. Milne</figcaption>
        </figure>
        <figure>
          <blockquote>"Stay hungy, stay foolish."</blockquote>
          <figcaption class="blockquote-footer">Steve Jobs</figcaption>
        </figure>
      </div>
    </div>`,
  styles: [],
})
export class AboutComponent {}
