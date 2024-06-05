import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuestServiceService {

  constructor(private http: HttpClient) { }

  public attemptSignUp(form:FormData){
    return this.http.post('http://localhost:4000/guest/attemptSignUp',form);
  }
  public checkEmailUnique(email:string){

    let data = new FormData()
    data.append('email',email);

    return this.http.post('http://localhost:4000/guest/checkEmailUnique',data);

  }

  public singIn(form:FormData){
    return this.http.post('http://localhost:4000/guest/singIn',form);
  }

  public changePassword(form:FormData){
    return this.http.post('http://localhost:4000/guest/changePassword',form);
  }

  public getAllUsers(){
    let form = new FormData();
    return this.http.post('http://localhost:4000/guest/getAllUsers',form);
  }
  
}
