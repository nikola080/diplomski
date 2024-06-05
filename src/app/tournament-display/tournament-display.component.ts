import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { ReservationModel } from '../models/ReservationModel';
import { TournamentService } from '../service/tournament.service';
import {TournamentMatch} from '../models/TournamentMatch'
import { GuestServiceService } from '../service/guest-service.service';
import {User} from '../models/UserModel'
import { UserService } from '../service/user.service';
import { first } from 'rxjs';
import { Tournament } from '../models/TournamentModel';

class ATournamentMatch{
  match : TournamentMatch;
  x1 : number;
  y1 : number;
  
  width : number;
  height : number;

  innerHeight : number
  innerWidth : number

  index : number

  player1_ : string;
  player2_ : string;
}

@Component({
  selector: 'app-tournament-display',
  templateUrl: './tournament-display.component.html',
  styleUrls: ['./tournament-display.component.css']
})

export class TournamentDisplayComponent {
  @Input()
  tournamentName : string

  @ViewChild('canvas1', { static: true })
  canvas1: ElementRef<HTMLCanvasElement>;
  ctx : CanvasRenderingContext2D

  tournament : Tournament = null;
  height : number
  width : number

  tourMatches : ATournamentMatch[] = [];

  selectedMatch : number = null;
  allPlayers : User[] = [];
  player1Chosen : string = null;
  player2Chosen : string = null;
  
  editedPlayer1 : string = null;
  editedPlayer2 : string = null;
  editedResult : string = null;

  editStatus : string = null;
  justRes : string = null;
  seededPlayer : boolean = false;
  treeHeight : number;

  getMousePosition(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

  constructor(private service : TournamentService, private guestService : GuestServiceService, private userService : UserService){
    
  }

  tourName : string = "";

  togglePart : boolean[] = [];

  isAdmin()
  {
    if(localStorage.getItem('type') == 'Admin') return true;
    return false;
  }


  redrawCanvas(){
    this.service.getTournamentReservations(this.tourName).subscribe( (res) =>{

      if(res['message'] === '1'){
        
        for(let i = 0; i < parseInt(res['tournament']['capacity']) - 1; i++)
        {
          this.tourMatches.push( new ATournamentMatch())
          this.togglePart.push(false);
          this.tourMatches.at(this.tourMatches.length - 1).match = null
        }
        //console.log(this.tourMatches)
        //console.log(res['playerNamesPerMatch'])
        res['matches'].sort((m1,m2) => {
          parseInt(m1['index']) > parseInt(m2['index'])
        })
        res['playerNamesPerMatch'].sort((m1,m2) => {
          parseInt(m1['index']) > parseInt(m2['index'])
        })

        for(let i = 0; i < res['matches'].length; i++){
          this.tourMatches.at(parseInt(res['matches'][i]['index'])).player1_ = res['matches'][i]['player1'];
          this.tourMatches.at(parseInt(res['matches'][i]['index'])).player2_ = res['matches'][i]['player2'];
          this.tourMatches.at(parseInt(res['matches'][i]['index'])).match = res['matches'][i];
          this.tourMatches.at(parseInt(res['matches'][i]['index'])).match.player1 = res['playerNamesPerMatch'][i]['player1'];
          this.tourMatches.at(parseInt(res['matches'][i]['index'])).match.player2 = res['playerNamesPerMatch'][i]['player2'];
        
        }

        console.log(this.tourMatches)
       
        let i = 1;
        let j = 1;
        while( i < 64 && i != parseInt(res['tournament']['capacity'])){
          i = 1 << j++;
        }

        this.treeHeight = j - 1;
        this.getStage();
        this.guestService.getAllUsers().subscribe((res) => {
          if(res['message'] == '1')
            this.allPlayers = res['users']
          if(i < 64)
            this.drawCanvas(j - 1);
        })

      }

      let form = new FormData()
      form.append('name',this.tourName)
      this.service.getTournamentByName(form).subscribe( (ret) =>{
        if(ret['message'] == '1')
        {
          this.tournament = ret['tournament']
        }
      } )
     
    })
  }

  isSmallScreen : boolean = false;

  ngOnInit(){
    this.tourName = this.tournamentName;
    let height_string = /height:\s*(\d{1,})px\s*;/;
    let regex_height = RegExp(height_string, 'g');


    let width_string = /width:\s*(\d{1,})px\s*;/;
    let regex_width = RegExp(width_string, 'g');

    let canvasHeight = regex_height.exec(this.canvas1.nativeElement.getAttribute('style'))
    let canvasWidth = regex_width.exec(this.canvas1.nativeElement.getAttribute('style'))


    console.log(this.canvas1.nativeElement.height)
    console.log(canvasWidth)
    //this.height = parseInt(canvasHeight[1])
    //this.width = parseInt(canvasWidth[1])
    this.height = this.canvas1.nativeElement.height 
    this.width = this.canvas1.nativeElement.width 
    

    if(window.innerWidth < 600)
    {
      this.isSmallScreen = true;
      this.height = 600;
      this.width = 300;
    }

    else
    {
      this.height = 800;
      this.width = 1550;
    }
    if(localStorage.getItem('type') =='Admin')
        this.canvas1.nativeElement.addEventListener("click" , (event) => {
          let mousePos = this.getMousePosition(this.canvas1.nativeElement, event);
          //console.log(mousePos)   
          let propX, propY;
          this.tourMatches.forEach(element => {

            propX = mousePos.x / this.width * window.innerWidth 
            propY = mousePos.y / this.height * window.innerHeight

            //console.log(propX, propY)
            //console.log(window.innerHeight, window.innerWidth)
            if(

              /*propX <= element.x1 + element.width &&
              propX >= element.x1 &&
              propY <= element.y1 + element.height &&
              propY >= element.y1*/
              
              
              propX <= element.x1 / element.innerWidth * window.innerWidth + element.width / element.innerWidth * window.innerWidth &&
              propX >= element.x1 / element.innerWidth * window.innerWidth &&
              propY <= element.y1 / element.innerHeight * window.innerHeight + element.height / element.innerHeight * window.innerHeight &&
              propY >= element.y1 / element.innerHeight * window.innerHeight
              
            ){
              this.seededPlayer = false;
              this.player1Chosen = null;
              this.player2Chosen = null;
              this.editStatus = null;
              this.editedResult = null;
              this.justRes = null;
              this.errorResultSyntaxMessage = null;
              this.errorStatusMessage = null;
              if(this.selectedMatch != element.index){
                this.selectedMatch = element.index

                if(this.tourMatches[this.selectedMatch].match && this.tourMatches[this.selectedMatch].match.reservation == null){
                  this.justRes = this.tourMatches[this.selectedMatch].match._id;
                }

              }
              else{
                this.selectedMatch = null;
              }    
              
            }
          });
        })
     
        this.redrawCanvas();
  }

  drawCanvas(treeHeight){
    
    const style = this.canvas1.nativeElement.getAttribute('style');
    //console.log(style);
    let dpr = window.devicePixelRatio || 1;
    this.canvas1.nativeElement.setAttribute('width',(window.innerWidth).toString()); //*4
    this.canvas1.nativeElement.setAttribute('height',(window.innerHeight ).toString()); //*2

    //let height_string = /height:\s*(\d{1,})px\s*;/;
    //let regex_height = RegExp(height_string, 'g');


   // let width_string = /width:\s*(\d{1,})px\s*;/;
    //let regex_width = RegExp(width_string, 'g');

    //console.log(this.canvas1.nativeElement.getAttribute('width'));
    //console.log(this.canvas1.nativeElement.getAttribute('height'));
    let matchedHeight =  parseInt(this.canvas1.nativeElement.getAttribute('height')); // -20
    let macthedWidth =   parseInt(this.canvas1.nativeElement.getAttribute('width')); // -20

    let hasSet = false;
    let fontSize = '0';

    if(window.innerWidth < 1000)
    {
      //matchedHeight *=6
      if(treeHeight == 5) {
        macthedWidth *=5
        fontSize = '22'
      }
      if(treeHeight == 4) {
        macthedWidth *=4
        fontSize = '26'
      }
      if(treeHeight == 3) {
        macthedWidth *=3
        fontSize = '30'
        hasSet = true;
      }
      
      
    }

    //console.log(window.innerWidth)
    //console.log(window.innerHeight)
    this.ctx = this.canvas1.nativeElement.getContext('2d'); 
    //console.log(this.ctx)
    
    let rows =  1 << (treeHeight - 1);
    let cols =  treeHeight;

    let middleLines = [];
    let lineUnit = (matchedHeight - 20) / (1 << (treeHeight))
    //console.log(lineUnit)
    middleLines.push(10);

    for(let i = 0; i < (1 << treeHeight) - 1; i++){
      middleLines.push(middleLines[i] + lineUnit);
    }
    
    this.ctx.scale(1,1)
    //console.log(middleLines)
    //this.ctx.lineWidth = 1;
    //this.ctx.strokeRect(0,0,macthedWidth/2,matchedHeight/2);
    //this.ctx.scale(1,1);
    
    if(!this.isSmallScreen)
      switch(treeHeight){
        //case 2: fontSize = '38';break;
        case 3:  if(!hasSet) fontSize = '40'; break;
        case 4: fontSize = '32'; break;
        case 5: fontSize = '22';break;
        case 6: fontSize = '4';break;
      }

    this.ctx.font = fontSize + 'px Arial';
    this.ctx.lineWidth = 1;

    let startX = 20;
    let skip = 0;
    for(let i = 0 ; i < treeHeight;i++){
      skip = (1 << i)

      if(this.isSmallScreen)
      {
        if(this.stage != i) continue
      }

      for(let j = 0; j < (1 << treeHeight - (i + 1)); j++){
        let matchIndex = 0;
        for(let k = 0; k < i; k++){
          matchIndex = matchIndex + (1 << (treeHeight - 1 - k))
        }
        matchIndex += j;

        let b = middleLines[skip] - lineUnit + 2;
        
        this.ctx.lineWidth = 2;

        //this.ctx.strokeRect(startX,b,(macthedWidth / treeHeight) * 9/ 10, 2*lineUnit - 4);
        //this.ctx.strokeRect(startX,b,(macthedWidth / treeHeight) * 8/ 10, (2*lineUnit - 4)/2);
        //this.ctx.strokeRect(startX,b,macthedWidth / treeHeight, lineUnit*2 - 4);

        if(this.tourMatches[matchIndex].match != null)
        {//245,222,179 F5DEB3
          switch(this.tourMatches[matchIndex].match.status){
            case '1': this.ctx.fillStyle = '#F5DEB3'; break;
            case '2': this.ctx.fillStyle = '#EDFC8C'; break;
            case '3': this.ctx.fillStyle = '#82FF4B'; break;
            case '41': this.ctx.fillStyle = '#F63737'; break;
            case '42': this.ctx.fillStyle = '#F63737'; break;
            case '5': this.ctx.fillStyle = '#CCCCFF'; break;
          }//CCCCFF A2A2FC
          
          if(this.tourMatches[matchIndex].match.status[0] != '4')
            this.ctx.fillRect(startX,b,(macthedWidth / treeHeight) * 9/ 10, 2*lineUnit - 4);
          else{
            if(this.tourMatches[matchIndex].match.status[1] == '1')
              this.ctx.fillRect(startX,b,(macthedWidth / treeHeight) * 9/ 10, lineUnit - 2);
            else
              this.ctx.fillRect(startX,b + lineUnit - 2,(macthedWidth / treeHeight) * 9/ 10, lineUnit - 2);
          }
        }
        this.ctx.strokeRect(startX,b,(macthedWidth / treeHeight) * 9/ 10, 2*lineUnit - 4);
        let xSize = (macthedWidth / treeHeight) * 9/ 10;
        //middle line
        this.ctx.beginPath();
        this.ctx.moveTo(startX, middleLines[skip]);
        this.ctx.lineTo(startX + xSize,middleLines[skip])
        this.ctx.stroke();

        //firstVerical line
        this.ctx.beginPath();
        this.ctx.moveTo(startX + xSize / 10 * 7, middleLines[skip] - lineUnit + 2);
        this.ctx.lineTo(startX + xSize / 10 * 7 ,middleLines[skip] + lineUnit - 2)
        this.ctx.stroke();

        //secondVertical line
        this.ctx.beginPath();
        this.ctx.moveTo(startX + xSize / 10 * 8, middleLines[skip] - lineUnit + 2);
        this.ctx.lineTo(startX + xSize / 10 * 8 ,middleLines[skip] + lineUnit - 2)
        this.ctx.stroke();

        //thirdVertical line
        this.ctx.beginPath();
        this.ctx.moveTo(startX + xSize / 10 * 9, middleLines[skip] - lineUnit + 2);
        this.ctx.lineTo(startX + xSize / 10 * 9 ,middleLines[skip] + lineUnit - 2)
        this.ctx.stroke();
        
        this.tourMatches[matchIndex].innerHeight = window.innerHeight;
        this.tourMatches[matchIndex].innerWidth = window.innerWidth;
        this.tourMatches[matchIndex].x1 = startX;
        this.tourMatches[matchIndex].width = ((macthedWidth / treeHeight) * 9/ 10);
        this.tourMatches[matchIndex].y1 = b;
        this.tourMatches[matchIndex].height = 2*lineUnit - 4;
        this.tourMatches[matchIndex].index = matchIndex

       
        if(this.tourMatches[matchIndex].match){
          this.ctx.fillStyle = "black"
  
          let xSetOffset, ySetOffset;
          switch(this.treeHeight){
            case 3: xSetOffset = 16, ySetOffset = 35;break;
            case 4: xSetOffset = 14; ySetOffset = 18; break;
            case 5: xSetOffset = 5; ySetOffset = 7; break;
          }
          
          if(this.tourMatches[matchIndex].match.status == '5' || this.tourMatches[matchIndex].match.status == '42'){
            this.ctx.font = 'bold ' + fontSize + 'px Arial';
            this.ctx.fillText(this.tourMatches[matchIndex].match.player1, startX + 2, middleLines[skip] - ySetOffset/2);
            this.ctx.font = fontSize + 'px Arial';
          }
            else if(this.tourMatches[matchIndex].match.status == '3' && this.findWinner(matchIndex) == this.tourMatches[matchIndex].match.player1){

              this.ctx.font = 'bold ' + fontSize + 'px Arial';
              this.ctx.fillText(this.tourMatches[matchIndex].match.player1, startX + 2, middleLines[skip] - ySetOffset/2);
              this.ctx.font = fontSize + 'px Arial';
              
            }
            else{
                this.ctx.fillText(this.tourMatches[matchIndex].match.player1, startX + 2, middleLines[skip] - ySetOffset/2);
              }

          if(this.tourMatches[matchIndex].match.status == '41'){
            this.ctx.font = 'bold ' + fontSize + 'px Arial';
            this.ctx.fillText(this.tourMatches[matchIndex].match.player2, startX + 2, middleLines[skip] + lineUnit - ySetOffset/2);
            this.ctx.font = fontSize + 'px Arial';
          }
            else if(this.tourMatches[matchIndex].match.status == '3' && this.findWinner(matchIndex) == this.tourMatches[matchIndex].match.player2){
              this.ctx.font = 'bold ' + fontSize + 'px Arial';
              this.ctx.fillText(this.tourMatches[matchIndex].match.player2, startX + 2, middleLines[skip] + lineUnit - ySetOffset/2);
              this.ctx.font = fontSize + 'px Arial';
            }else if(this.tourMatches[matchIndex].match.status != '5'){             
                this.ctx.fillText(this.tourMatches[matchIndex].match.player2, startX + 2, middleLines[skip] + lineUnit - ySetOffset/2);
              }
            //

          if(this.tourMatches[matchIndex].match.result != ''){
            // obraditi rezultat i ispisati 
            let results = this.tourMatches[matchIndex].match.result.split(';')

            // 1. set
            if(results.length > 0){
              this.ctx.fillText(results[0].split(':')[0], startX + xSize / 10 * 7 + xSize / 30, middleLines[skip] - xSetOffset);
              this.ctx.fillText(results[0].split(':')[1], startX + xSize / 10 * 7 + xSize / 30, middleLines[skip] + lineUnit - ySetOffset);  
            }
           
            //2. set
            if(results.length > 1){
              this.ctx.fillText(results[1].split(':')[0], startX + xSize / 10 * 8 + xSize / 30, middleLines[skip] - xSetOffset);
              this.ctx.fillText(results[1].split(':')[1], startX + xSize / 10 * 8 + xSize / 30, middleLines[skip] + lineUnit - ySetOffset);
            }
            //3. set
            if(results.length > 2){
              this.ctx.fillText(results[2].split(':')[0], startX + xSize / 10 * 9 + xSize / 30, middleLines[skip] - xSetOffset);
              this.ctx.fillText(results[2].split(':')[1], startX + xSize / 10 * 9 + xSize / 30, middleLines[skip] + lineUnit - ySetOffset);
            }
           
          }
        }
        
        skip = skip + (1 << i + 1);
      }
      startX += macthedWidth / treeHeight;
    }
   
    //console.log(this.tourMatches)

  }


  prepareForMatchCreation(){
    if(!this.justRes){
      
      localStorage.setItem('player1', this.player1Chosen)
      localStorage.setItem('player2', this.player2Chosen)
      localStorage.setItem('index', this.selectedMatch.toString())
      
    }
    else{
      localStorage.setItem('justres', this.justRes)
      localStorage.setItem('player1', this.tourMatches[this.selectedMatch].player1_)
      localStorage.setItem('player2', this.tourMatches[this.selectedMatch].player1_)
      localStorage.setItem('index', this.tourMatches[this.selectedMatch].match.index)
    }
    localStorage.setItem('tournament', this.tourName)  
  }

  setReturnedTournamentMatch(){
    //let index : number = parseInt(localStorage.getItem('index'))
    this.redrawCanvas();
  }

  checkResultForm(){
    return false;
  }

  checkIfMatchIsFinished(){ // greska kad je vec povukao
    if(this.seededPlayer) return true;

    if(!this.editedResult && this.tourMatches[this.selectedMatch].match.status == '1') return false;
    if(!this.editedResult && this.tourMatches[this.selectedMatch].match.status == '2') return false;
    if(!this.editedResult && this.tourMatches[this.selectedMatch].match.status[0] == '4') return true;


    if(this.editedResult.split(';').length == 3){
      if(parseInt(this.editedResult.split(';')[2].split(':')[0]) <= 4){
          if(parseInt(this.editedResult.split(';')[2].split(':')[1]) == 6){
            return true;
          }
       }
       else
        if(parseInt(this.editedResult.split(';')[2].split(':')[1]) <= 4){
          if(parseInt(this.editedResult.split(';')[2].split(':')[0]) == 6){
            return true;
          }
        }
        else{

          if(Math.abs( parseInt(this.editedResult.split(';')[2].split(':')[1]) - parseInt(this.editedResult.split(';')[2].split(':')[0]) ) > 1 
          /*|| parseInt(this.editedResult.split(';')[2].split(':')[1]) == 7 ||  parseInt(this.editedResult.split(';')[2].split(':')[0]) == 7*/){ // za slucaj da se ne igra kraljevski set
            return true;
          }
        }
    }else{
      if(this.editedResult.split(';').length == 2){
        let firstSetWinner;

        if(  parseInt(this.editedResult.split(';')[0].split(':')[0])  >  parseInt(this.editedResult.split(';')[0].split(':')[1]) )
          firstSetWinner = 0;
        else 
          firstSetWinner = 1;

        if(parseInt(this.editedResult.split(';')[1].split(':')[firstSetWinner]) == 6
            || parseInt(this.editedResult.split(';')[1].split(':')[firstSetWinner]) == 7)
            return true;

      }
    }
    return false;
  }

  resultError : string = null;
  checkResultSyntax(){

    let wholeReg = /^(\d+:\d+){0,1}(;\d+:\d+){0,1}(;\d+:\d+){0,1}$/.test(this.editedResult)

    //console.log(wholeReg)
    if(!wholeReg) return false;
    let resultRegex = /(\d+:\d+){0,1}(;\d+:\d+){0,1}(;\d+:\d+){0,1}/
    let expr : RegExp = new RegExp(resultRegex,'g')

    let execResult = expr.exec(this.editedResult)

    //console.log(execResult)
    if(execResult[0].split(';').length == 1)
    {
      
      if(parseInt(execResult[0].split(';')[0].split(':')[0]) > 7 || parseInt(execResult[0].split(';')[0].split(':')[1]) > 7
        || (parseInt(execResult[0].split(';')[0].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[0].split(':')[1]) == 7)
        || (parseInt(execResult[0].split(';')[0].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[0].split(':')[1]) < 5) 
        || (parseInt(execResult[0].split(';')[0].split(':')[0]) < 5 && parseInt(execResult[0].split(';')[0].split(':')[1]) == 7)
      )    
      {
        //error msg
        return false;
      }
       
    }
    else{
        if(execResult[0].split(';').length > 3) return false;
        if(parseInt(execResult[0].split(';')[0].split(':')[0]) > 7 || parseInt(execResult[0].split(';')[0].split(':')[1]) > 7
          || (parseInt(execResult[0].split(';')[0].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[0].split(':')[1]) == 7)
          || (parseInt(execResult[0].split(';')[0].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[0].split(':')[1]) < 5) 
          || (parseInt(execResult[0].split(';')[0].split(':')[0]) < 5 && parseInt(execResult[0].split(';')[0].split(':')[1]) == 7)
        )
        {
          //error msg
          return false;
        }
        else{
          let firstSetWinner = null;
          if(parseInt(execResult[0].split(';')[0].split(':')[0]) == 7 || parseInt(execResult[0].split(';')[0].split(':')[0]) == 6)
              firstSetWinner = 0;
          if(parseInt(execResult[0].split(';')[0].split(':')[1]) == 7 || (parseInt(execResult[0].split(';')[0].split(':')[1]) == 6 && parseInt(execResult[0].split(';')[0].split(':')[0]) < 5))
              firstSetWinner = 1;
          if(parseInt(execResult[0].split(';')[0].split(':')[1]) == 6 && parseInt(execResult[0].split(';')[0].split(':')[0]) == 6)
            
              firstSetWinner = null;
          
          if(firstSetWinner == null)
          {
            // error msg
            return false;
          }
          else{
            if(execResult[0].split(';').length == 2)
            {

              if(firstSetWinner == null || parseInt(execResult[0].split(';')[1].split(':')[0]) > 7 || parseInt(execResult[0].split(';')[1].split(':')[1]) > 7
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[1].split(':')[1]) == 7)
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[1].split(':')[1]) < 5) 
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) < 5 && parseInt(execResult[0].split(';')[1].split(':')[1]) == 7))
              {
                //error msg
                return false;
              }
            }
            else
            {
              if(firstSetWinner == null || parseInt(execResult[0].split(';')[1].split(':')[0]) > 7 || parseInt(execResult[0].split(';')[1].split(':')[1]) > 7
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[1].split(':')[1]) == 7)
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) == 7 && parseInt(execResult[0].split(';')[1].split(':')[1]) < 5) 
                  || (parseInt(execResult[0].split(';')[1].split(':')[0]) < 5 && parseInt(execResult[0].split(';')[1].split(':')[1]) == 7))
              {
                //error msg
                return false;
              }
              let secondSetWinner = null;
              if(parseInt(execResult[0].split(';')[1].split(':')[0]) == 7 || parseInt(execResult[0].split(';')[1].split(':')[0]) == 6)
                  secondSetWinner = 0;
              if(parseInt(execResult[0].split(';')[1].split(':')[1]) == 7 || (parseInt(execResult[0].split(';')[1].split(':')[1]) == 6 && parseInt(execResult[0].split(';')[1].split(':')[0]) < 5))
                  secondSetWinner = 1;
              if(parseInt(execResult[0].split(';')[1].split(':')[1]) == 6 && parseInt(execResult[0].split(';')[1].split(':')[0]) == 6)
                  secondSetWinner = null;

              if(secondSetWinner == null || firstSetWinner == secondSetWinner){

                // error player already won
                return false;

              }
              else
                if((parseInt(execResult[0].split(';')[2].split(':')[0]) > 6 && parseInt(execResult[0].split(';')[2].split(':')[1]) < 5)
                    || (parseInt(execResult[0].split(';')[2].split(':')[0]) < 5 && parseInt(execResult[0].split(';')[2].split(':')[1]) > 6
                    || (
                        parseInt(execResult[0].split(';')[2].split(':')[0]) > 6 && parseInt(execResult[0].split(';')[2].split(':')[1]) > 6
                        && Math.abs(parseInt(execResult[0].split(';')[2].split(':')[0]) - parseInt(execResult[0].split(';')[2].split(':')[1])) > 2
                       )
                       )
                  )
                {
                   // error 3d set
                   return false;
                }
            }

          }
        }
        

    }
    
    return true;
    

  }

  
  errorStatusMessage : string = null;
  errorResultSyntaxMessage : string = null;


  editMatch(){
    
    this.errorStatusMessage = null;
    this.errorResultSyntaxMessage = null;

    let createNext = false;
    let form = new FormData();

    let nextIndex = -1, pairIndex = -1;
    
    if(!this.seededPlayer && this.tourMatches[this.selectedMatch].match) form.append('_id', this.tourMatches[this.selectedMatch].match._id)
    else {
      form.append('player1', this.player1Chosen)
      form.append('status', '5')
      form.append('tournament', this.tourName)
      form.append('index', this.selectedMatch.toString())
    }
    if(this.editedPlayer1) form.append('player1', this.editedPlayer1)
    if(this.editedPlayer2) form.append('player2', this.editedPlayer2)
    if(this.editStatus && !this.editedResult){

      form.append('status', this.editStatus)

    }


    if(this.editedResult) {
      if(this.editedResult != '-'){
        
        if(!this.checkResultSyntax()){
          this.errorResultSyntaxMessage = 'Wrong result syntax!'
          return;
        }
        if(this.checkIfMatchIsFinished()){
          
          if(this.editStatus && (this.editStatus == '2' || this.editStatus[0] == '4')){
            
            this.errorStatusMessage = 'Cannot set this status on a result that indicates completed match!'
            return;
          }
          else{
            form.append('status', '3')
            this.tourMatches[this.selectedMatch].match.status = '3'
          }
            
        }
        else{
          if(!this.editStatus){
            form.append('status', '2')
            this.tourMatches[this.selectedMatch].match.status = '2'
          }
          else{
            form.append('status', this.editStatus)
            this.tourMatches[this.selectedMatch].match.status = this.editStatus
          }
          
        }
          
        form.append('result', this.editedResult)
      }
      else{
        if(this.editStatus){
          this.errorStatusMessage = "Cannot set status of match if it's begin reseted!"
          return;
        }
        form.append('status', '1')
        form.append('result', '')
      }
  
    }

    
    //console.log(form)
    this.service.editTournamentMatch(form).subscribe((res) =>{
     //console.log(res['message'])
     //console.log(res['match'])
      if(res['message'] == '1'){
        console.log(this.editedPlayer1)
        if(this.editStatus)
          this.tourMatches[this.selectedMatch].match.status = this.editStatus;

        this.editStatus = null;
        
        if(this.editedResult)
            this.tourMatches[this.selectedMatch].match.result = this.editedResult;

        if(this.editedPlayer1){
          this.tourMatches[this.selectedMatch].player1_= this.editedPlayer1;
          this.tourMatches[this.selectedMatch].match.player1 = this.userName(this.editedPlayer1)
        }
            
        if(this.editedPlayer2)
        {
          this.tourMatches[this.selectedMatch].player2_= this.editedPlayer2;
          this.tourMatches[this.selectedMatch].match.player2 = this.userName(this.editedPlayer2)
        }
        

        if(this.seededPlayer){
          this.tourMatches[this.selectedMatch].match = res['match']
          this.tourMatches[this.selectedMatch].player1_ = this.player1Chosen
          this.tourMatches[this.selectedMatch].player2_ = ''
          this.tourMatches[this.selectedMatch].match.player1 = this.userName(this.player1Chosen)
          this.tourMatches[this.selectedMatch].match.player2 = ''
          
        }

          if(this.checkIfMatchIsFinished()) {
            
            if(this.seededPlayer || (this.selectedMatch != ((1 << this.treeHeight) - 2) && this.tourMatches[this.selectedMatch].match.status != '1' && this.tourMatches[this.selectedMatch].match.status != '2')){
      
              pairIndex = (this.selectedMatch & 1) ? this.selectedMatch - 1 : this.selectedMatch + 1;
              if(this.tourMatches[pairIndex].match && (this.tourMatches[pairIndex].match.status != '1' && this.tourMatches[pairIndex].match.status != '2')){
                createNext = true;
                let tmp = (1 << (this.treeHeight - 1));
                let tmp1 = 0;
                while(tmp <= pairIndex)
                {
                  tmp1 = tmp
                  tmp |= tmp >> 1; // 0000 1000 => 0001 1000
                }

                nextIndex = tmp + ((((pairIndex & 1) ? (this.selectedMatch) : pairIndex) % (tmp - tmp1)) / 2)
                
                if(this.tourMatches[nextIndex].match)
                  createNext = false;
              }
              
              //console.log('indeks: ' + nextIndex)
      
            }

            if(createNext){

              let createNextForm : FormData = new FormData();
              let a,b
              
              
              createNextForm.append('player1', this.findWinner_((this.selectedMatch > pairIndex) ? pairIndex : this.selectedMatch))
              createNextForm.append('player2', this.findWinner_((this.selectedMatch > pairIndex) ? this.selectedMatch : pairIndex))
              createNextForm.append('index', nextIndex.toString())
              createNextForm.append('tournament', this.tourName)
    
              this.service.createTournamentMatch(createNextForm).subscribe((res) => {
                if(res['message'] == '1'){
                  this.tourMatches[nextIndex].match = res['match']
                  this.tourMatches[nextIndex].match.player1 = this.userName(this.tourMatches[nextIndex].match.player1)
                  this.tourMatches[nextIndex].match.player2 = this.userName(this.tourMatches[nextIndex].match.player2)
                  this.drawCanvas(this.treeHeight)
                  //location.reload();
                }
              })
    
            }
      
          }
          //location.reload();
          this.drawCanvas(this.treeHeight)
      }
    })
  }

  deleteMatch(){
    let form : FormData = new FormData();

    form.append('match_id', this.tourMatches[this.selectedMatch].match._id)
    if(this.tourMatches[this.selectedMatch].match.reservation != null){   
      form.append('resId', this.tourMatches[this.selectedMatch].match.reservation)
    }

    this.service.deleteTournamentMatch(form).subscribe((ret) => {
      console.log(ret['message'] )
      if(ret['message'] == '1')
       {
        this.tourMatches[this.selectedMatch].match = null;
        this.drawCanvas(this.treeHeight);
       }
        //location.reload()
    })
  }

  findWinner(index){
    if(this.tourMatches[index].match.status == '5') return this.tourMatches[index].match.player1
    if(this.tourMatches[index].match.status == '41') return this.tourMatches[index].match.player2
    if(this.tourMatches[index].match.status == '42') return this.tourMatches[index].match.player1

    if(this.tourMatches[index].match.status != '3') return '-1'
    let res = this.tourMatches[index].match.result.split(';')

    if(parseInt(res[res.length - 1].split(':')[0]) > parseInt(res[res.length - 1].split(':')[1])) return this.tourMatches[index].match.player1
    else return this.tourMatches[index].match.player2

  }

  findWinner_(index){

    if(this.seededPlayer) return this.tourMatches[index].player1_
    if(this.tourMatches[index].match.status == '5') return this.tourMatches[index].player1_
    if(this.tourMatches[index].match.status == '41') return this.tourMatches[index].player2_
    if(this.tourMatches[index].match.status == '42') return this.tourMatches[index].player1_

    if(this.tourMatches[index].match.status != '3') return '-1'
    let res = this.tourMatches[index].match.result.split(';')

    if(parseInt(res[res.length - 1].split(':')[0]) > parseInt(res[res.length - 1].split(':')[1])) return this.tourMatches[index].player1_
    else return this.tourMatches[index].player2_

  }
  
  userName(email){
    let ret = ''
    this.allPlayers.forEach(element => {
      if(element.email == email) {
        ret = element.firstName + ' ' + element.lastName
        return
      }
    });
    return ret;
  }
  displayDelete : string = 'none'
  displayFinishTour : string = 'none'

  displayDeleteTournament : string = 'none'
  displayActivateTournament : string = 'none'

  activateTournament()
  { 
    let form = new FormData();
    form.append('id', this.tournament._id)
    this.service.activateTournament(form).subscribe( (res) => {
      if(res['message'] == '1')
      {
        //all good
       location.reload()
      }
      else
      {
        //fuck
      }
    })
  }

  deleteTournament()
  {
    let form = new FormData();
    form.append('id', this.tournament._id)
    this.service.deleteTournament(form).subscribe( (res) => {
      if(res['message'] == '1')
      {
        //all good
        location.reload()
      }
      else
      {
        //fuck
      }
    })
  }

  finishTournament()
  {
    let form = new FormData()

    form.append('id', this.tournament._id)

    this.service.finishTournament(form).subscribe( (ret) => {
      if(ret['message'] == '1')
      {
        location.reload()
      }
    })
  }

  stage : number = 0;

  incStage()
  {
    console.log(this.stage)
    if(this.stage < this.treeHeight - 1)
      this.stage++;

      this.drawCanvas(this.treeHeight)

      this.getStage()
  }

  decStage()
  {
    
    console.log(this.stage)
    if(this.stage > 0)
      this.stage--;
    
      this.drawCanvas(this.treeHeight)
      
      this.getStage()
  }

  stageString : string = null;
  getStage()
  {
    switch(this.treeHeight)
    {

      case 3: {
        switch(this.stage)
        {
          case 0 : this.stageString = "QF"; break;
          case 1 : this.stageString = "SF"; break;
          case 2 : this.stageString = "F"; break;
        }
      } break;
      case 4: {
        switch(this.stage)
        {
          case 0 : this.stageString = "1R"; break;
          case 1 : this.stageString = "QF"; break;
          case 2 : this.stageString = "SF"; break;
          case 3 : this.stageString = "F"; break;
        }

      } break;
      case 5: {
        switch(this.stage)
        {
          case 0 : this.stageString = "1R"; break;
          case 1 : this.stageString = "2R"; break;
          case 2 : this.stageString = "QF"; break;
          case 3 : this.stageString = "SF"; break;
          case 4 : this.stageString = "F"; break;
        }

      } break;

    }
  }

}
