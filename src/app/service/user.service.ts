import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public changeUserInputs(form){
    return this.http.post('http://localhost:4000/guest/changeUserInputs',form);
  }

  public getAllUsersToApprove(){
    let form = new FormData();
    return this.http.post('http://localhost:4000/guest/getAllUsersToApprove',form);
  }

  public getAllApprovedUsers(){
    let form = new FormData();
    return this.http.post('http://localhost:4000/guest/getAllApprovedUsers',form);
  }

  public approveUser(form){
    return this.http.post('http://localhost:4000/guest/approveUser',form);
  }

  public deleteUser(form){
    return this.http.post('http://localhost:4000/guest/deleteUser',form);
  }
  
  public findPlayer(form){
    return this.http.post('http://localhost:4000/guest/findPlayer',form);
  }

  public getAcademyPlayers(){
    return this.http.post('http://localhost:4000/guest/getAcademyPlayers',new FormData());
  }
}
