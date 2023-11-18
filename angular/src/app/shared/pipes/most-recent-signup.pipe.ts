import { Pipe, PipeTransform } from "@angular/core";
import { Signup } from "../classes/signup";

@Pipe({
  name: "mostRecentSignup",
})
export class MostRecentSignupPipe implements PipeTransform {
  transform(signups: Signup[] | undefined): Signup[] | undefined {
    if (signups && signups.length > 0) {
      signups = signups.sort((a, b) => {
        let order = 0;
        if (b.createdOn && a.createdOn) {
          if (b.createdOn > a.createdOn) order = 1;
          else if (b.createdOn < a.createdOn) order = -1;
        }
        return order;
      });
    }
    return signups;
  }
}
