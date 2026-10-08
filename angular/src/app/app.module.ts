import { NgModule, isDevMode } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeSl from "@angular/common/locales/sl";
registerLocaleData(localeSl, "sl");
import { BrowserModule } from "@angular/platform-browser";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { ModalModule, BsModalService } from "ngx-bootstrap/modal";
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";

import { FrameworkComponent } from "./shared/components/framework/framework.component";
import { AboutComponent } from "./shared/components/about/about.component";
import { HomepageComponent } from "./shared/components/homepage/homepage.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { AllowUrlPipe } from './shared/pipes/allow-url.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./modules/app-routing/app-routing.module";
import { RegisterComponent } from './shared/components/register/register.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EventListComponent } from './shared/components/event-list/event-list.component';
import { EventDetailsComponent } from './shared/components/event-details/event-details.component';
import { DetailsPageEventsComponent } from './shared/components/details-page-events/details-page-events.component';
import { MostRecentSignupPipe } from './shared/pipes/most-recent-signup.pipe';
import { EventFormComponent } from './shared/components/event-form/event-form.component';
import { LeaderboardComponent } from './shared/components/leaderboard/leaderboard.component';
import { SeasonComponent } from './shared/components/season/season.component';
import { EventTeamsComponent } from './shared/components/event-teams/event-teams.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
import { AdminUsersComponent } from './shared/components/admin-users/admin-users.component';
import { EventMvpComponent } from './shared/components/event-mvp/event-mvp.component';

@NgModule({
  declarations: [
    FrameworkComponent,
    AboutComponent,
    HomepageComponent,
    HeaderComponent,
    SidebarComponent,
    AllowUrlPipe,
    RegisterComponent,
    LoginComponent,
    EventListComponent,
    EventDetailsComponent,
    DetailsPageEventsComponent,
    MostRecentSignupPipe,
    EventFormComponent,
    LeaderboardComponent,
    SeasonComponent,
    EventTeamsComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminUsersComponent,
    EventMvpComponent,
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule,
    FormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
  providers: [BsModalService, provideHttpClient(withXhr(), withInterceptorsFromDi())],
  bootstrap: [FrameworkComponent],
})
export class AppModule {}
