import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../service/reservation.service';
import { ReservationModel } from '../models/ReservationModel';
import { Form } from '@angular/forms';
import { Tournament } from '../models/TournamentModel';
import { start } from '@popperjs/core';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent {

  @Output("prepareForMatchCreation") prepareForMatchCreation: EventEmitter<any> = new EventEmitter();
  @Output("setReturnedTournamentMatch") setReturnedTournamentMatch: EventEmitter<any> = new EventEmitter();
  
  daysAvailable : string[] = [];
  daysAvailableInMs : number[] = [];

  reservationLengthAvailable : string[] = [];

  reservationLength : string = "";
  dateChosen : string = "";
  intervalChosen : string = "";

  @Input()
  reservationType : string;

  @Input()
  seededPlayerRes : boolean;

  @Input()
  justReservation : string;

  @Input()
  tournament : Tournament = null

  @ViewChild('courtBackground1', { static: true })
  courtBackground1: ElementRef<HTMLCanvasElement>;

  @ViewChild('courtBackground2', { static: true })
  courtBackground2: ElementRef<HTMLCanvasElement>;

  @ViewChild('courtBackground3', { static: true })
  courtBackground3: ElementRef<HTMLCanvasElement>;
  
  styleBeforeSpan1 : string = "";
  styleBeforeSpan2 : string = "";
  styleBeforeSpan3 : string = "";

  @ViewChild('profilePicture1', { static: true })
  profilePicture1: ElementRef<HTMLCanvasElement>;

  @ViewChild('profilePicture2', { static: true })
  profilePicture2: ElementRef<HTMLCanvasElement>;

  @ViewChild('profilePicture3', { static: true })
  profilePicture3 : ElementRef<HTMLCanvasElement>;
  
  profilePictureBefore1 : string = "";
  profilePictureBefore2 : string = "";
  profilePictureBefore3 : string = "";

  userType : string = "";
  resType : string = "";
  seeded : boolean = false;
  justres : string = null;

  constructor(private service : ReservationService, private http : HttpClient){
    
  }
  ngOnInit(){


    this.resType = this.reservationType;
    this.userType = localStorage.getItem('type');
    this.seeded = this.seededPlayerRes
    this.justres = this.justReservation


    let nextDateMs;

    

    if(!this.tournament)
    {
      let currentDateFormat = new Date().toLocaleDateString('en-GB');
      this.daysAvailable.push(currentDateFormat);

      let currentDateMs = Date.now();
      this.daysAvailableInMs.push(currentDateMs);

      
      for(let i = 0; i < 6; ++i){
        nextDateMs  = currentDateMs + 1000*60*60*24;
        currentDateMs = nextDateMs;
        this.daysAvailable.push(new Date(nextDateMs).toLocaleDateString('en-GB'));
        this.daysAvailableInMs.push(nextDateMs);
      
      }
    }
    else
    { 
      let startTourDate = this.tournament.starts.split("-")
      let startDate = new Date(parseInt(startTourDate[0]),parseInt(startTourDate[1]) - 1,parseInt(startTourDate[2])).getTime()

      
      let endTourDate = this.tournament.ends.split("-")
      let endDate = new Date(parseInt(endTourDate[0]),parseInt(endTourDate[1]) - 1,parseInt(endTourDate[2])).getTime()

      while(startDate <= endDate)
      {
        this.daysAvailable.push(new Date(startDate).toLocaleDateString())
        startDate += 1000*60*60*24
      }
      
    }


    this.reservationLengthAvailable.push("1 hour");
    this.reservationLengthAvailable.push("1 hour 30 minutes");
    this.reservationLengthAvailable.push("2 hours");

    this.styleBeforeSpan1 = this.courtBackground1.nativeElement.getAttribute('style');
    this.styleBeforeSpan2 = this.courtBackground2.nativeElement.getAttribute('style');
    this.styleBeforeSpan3 = this.courtBackground3.nativeElement.getAttribute('style');

    this.profilePictureBefore1 = '';
    this.profilePictureBefore2 = '';
    this.profilePictureBefore3 = '';

    //za coutr-span
    this.courtBackground1.nativeElement.addEventListener(
      "click", (evt)=>{
        this.courtBackground2.nativeElement.setAttribute('style' ,this.styleBeforeSpan2)
        this.courtBackground3.nativeElement.setAttribute('style' ,this.styleBeforeSpan3)
        this.courtBackground1.nativeElement.setAttribute('style' ,this.styleBeforeSpan1 +  " opacity : 100%;")
      }
    );

    this.courtBackground2.nativeElement.addEventListener(
      "click", (evt)=>{
        this.courtBackground1.nativeElement.setAttribute('style' ,this.styleBeforeSpan1)
        this.courtBackground3.nativeElement.setAttribute('style' ,this.styleBeforeSpan3)
        this.courtBackground2.nativeElement.setAttribute('style' ,this.styleBeforeSpan2 +  " opacity : 100%;")
      }
    );

    this.courtBackground3.nativeElement.addEventListener(
      "click", (evt)=>{
        this.courtBackground2.nativeElement.setAttribute('style' ,this.styleBeforeSpan2)
        this.courtBackground1.nativeElement.setAttribute('style' ,this.styleBeforeSpan1)
        this.courtBackground3.nativeElement.setAttribute('style' ,this.styleBeforeSpan3 +  " opacity : 100%;")
      }
    );
    
   // za pozadinu 
    this.profilePicture1.nativeElement.addEventListener(
      "click", (evt)=>{
        if(this.dateChosen != '' && this.courtChosen != '1')
          this.searched = false;

        this.courtChosen = '1';
        this.profilePicture3.nativeElement.setAttribute('style' ,this.profilePictureBefore3)
        this.profilePicture2.nativeElement.setAttribute('style' ,this.profilePictureBefore2)
        this.profilePicture1.nativeElement.setAttribute('style' ,this.profilePictureBefore1 +  "filter: brightness(30%);")
      }
    );

    this.profilePicture2.nativeElement.addEventListener(
      "click", (evt)=>{
        if(this.dateChosen != '' && this.courtChosen != '2')
          this.searched = false;

        this.courtChosen = '2';
        this.profilePicture1.nativeElement.setAttribute('style' ,this.profilePictureBefore1)
        this.profilePicture3.nativeElement.setAttribute('style' ,this.profilePictureBefore3)
        this.profilePicture2.nativeElement.setAttribute('style' ,this.profilePictureBefore2 +  " filter: brightness(30%);")
      }
    );

    this.profilePicture3.nativeElement.addEventListener(
      "click", (evt)=>{
        if(this.dateChosen != '' && this.courtChosen != '3')
          this.searched = false;

        this.courtChosen = '3';
        this.profilePicture2.nativeElement.setAttribute('style' ,this.profilePictureBefore2)
        this.profilePicture1.nativeElement.setAttribute('style' ,this.profilePictureBefore1)
        this.profilePicture3.nativeElement.setAttribute('style' ,this.profilePictureBefore3 +  " filter: brightness(30%);")
      }
    );
  }
  
  courtChosen : string = ""

  courtChosen_(which){
    this.courtChosen = which;
  }

  tempPeriods : [string,string][] = [
    ['08:00','20:00']
  ];

  searched : boolean = false;
  foundReservations : ReservationModel[]  = [];
  showSelectPeriod : boolean = false;

  checkHalfHourDifference(par1, par2){
    /*if(par1.split(":")[0] == par2.split(":")[0] || parseInt(par1.split(":")[0]) + 1 == parseInt(par2.split(":")[0])){
      if(par1.split(":")[1] == '30' || par2.split(":")[1] == '30') return true;
    }*/

    let time1 = parseInt(par1.split(':')[0]) * 60 + parseInt(par1.split(':')[1])
    let time2 = parseInt(par2.split(':')[0]) * 60 + parseInt(par2.split(':')[1]) 
    if(time2 - time1 ==  30)
      return true;
    return false;
  }
  searchFreePeriod(){
    if(this.dateChosen === "" || this.courtChosen === "") {
      //error message
      return;
    };

    this.foundReservations = [];
    this.showSelectPeriod = false;

    this.tempPeriods = [['08:00','20:00']];
    let form : FormData = new FormData();

    form.append('court', this.courtChosen);
    form.append('date', this.dateChosen);

    console.log(this.dateChosen)
    //console.log(new Date().toLocaleDateString('en-GB'))
    this.service.searchFreePeriod(form).subscribe(
      (res) => {
        
        if(res['message'] === '1'){
          //console.log(res['foundReservations'])
          
          res['foundReservations'].forEach(element => {
            this.foundReservations.push(element);
          
          });

          this.foundReservations.sort((from1, from2) =>{
            let start1 : number  = parseFloat(from1.starts.split(":")[0]) + ((from1.starts.split(":")[1] === '30') ? 0.5 : 0.0);
            let start2 : number  = parseFloat(from2.starts.split(":")[0]) + ((from2.starts.split(":")[1] === '30') ? 0.5 : 0.0);;
            
            return start1 - start2;

          })

          console.log(this.foundReservations);

          let beginning = 8;

          //console.log(this.tempPeriods[0])
          let i = 0;
          this.foundReservations.forEach(element => {

            let start = element.starts;
            let end = element.ends;

            if(this.tempPeriods[i][0] == start || this.checkHalfHourDifference(this.tempPeriods[i][0], start)){
              this.tempPeriods[i][0] = end;
            }
            else{
              this.tempPeriods[i++][1] = start;
              if(end != '20:00' && end != '19:30') this.tempPeriods.push([end,'20:00']);
            }
          });

          if(this.tempPeriods.length == 1 &&  (this.tempPeriods[0][0] == '19:30' || this.tempPeriods[0][0] == '20:00'))
            this.tempPeriods = [];

          if(this.dateChosen.toString() == new Date().toLocaleDateString('en-GB'))
          {
           
            let currDate = new Date()
            

            let currHours = currDate.getHours() * 60
            let currMinutes = currDate.getMinutes()

            let hours, minutes; 
            for(let i = 0; i < this.tempPeriods.length; i++)
            {
              hours = parseInt(this.tempPeriods[i][1].split(':')[0]) * 60
              minutes = parseInt(this.tempPeriods[i][1].split(':')[1])
              
              let num1 = currHours + currMinutes
              let num2 = hours + minutes
              console.log(num1)
              console.log(hours + minutes)
              if( (currHours + currMinutes) >= (hours + minutes)  || 
              (hours + minutes) - (currHours + currMinutes) <= 180)
                this.tempPeriods.splice(i,1)
            }

          

            let startHour =  parseInt(this.tempPeriods[0][0].split(':')[0]) * 60
            let startMinutes = parseInt(this.tempPeriods[0][0].split(':')[1])

            currHours += 60;
            if(currMinutes <= 30)
            {
              currMinutes = 30
            }
            else
            {
              currHours += 60
              currMinutes = 0;
            }

            if( (startHour + startMinutes) < (currHours + currMinutes))
            {
              if( (hours + minutes) - (currHours + currMinutes) >= 60)
              {
                this.tempPeriods[0] = [( (currHours / 60 < 10)? '0':'' ) + currHours / 60 + ':' + (currMinutes == 0 ? '00' : '30'),this.tempPeriods[i][1].split(':')[0] + ':' + this.tempPeriods[i][1].split(':')[1]]
              }
              else
                this.tempPeriods.splice(0,1)
            }
            /*if((currHours + currMinutes) - (hours + minutes) < 180)
              this.tempPeriods.splice(0,1)
            else
            {
              let startHours = parseInt(this.tempPeriods[0][0].split(':')[0]) * 60
              let startMinutes = parseInt(this.tempPeriods[0][0].split(':')[1])

              if((currHours + currMinutes) > (startHours + startMinutes))
              {
                startHours++;
                if(currMinutes < 30)
                  startMinutes = 30;
                else{
                  startHours++
                  startMinutes = 0;
                }
                
                this.tempPeriods[0] = [startHours + ':' + startMinutes,hours + ':' + minutes]
              }
            }*/

            
          }
        


        }

      }
    )
  }
  period = -1;
  setPeriod(which){
    this.period = which;
  }

  reservationFrom : string = '';
  reservationTo : string = '';
  reservationError : string = '';

  checkRegex(regex,checkWhat){
    let matched = regex.exec(checkWhat);

    if(matched == null || !(matched[0] === checkWhat)){
      return true;
    }
    return false;
  }

  makeReservation(){

    this.reservationError = '';

    let time_check = /\d\d:\d\d/;
    let regex_time1 = RegExp(time_check, 'g');
    let regex_time2 = RegExp(time_check, 'g');
   if(this.checkRegex(regex_time1,this.reservationFrom) || this.checkRegex(regex_time2,this.reservationTo)){
    this.reservationError = 'Incorrect time format!';
    return;
   }

   let from = parseInt(this.reservationFrom.split(":")[0])*60 + parseInt(this.reservationFrom.split(":")[1]);
   let to = parseInt(this.reservationTo.split(":")[0])*60 + parseInt(this.reservationTo.split(":")[1]);

   let periodFrom = parseInt(this.tempPeriods[this.period][0].split(":")[0])*60 + parseInt(this.tempPeriods[this.period][0].split(":")[1]);
   let periodTo = parseInt(this.tempPeriods[this.period][1].split(":")[0])*60 + parseInt(this.tempPeriods[this.period][1].split(":")[1]);

   if(to <= from){
    this.reservationError = 'End time must be after start time!';
    return;
   }

  
   if(from >= periodFrom && from < periodTo && to <= periodTo && to > periodFrom)
   {

    if(from % 30 == 0 && to % 30 == 0){
      if(to - from == 60 || to - from == 90 || to - from == 120){
        let form : FormData = new FormData();
        form.append('reservedByWho',localStorage.getItem('email'));
        form.append('starts',this.reservationFrom);
        form.append('ends',this.reservationTo);
        form.append('court',this.courtChosen);
        form.append('date',this.dateChosen);

        switch(this.resType){
          case 'tournament match' : form.append('type','tournament match'); break;
          case 'recreation' : form.append('type','recreation'); break;
          case 'practise' : form.append('type','practise'); break;
        }
        
        if(this.resType == 'tournament match' ) {
          this.prepareForMatchCreation.emit();
          form.append('player1', localStorage.getItem('player1'))
          if(!this.seeded){
            form.append('player2', localStorage.getItem('player2'))
            form.append('status', '1' )
          }
          else{
            form.append('player2', '')
            form.append('status', '5' )
          }
          form.append('index', localStorage.getItem('index'))
          form.append('tournament', localStorage.getItem('tournament'))

          if(this.justres) 
            form.append('justres', localStorage.getItem('justres'))
        }else if(this.resType == 'practise')
        {
          this.prepareForMatchCreation.emit();
          form.append('academy_players', localStorage.getItem('academy_players_chosen'))
        }

        this.service.insertReservationNT(form).subscribe(
          (res) => {

            if(res['message'] == '1'){

              this.searched = false;

              if(this.resType != 'tournament match') 
              {
                
                window.location.reload();

              }
              else{
                console.log(res['tourMatch'])
                localStorage.setItem('tourMatch', JSON.stringify(res['tourMatch']))
                this.setReturnedTournamentMatch.emit()
                //location.reload();
              }

            }
            else if(res['message'] == '2')
              this.reservationError = 'Someone has already reserved in meanwhile, please reload "make reservation"';

          }
        )
      }
      else{
        this.reservationError = 'Only available reservation lenghts are 1 hour,1 hour and 30 minutes and 2 hours!';
        return;
      }
    }
    else{
      this.reservationError = 'Minutes must be either 00 or 30!';
      return;
    }
    
   }
   else{
    this.reservationError = 'Start or end time does not fit chosen period!';
    return;
   }
  }
  

  isSmallScreen(){
    if(window.innerWidth < 600)
      return true;
    return false;
  }
}
