import { Pipe, PipeTransform } from "@angular/core";
import { Signup } from "../classes/signup";

@Pipe({
  name: "mostRecentSignup",
})
export class MostRecentSignupPipe implements PipeTransform {
  /**
   * Returns a new array sorted newest first; the input array is not mutated
   */
  transform(signups: Signup[] | undefined): Signup[] | undefined {
    if (!signups) return signups;
    const time = (signup: Signup) =>
      signup.createdOn ? new Date(signup.createdOn).getTime() : 0;
    return [...signups].sort((a, b) => time(b) - time(a));
  }
}
