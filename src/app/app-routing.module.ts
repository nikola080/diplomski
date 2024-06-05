import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestComponent } from './guest/guest.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RecreationalComponent } from './recreational/recreational.component';
import { AdminComponent } from './admin/admin.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { TournamentDisplayComponent } from './tournament-display/tournament-display.component';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { CoachComponent } from './coach/coach.component';
import { AcademyComponent } from './academy/academy.component';

const routes: Routes = [
  {path : "guest", component : GuestComponent},
  {path : "coach", component : CoachComponent},
  {path : "login-form", component : LoginFormComponent},
  {path : "recreational", component : RecreationalComponent},
  {path : "academy", component : AcademyComponent},
  {path : "admin", component : AdminComponent},
  {path : "reservation", component : ReservationFormComponent},
  {path : "tournament-display", component : TournamentDisplayComponent},
  {path : "tournament-registration", component : TournamentRegistrationComponent},
  {path : "**", component : GuestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
