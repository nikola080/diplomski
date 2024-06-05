import { Component, ElementRef, ViewChild } from '@angular/core';
import { TournamentService } from '../service/tournament.service';
import { Tournament } from '../models/TournamentModel';
import { UserService } from '../service/user.service';
import { User } from '../models/UserModel';
import { ReservationService } from '../service/reservation.service';
import { ReservationModel } from '../models/ReservationModel';
import { TournamentRegistration } from '../models/TournamentResgistration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  numberOfParticipants : string = "";

  selectNumPar : string[] = ['8','16','32']
  
  showMakeTournament : boolean = false;
  showTournamentTable : boolean = false;

  newTourName : string = null;
  newTourStarts : Date = null;
  newTourEnds : Date = null;
  newTourPrize : number = null;
  selectedNumPar : string = null;


  toggleUsersToApprove : Boolean = false;
  toggleAllApprovedUsers : boolean = false;

  revealMakeTournament(){
    this.showMakeTournament = !this.showMakeTournament;
  }


  tournaments : Tournament[] = [];
  usersToApprove : User[] = [];
  approvedUsers : User[] = [];

  toApproveImgs : string[] = []
  approvedImgs : string[] = [];

  indexUserToApprove : number = null;
  indexUserToDelete : number = null;

  displayDelete : string = 'none'
  displayApprove : string = 'none'


  indexUserToDisapprove : number = null;
  displayDisapprove : string = 'none'



  constructor(private tourService : TournamentService, private userService : UserService, private reservationService : ReservationService,
    private router : Router) {}

  ngOnInit(){

    this.tourService.getAllTournaments().subscribe(res => {
      if(res['message'] == '1'){
        this.tournaments = res['tours']
      }
      this.userService.getAllUsersToApprove().subscribe((res) => {
        if(res['message'] == '1'){
          res['users'].forEach(element => {
            this.usersToApprove.push(element)
            if(element['picture'] == '')
                this.toApproveImgs.push("/assets/defaul_picture.png")
              else
                this.toApproveImgs.push("/assets/" + element['picture'])
          });
        }

        this.userService.getAllApprovedUsers().subscribe((res) => {
          if(res['message'] == '1'){
            res['users'].forEach(element => {
              this.approvedUsers.push(element)
              if(element['picture'] == '')
                this.approvedImgs.push("/assets/defaul_picture.png")
              else
                this.approvedImgs.push("/assets/" + element['picture'])
            })
            this.reservationService.getAllReservations().subscribe((ret) => {
              if(ret['message'] == '1'){
                this.allReservations = ret['reservations']
                //console.log(this.allReservations)

                this.tourService.getAllRegTournaments().subscribe( (res) => {
                  if(res['message'] == '1')
                  {
                    console.log(res['tours'])

                    this.announcedTours = res['tours']


                    this.tourService.registeredPlayers(new FormData()).subscribe(
                      (res) => {
                        if(res['message'] == '1')
                        {
                          this.registeredPLayers = res['registered']
                        }
                      }
                    )

                  }
                })

              }
            })


          }
        })
      })
    })
  }

  tourNameError : string = null;
  newTourStartsError : string = null;
  newTourEndsError : string = null;
  newTourPrizeError : string = null;
  selectNumParError : string = null;

  createTournament(){
    
    this.tourNameError = null;
    this.newTourStartsError = null;
    this.newTourEndsError = null;
    this.newTourPrizeError = null;
    this.selectNumParError = null;
    
    if(this.newTourName == null){
      this.tourNameError = 'You must insert name of the tournament!'
      return
    }
    if(this.newTourStarts == null || this.newTourStarts.toLocaleString() == ''){
      this.newTourStartsError = 'Wrong date format!'
      return
    }

    if(this.newTourEnds == null || this.newTourEnds.toLocaleString() == ''){
      this.newTourEndsError = 'Wrong date format!'
      return
    }
    console.log(this.newTourEnds)
    console.log(new Date(this.newTourEnds).getTime() - new Date(this.newTourStarts).getTime())
    if(!this.newTourEndsError && (new Date(this.newTourEnds).getTime() - new Date(this.newTourStarts).getTime() < 0)){
      this.newTourEndsError = 'Ending date must be after starting date!'
      return;
    }

    if(this.newTourPrize == null || this.newTourPrize > 1000 || this.newTourPrize < 0 || (this.newTourPrize % 50 != 0)){
      this.newTourPrizeError = 'Wrong prize format!'
      return
    }
    if(this.selectedNumPar == null){
      this.selectNumParError = 'You must choose one of the above!'
      return
    }


    let form : FormData = new FormData();
      form.append('name', this.newTourName);
      form.append('starts', this.newTourStarts.toLocaleString());
      form.append('ends', this.newTourEnds.toLocaleString());
      form.append('prize', this.newTourPrize.toString());
      form.append('capacity', this.selectedNumPar);

      this.tourService.createNewTournament(form).subscribe(
        (ret) => {
          if(ret['message'] == '1')
            window.location.reload();
          else  
            if(ret['message'] == '2')
              this.tourNameError = "There's already a tournament with the same name that is active!"
        }
      )
    
  }

  approveUser(index){
    let form = new FormData();
    form.append('email', this.usersToApprove[index].email)
    this.userService.approveUser(form).subscribe(res => {
      if(res['message'] == '1')
        window.location.reload();
    })
  }

  deleteUser(index){

    let form = new FormData();
    form.append('email', this.approvedUsers[index].email)
    this.userService.deleteUser(form).subscribe(res => {
      if(res['message'] == '1')
        window.location.reload();
    })
  }

  showReservations : boolean = false;

  allReservations : ReservationModel[] = null;
  displayReservation : string = 'none'
  indexReservationToTerminate : number = null;

  terminateReservation(index){
    let form = new FormData();
    form.append('_id', this.allReservations[index]._id)
    this.reservationService.terminateReservation(form).subscribe((res) => {
      if(res['message'] == '1'){

        //all good

        //location.reload();

        this.allReservations.splice(index,1)

      }
      else{

        //well fuck

      }
    })

  }


  revealRegistered : boolean = false;
  announcedTours : Tournament[] = null;

  selectedTournamentString : string = null
  selectedTournament : Tournament = null;

  
  setTournament()
  {
    
    this.shownRegistrations = [];

    if(this.selectedTournamentString != null)
    {
      this.announcedTours.forEach(element => {
        if(element.name == this.selectedTournamentString)
        {
          this.selectedTournament = element
        }
      });
      
      this.registeredPLayers.forEach(element => {
        if(element.tournament == this.selectedTournament._id)
        {
          this.shownRegistrations.push(element)
        }
      });

      console.log(this.shownRegistrations)
      return true;
    }

    return false;
  }


  registeredPLayers : TournamentRegistration[] = null;
  shownRegistrations : TournamentRegistration[] = [];


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
}
