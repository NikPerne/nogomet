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
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    NgApexchartsModule,
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
