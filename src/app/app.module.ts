import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuestComponent } from './guest/guest.component';
import { OffcanvasModule } from '@coreui/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { RecreationalComponent } from './recreational/recreational.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { TournamentDisplayComponent } from './tournament-display/tournament-display.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { CoachComponent } from './coach/coach.component';
import { AcademyComponent } from './academy/academy.component';
import { RankListComponent } from './rank-list/rank-list.component';
import { AppFooterComponent } from './app-footer/app-footer.component'


@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    LoginFormComponent,
    RecreationalComponent,
    AdminComponent,
    ProfileComponent,
    ReservationFormComponent,
    TournamentDisplayComponent,
    NavBarComponent,
    TournamentRegistrationComponent,
    CoachComponent,
    AcademyComponent,
    RankListComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    OffcanvasModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
