import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { ReservationService } from '../service/reservation.service';
import { User } from '../models/UserModel';
import { ReservationModel } from '../models/ReservationModel';
import { TournamentService } from '../service/tournament.service';
import { Tournament } from '../models/TournamentModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent {


  showProfile : boolean = false;
  revealProfile(){
    this.showProfile = !this.showProfile;
  }

  loadedFirstName : string = null;
  loadedLastName : string = null;
  loadedPicture : string = null;
  tournaments : Tournament[] = null


  constructor(private userService : UserService, private reservationService : ReservationService,private tourService : TournamentService,
    private router : Router){}

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
            this.userService.getAcademyPlayers().subscribe( (res) => {
              if(res['message'] == '1')
              {
                console.log(res['players'])
                res['players'].forEach(element => {
                  this.academyPlayers.push(element)
                });

                let form3 = new FormData()
                form3.append('email', localStorage.getItem('email'))
                this.reservationService.getCoachesPractises(form3).subscribe( (res) => {
                  if(res['message'] == '1')
                  {
                    this.practisesToFinish = res['practises']

                    let form4 = new FormData()
                    form4.append('email', localStorage.getItem('email'))
                    this.reservationService.coachDiary(form4).subscribe( (ret) => {
                      if(ret['message'] == '1'){
                      
                        this.myDiary = ret['myDiary']

                        this.myDiary.forEach(element => {
                        });
                      }
                    })

                  }
                })

              }
            })
          }
        })
    }
  }

  academyPlayers : User[] = []

  showMakePractise : boolean = false;

  chosenPlayer : string = null;
  
  chosenPlayers : User[] = [];
  choosePlayer()
  {

    if(typeof (this.academyPlayers.find(
      obj => {return obj.email == this.chosenPlayer}
    )) == 'undefined')
    {
      //error must choose player
      return;
    }
    this.academyPlayers.forEach(element => {

      if(typeof (this.chosenPlayers.find( (obj) => {
        return obj.email == this.chosenPlayer
      })) != 'undefined')
      {
        //you cannot add the same person!
        return;
      }

      if(element.email == this.chosenPlayer)
      {
        this.chosenPlayers.push(element)
        return
      }
       
    });
  }

  removePlayer(index)
  {
    this.chosenPlayers.splice(index,1)
  }

  prepareForMatchCreation()
  {
    let chosen_array : string[] = []
    for(let i = 0; i < this.chosenPlayers.length; i++)
      chosen_array.push(this.chosenPlayers[i].email)
    localStorage.setItem('academy_players_chosen', JSON.stringify(chosen_array))
  }



  showFinishPractise : boolean = false;

  practisesToFinish : ReservationModel[] = []

  showTournamentTable : boolean = false;

  logOut()
  {
    localStorage.clear()
    this.router.navigate(['guest'])
  }

  description : string = null;
  editPractise()
  {
    let form = new FormData()
    form.append('id', this.practisesToFinish[this.indexEditPractise]._id)
    form.append('description', this.description)
    this.reservationService.editReservation(form).subscribe( (res) => {
      if(res['message'] == '1')
        location.reload()
    })
  }
  editedDescription : string = ""

  editEditedPractise()
  {
    let form = new FormData()
    form.append('id', this.myDiary[this.indexEditDiary]._id)
    form.append('description', this.editedDescription)
    this.reservationService.editReservation(form).subscribe( (res) => {
      if(res['message'] == '1')
        location.reload()
    })
  }

  showEditPractise : boolean = false;
  indexEditPractise : number = null;
  showEditPractiseWindow(index)
  {
   
    if(!this.showEditPractise)
      this.showEditPractise = true;
    else
      if(this.indexEditPractise == index)
        this.showEditPractise = false;

    this.indexEditPractise = index;

  }



  showEditDiary : boolean = false;
  indexEditDiary : number = null;
  showEditedDiaryWindow(index)
  {   
    if(!this.showEditDiary)
      this.showEditDiary = true;
    else
      if(this.indexEditDiary == index)
        this.showEditDiary = false;

    this.indexEditDiary = index;

  }
  
  showDiary : boolean = false;
  myDiary : ReservationModel[] = []
  isSmallScreen()
  {
    if(window.innerWidth < 600)
      return true;
    return false;
  }

  revealRankList : boolean = false;

}
