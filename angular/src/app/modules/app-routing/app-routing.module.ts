import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "../../shared/components/homepage/homepage.component";
import { AboutComponent } from "../../shared/components/about/about.component";
import { RegisterComponent } from "../../shared/components/register/register.component";
import { LoginComponent } from "../../shared/components/login/login.component";
import { DetailsPageEventsComponent } from "../../shared/components/details-page-events/details-page-events.component";
import { AuthGuard } from "../../shared/services/auth-guard.service";
import { EventListComponent } from "../../shared/components/event-list/event-list.component";
import { LeaderboardComponent } from "../../shared/components/leaderboard/leaderboard.component";
import { SeasonComponent } from "../../shared/components/season/season.component";
import { ProfileComponent } from "../../shared/components/profile/profile.component";
import { ForgotPasswordComponent } from "../../shared/components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "../../shared/components/reset-password/reset-password.component";
import { AdminUsersComponent } from "../../shared/components/admin-users/admin-users.component";

const routes: Routes = [
  { path: "", component: HomepageComponent, canActivate: [AuthGuard]},
  { path: "events", component: EventListComponent, canActivate: [AuthGuard]},
  { path: "lestvica", component: LeaderboardComponent, canActivate: [AuthGuard]},
  { path: "clanarina", component: SeasonComponent, canActivate: [AuthGuard]},
  { path: "about", component: AboutComponent },
  { path: "events/:eventId", component: DetailsPageEventsComponent, canActivate: [AuthGuard]},
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "profil", component: ProfileComponent, canActivate: [AuthGuard]},
  // The page itself shows a notice to non-admins; the API enforces admin rights
  { path: "uporabniki", component: AdminUsersComponent, canActivate: [AuthGuard]},
  { path: "pozabljeno-geslo", component: ForgotPasswordComponent },
  // Opened from the reset email link (?token=...); keep the path in sync with the API
  { path: "ponastavi-geslo", component: ResetPasswordComponent },
  // Unknown URLs go to the homepage instead of an empty page
  { path: "**", redirectTo: "" },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
