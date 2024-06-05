import { Component } from '@angular/core';
import { GuestServiceService } from '../service/guest-service.service';
import { Tournament } from '../models/TournamentModel';
import { TournamentService } from '../service/tournament.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent {

  loadedFirstName : string = "";
  loadedLastName : string = "";
  loadedPicture : string = "defaul_picture.png";

  loggedIn : boolean = false; 

  tournaments : Tournament[] = []
  ngOnInit(){
    if(localStorage.getItem('email')){
      this.loggedIn = true;
      this.loadedFirstName = localStorage.getItem('firstName');
      this.loadedLastName = localStorage.getItem('lastName');
      this.loadedPicture = localStorage.getItem('picture');
      if(!this.loadedPicture){
        this.loadedPicture = 'defaul_picture.png';
      }

    }

    
    this.tourService.getAllActiveTournaments().subscribe(res => {
        
      if(res['message'] == '1'){
        console.log(this.tournaments)
        this.tournaments = res['tours']
      }
    })
  }
  constructor(guestService:GuestServiceService, private tourService : TournamentService){
    
  }

  public loginForm = false;
  
  public openLoginForm(){
    this.loginForm = !this.loginForm;
  }

  showTournamentTable : boolean = false;

  isSmallScreen()
  {
    if(window.innerWidth < 600)
    {
      return true;
    }
    return false;
  }

  revealRankList : boolean = false;
}
