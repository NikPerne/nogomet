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

const routes: Routes = [
  { path: "", component: HomepageComponent, canActivate: [AuthGuard]},
  { path: "events", component: EventListComponent, canActivate: [AuthGuard]},
  { path: "about", component: AboutComponent },
  { path: "events/:eventId", component: DetailsPageEventsComponent, canActivate: [AuthGuard]},
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
