import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http : HttpClient) { }

  public searchFreePeriod(form:FormData){
    return this.http.post('http://localhost:4000/reservation/searchFreePeriod',form);
  }

  public insertReservationNT(form:FormData){
    return this.http.post('http://localhost:4000/reservation/insertReservationNT',form);
  }

  public cancelReservation(form){
    return this.http.post('http://localhost:4000/reservation/cancelReservation',form);
  }
  public terminateReservation(form){
    return this.http.post('http://localhost:4000/reservation/terminateReservation',form);
  }
  public getAllReservations(){
    return this.http.post('http://localhost:4000/reservation/getAllReservations',new FormData());
  }
  public getMyReservations(form){
    return this.http.post('http://localhost:4000/reservation/getMyReservations', form);
  }
  public makePractise(form){
    return this.http.post('http://localhost:4000/reservation/makePractise', form);
  }
  public myPractises(form){
    return this.http.post('http://localhost:4000/reservation/myPractises', form);
  }
  public batchReservationDelete(form){
    return this.http.post('http://localhost:4000/reservation/batchReservationDelete', form);
  }
  public editReservation(form){
    return this.http.post('http://localhost:4000/reservation/editReservation', form);
  }
  public getCoachesPractises(form){
    return this.http.post('http://localhost:4000/reservation/getCoachesPractises', form);
  }

  public coachDiary(form){
    return this.http.post('http://localhost:4000/reservation/coachDiary', form);
  }


}
