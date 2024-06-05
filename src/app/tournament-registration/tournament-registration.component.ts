import { Component, Input } from '@angular/core';
import { TournamentService } from '../service/tournament.service';
import { Tournament } from '../models/TournamentModel';
import { TournamentRegistration } from '../models/TournamentResgistration';


class TourRegTable{
  id : string // tournament id
  name : string
  prize : string
  starts : string
  ends : string
  count : string
  registered : boolean
}
@Component({
  selector: 'app-tournament-registration',
  templateUrl: './tournament-registration.component.html',
  styleUrls: ['./tournament-registration.component.css']
})
export class TournamentRegistrationComponent {

  constructor(private tourService : TournamentService) {}

  tournaments : Tournament[] =  null;

  regPerTour : TourRegTable[] = [];

  myRegistrations : TournamentRegistration[] = null;
  ngOnInit() {


    this.tourService.getAllRegTournaments().subscribe( (res1) => {

      if(res1['message'] == '1')
      {
        this.tournaments = res1['tours']

        for(let i = 0; i < this.tournaments.length; i++)
        {
          if(this.tournaments[i].status != '0') //extract any other than no0n-active tournament
            this.tournaments.splice(i,1)
        }
        let form = new FormData()
        form.append('player', localStorage.getItem('email'))

        this.tourService.playersRegistrations(form).subscribe( (res2) => {

          if(res2['message'] == '1')
          {
            this.myRegistrations = res2['registered']
            console.log(this.myRegistrations)
            this.tourService.registeredPerTournament().subscribe( (ret) => {
              if(ret['message'] == '1')
              {
                let rgp = ret['regPerTour']
                
                for(let i = 0; i < rgp.length; i++)
                {
                  this.regPerTour.push(new TourRegTable())

                  for(let j = 0; j < this.tournaments.length; j++)
                  {

                    if(rgp[i]._id == this.tournaments[j]._id)
                    {
                      this.regPerTour[i].name = this.tournaments[j].name
                      this.regPerTour[i].starts = this.tournaments[j].starts
                      this.regPerTour[i].ends = this.tournaments[j].ends
                      this.regPerTour[i].prize = this.tournaments[j].prize
                      break;
                    }
                  }

                  this.regPerTour[i].count  = rgp[i].count
                  this.regPerTour[i].id  = rgp[i]._id
                  this.regPerTour[i].registered = false;
                }

                for(let i = 0; i < this.myRegistrations.length; i++)
                {

                  for(let j = 0; j < this.tournaments.length; j++)
                  {
                    if(this.myRegistrations[i].tournament == this.tournaments[j]._id)
                    {
                      
                      for(let k = 0; k < this.regPerTour.length; k++)
                      {
                        if(this.regPerTour[k].id == this.tournaments[j]._id)
                        {
                          this.regPerTour[k].registered = true;
                          break;
                        }
                      }
                      break;
                    }
                  }

                }
               
                if(this.regPerTour.length != this.tournaments.length) // za slucaj kada nema ni jednog prijavljenog
                {
                  
                  this.tournaments.forEach(element1 => {
                    let flag = false;
                    this.regPerTour.forEach(element2 => {
                      if(element2.id == element1._id)
                      {
                        flag = true;
                        return;
                      }
                       
                    });

                    if(!flag) // tad treba da se ubaci
                    {
                      this.regPerTour.push(new TourRegTable())
                      this.regPerTour[this.regPerTour.length - 1].count ='0';
                      this.regPerTour[this.regPerTour.length - 1].starts = element1.starts;
                      this.regPerTour[this.regPerTour.length - 1].ends = element1.ends;
                      this.regPerTour[this.regPerTour.length - 1].id = element1._id;
                      this.regPerTour[this.regPerTour.length - 1].name = element1.name;
                      this.regPerTour[this.regPerTour.length - 1].registered = false;
                      this.regPerTour[this.regPerTour.length - 1].prize = element1.prize;
                    }
                  });
                }
              }
            })
          }

        })

      }
      else
      {
        //fuck
      }

    })

    

  }

  register(index){

    let form = new FormData()
    form.append('tournament', this.regPerTour[index].id)
    form.append('player', localStorage.getItem('email'))

    this.tourService.registerForTournament(form).subscribe( (ret) => {
      if(ret['message'] == '1')
      {
        //all good
        location.reload();
      }
    })

  }

  unregister(index){
    let id;
    for(let i = 0; i < this.myRegistrations.length; i++)
    {
      if(this.regPerTour[index].id == this.myRegistrations[i].tournament)
      {

        id = this.myRegistrations[i]._id
        break;
      }
    }

    let form = new FormData()
    form.append('id', id)

    this.tourService.unregisterFromTournament(form).subscribe( (ret) => {
      if(ret['message'] == '1')
      {
        //all good
        location.reload()
      }
      else
      {
        //well fuck
      }
    })
  }
}
