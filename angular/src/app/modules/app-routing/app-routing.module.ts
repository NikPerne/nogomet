import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "../../shared/components/homepage/homepage.component";
import { AboutComponent } from "../../shared/components/about/about.component";
import { DetailsPageComponent } from "../../shared/components/details-page/details-page.component";
import { RegisterComponent } from "src/app/shared/components/register/register.component";
import { LoginComponent } from "../../shared/components/login/login.component";
import { EventListComponent } from "../../shared/components/event-list/event-list.component";
import { AuthGuard } from "../../shared/services/auth-guard.service";

const routes: Routes = [
  { path: "", component: HomepageComponent, canActivate: [AuthGuard]},
  { path: "about", component: AboutComponent },
  { path: "events", component: EventListComponent },
  { path: "locations/:locationId", component: DetailsPageComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
