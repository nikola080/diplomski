import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(private http : HttpClient) { }

  getAllTournaments(){
    let form : FormData = new FormData();
    return this.http.post('http://localhost:4000/tournament/getAllTournaments',form);
  }
  getAllActiveTournaments(){
    let form : FormData = new FormData();
    return this.http.post('http://localhost:4000/tournament/getAllActiveTournaments',form);
  }

  getTournamentReservations(tourName){
    let form : FormData = new FormData();
    form.append('name' , tourName)
    return this.http.post('http://localhost:4000/tournament/getTournamentReservations',form);
  }

  createNewTournament(form : FormData){
    return this.http.post('http://localhost:4000/tournament/createNewTournament',form);

  }

  editTournamentMatch(form : FormData){
    return this.http.post('http://localhost:4000/tournament/editTournamentMatch',form);
  }

  createTournamentMatch(form : FormData){
    return this.http.post('http://localhost:4000/tournament/createTournamentMatch',form);
  }
  deleteTournamentMatch(form : FormData){
    return this.http.post('http://localhost:4000/tournament/deleteTournamentMatch',form);
  }

  getTournamentByName(form : FormData){
    return this.http.post('http://localhost:4000/tournament/getTournamentByName',form);
  }

  activateTournament(form : FormData){
    return this.http.post('http://localhost:4000/tournament/activateTournament',form);
  }

  deleteTournament(form : FormData){
    return this.http.post('http://localhost:4000/tournament/deleteTournament',form);
  }
  registerForTournament(form : FormData){
    return this.http.post('http://localhost:4000/tournament/registerForTournament',form);
  }
  registeredPlayers(form : FormData){
    return this.http.post('http://localhost:4000/tournament/registeredPlayers',form);
  }
  playersRegistrations(form : FormData){
    return this.http.post('http://localhost:4000/tournament/playersRegistrations',form);
  }
  registeredPerTournament(){
    return this.http.post('http://localhost:4000/tournament/registeredPerTournament',new FormData());
  }
  getAllRegTournaments(){
    return this.http.post('http://localhost:4000/tournament/getAllRegTournaments',new FormData());
  }
  unregisterFromTournament(form){
    return this.http.post('http://localhost:4000/tournament/unregisterFromTournament',form);
  }
  finishTournament(form){
    return this.http.post('http://localhost:4000/tournament/finishTournament',form);
  }

}
