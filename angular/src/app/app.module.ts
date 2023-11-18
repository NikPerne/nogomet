import { NgModule, isDevMode } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeSl from "@angular/common/locales/sl";
registerLocaleData(localeSl, "sl");
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule, BsModalService } from "ngx-bootstrap/modal";
import { RatingModule } from 'ngx-bootstrap/rating';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { LocationListComponent } from "./shared/components/location-list/location-list.component";
import { DistancePipe } from "./shared/pipes/distance.pipe";
import { FrameworkComponent } from "./shared/components/framework/framework.component";
import { AboutComponent } from "./shared/components/about/about.component";
import { HomepageComponent } from "./shared/components/homepage/homepage.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { StarsComponent } from "./shared/components/stars/stars.component";
import { LocationDetailsComponent } from "./shared/components/location-details/location-details.component";
import { DetailsPageComponent } from "./shared/components/details-page/details-page.component";
import { AllowUrlPipe } from './shared/pipes/allow-url.pipe';
import { MostRecentFirstPipe } from './shared/pipes/most-recent-first.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./modules/app-routing/app-routing.module";
import { RegisterComponent } from './shared/components/register/register.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EventListComponent } from './shared/components/event-list/event-list.component';
import { EventDetailsComponent } from './shared/components/event-details/event-details.component';
import { DetailsPageEventsComponent } from './shared/components/details-page-events/details-page-events.component';
import { MostRecentSignupPipe } from './shared/pipes/most-recent-signup.pipe';

@NgModule({
  declarations: [
    LocationListComponent,
    DistancePipe,
    FrameworkComponent,
    AboutComponent,
    HomepageComponent,
    HeaderComponent,
    SidebarComponent,
    StarsComponent,
    LocationDetailsComponent,
    DetailsPageComponent,
    AllowUrlPipe,
    MostRecentFirstPipe,
    RegisterComponent,
    LoginComponent,
    EventListComponent,
    EventDetailsComponent,
    DetailsPageEventsComponent,
    MostRecentSignupPipe,
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule,
    RatingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [BsModalService],
  bootstrap: [FrameworkComponent],
})
export class AppModule {}
