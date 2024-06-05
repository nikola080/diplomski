import { Component } from '@angular/core';
import { GuestServiceService } from '../service/guest-service.service';
import { Tournament } from '../models/TournamentModel';
import { TournamentService } from '../service/tournament.service';
import { ReservationService } from '../service/reservation.service';
import { ReservationModel } from '../models/ReservationModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recreational',
  templateUrl: './recreational.component.html',
  styleUrls: ['./recreational.component.css']
})
export class RecreationalComponent {
  loadedFirstName : string = "";
  loadedLastName : string = "";
  loadedPicture : string = "defaul_picture.png";

  tournaments : Tournament[] = [];
  myReservations : ReservationModel[] = []
  ngOnInit(){
    if(localStorage.getItem('email')){
      this.loadedFirstName = localStorage.getItem('firstName');
      this.loadedLastName = localStorage.getItem('lastName');
      this.loadedPicture = localStorage.getItem('picture');
      if(!this.loadedPicture){
        this.loadedPicture = 'defaul_picture.png';
      }
      this.tourService.getAllActiveTournaments().subscribe(res => {
        if(res['message'] == '1'){
          this.tournaments = res['tours']

          let formRes = new FormData()
          formRes.append('email', localStorage.getItem('email'))
          this.resService.getMyReservations(formRes).subscribe( (res) => {
            if(res['message'] == '1')
            {
              this.myReservations = res['reservations']

              let batchDeleteRes = [];

              this.myReservations.forEach(element => {
                if(element.status == '3')
                  batchDeleteRes.push(element._id)
              });

              let form2 = new FormData()

              form2.append('array' , JSON.stringify(batchDeleteRes))
              this.resService.batchReservationDelete(form2).subscribe( ( res) => {

              })
            }
          } )
        }
      })
    }

  }
  constructor(private guestService:GuestServiceService, private tourService : TournamentService, private resService : ReservationService,
    private router : Router){
    
  }
  showProfile : boolean = false;
  revealProfile(){
    this.showProfile = !this.showProfile;
  }

  showReservationForm : boolean = false;
  revealRservationFrom(){
    this.showReservationForm = !this.showReservationForm;
  }

  showTournamentTable :boolean = false;
  revealTournamentTable(){
    this.showTournamentTable = !this.showTournamentTable;
  }


  showRegistration : boolean = false;

  showReservations : boolean = false;

  indexResToDelete : number = null;

  displayDelete : string = 'none'

  deleteReservation(index){

    let form = new FormData()

    form.append('_id', this.myReservations[this.indexResToDelete]._id)

    this.resService.cancelReservation(form).subscribe( (res) => {
      if(res['message'] == '1')
      {
        this.myReservations.splice(this.indexResToDelete,1)
      }
    })
  }

  logOut()
  {
    localStorage.clear()
    this.router.navigate(['guest'])
  }

  isSmallScreen()
  {
    if(window.innerWidth < 600)
      return true;
    return false;
  }
  
  revealRankList : boolean = false;

  getStatus(status)
  {
    let ret = ''
    switch(status)
    {
      case '3' : ret = 'terminated by admin' ;break;
      default : ret = 'active'; break;
    }

    return ret
  }
}
