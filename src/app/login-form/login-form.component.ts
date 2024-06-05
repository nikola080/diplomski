import { Component } from '@angular/core';
import { GuestServiceService } from '../service/guest-service.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(private guestService:GuestServiceService, private router : Router){
    this.types = [
      "Academy player",
      "Recreational player",
      "Coach"
    ]
  }

  flagLogIn = 0;

  types : string[] = [];

  firstName : string = "";
  lastName : string = ""; 
  email : string = "";
  password : string = "";
  picture : File = null;
  phone : string = "";
  type : string = "";

  newPassword : string = "";
  confirmPassword : string = "";

  resetErrors()
  {
    this.typeError = ''
    this.firstNameError = ''
    this.lastNameError = ''
    this.emailError = ''
    this.passwordError = ''
    this.phoneError = ''
    this.credentialsError = ''
  }
  public revealNewPassword(){
    this.flagLogIn = 2;
  }
  public revealSignUp(){
    this.flagLogIn = 1;
    this.resetErrors()
  }

  public hideSignUp(){
    this.flagLogIn = 0;
    this.resetErrors()
  }

  public getFlagLogIn(){
    return this.flagLogIn;
  }

  firstNameError : string = "";
  lastNameError : string = "";
  emailError : string = "";
  passwordError : string = "";
  phoneError : string = "";
  typeError : string = "";

  againPasswordError : string = "";
  notLoggedInPasswordError : string = "";


  checkRegex(regex,checkWhat){
    let matched = regex.exec(checkWhat);

    if(matched == null || !(matched[0] === checkWhat)){
      return true;
    }
    return false;
  }

  checkFirstName(){
    this.firstNameError = '';
    let fname_check = /[a-zA-Z]+/;
    let regex_fname = RegExp(fname_check, 'g');
    
   if(this.checkRegex(regex_fname,this.firstName)){
    this.firstNameError = 'First name must only contain letters!';
    return false;
   }
   else {
    this.firstNameError = '';
    return true;
   }
  }

  checkLastName(){
    this.lastNameError = '';
    let lname_check = /[a-zA-Z]+/;
    let regex_lname = RegExp(lname_check, 'g');
    
   if(this.checkRegex(regex_lname,this.lastName)){
    this.lastNameError = 'Last name must only contain letters!';
    return false;
   }
   else {
    this.lastNameError = '';
    return true;
   }
   
  }

  checkPhone(){
    this.phoneError = '';
    let phone_check = /\+\d\d\d{0,1}\d+/;
    let regex_phone = RegExp(phone_check, 'g');
    
   if(this.checkRegex(regex_phone,this.phone)){
    this.phoneError = 'Incorrect phone format!';
    return false;
   }
   else {
    this.phoneError = '';
    return true;
   }
  

  }

  checkPassword(password){
    this.passwordError = '';
    this.againPasswordError = '';
    if(password.length < 8){
      this.passwordError = 'Password must be longer than 8 charachters!';
      return false;
    }
    else{

      let password_check = /[A-Z]/;
      let regex_check = RegExp(password_check, 'g');
      let matched = regex_check.exec(password);
      if(matched == null){
        this.passwordError = 'Password must containt at least 1 capital character'
        return false;
      }
      else{

        password_check = /\d/
        regex_check = RegExp(password_check, 'g');
        let matched = regex_check.exec(password);
        if(matched == null){
          this.passwordError = 'Password must containt at least 1 number!'
          return false;
        }
        else{
          password_check = /\W/
          regex_check = RegExp(password_check, 'g');
          let matched = regex_check.exec(password);
          if(matched == null){
            this.passwordError = 'Password must containt at least 1 special character!'
            return false;
          }
          else
            this.passwordError = '';
            return true;
        }
      }
    }
    
  }

  checkType(){
    this.typeError = '';
    if(this.type === ""){
      this.typeError = "You must choose type of player!"
      return false;
    }
    else{
      this.typeError = "";
      return true;
    }
  }

  approved : boolean = false;

  checkEmailUnique(){
    this.emailError = '';
    
    let checks : boolean[] = [];

    checks.push(this.checkFirstName())
    checks.push(this.checkLastName())
    checks.push(this.checkPassword(this.password))
    checks.push(this.checkPhone())
    checks.push(this.checkType())

    let email_check = /.+@.+/
    let regex_check = RegExp(email_check, 'g');
    let matched = regex_check.exec(this.email);
    if(matched && matched[0] == this.email) 
    {
      this.emailError = ''
      checks.push(true)
    }
    else
    {
      this.emailError = "Wrong email format! Should be 'something@something'";
      checks.push(false)
    }
    let checkFinal = checks[0] && checks[1] && checks[2] && checks[3] && checks[4] && checks[5]
    if(checkFinal){
     
      this.guestService.checkEmailUnique(this.email).subscribe(
        (res) =>{
          
          if(res['message'] == 1){
            let form : FormData = new FormData();
            form.append('firstName', this.firstName);
            form.append('lastName', this.lastName);
            form.append('email', this.email);
            form.append('password', this.password);
            form.append('phone', this.phone);
            form.append('type', this.type);
            if(this.picture != null){
              form.append('profilePicture', this.picture)
            }
            else {
              form.append('profilePicture','defaultProfilePicture')
            }
            console.log(form);
            this.guestService.attemptSignUp(form).subscribe(
              (res) => {
                if(res['message'] != 1){
                  console.log('Server Error, sing up failed!');
                }
                else{
                  location.reload()

                }
              }
            )
          }
          else{
            this.emailError = "Email already taken!";
          }
        }
      )
    } 
    
  }

  public profilePictureImage(event){
    this.picture = event.target.files[0];
  }

  public atemptSignUp(){
    this.checkEmailUnique();
  }
  
  credentialsError : string = '';

  public signIn(){

    this.credentialsError = ''

    let form : FormData = new FormData();

    form.append('email' , this.email);
    form.append('password' , this.password);
    console.log(this.email +  " " + this.password);
    this.guestService.singIn(form).subscribe(
      (res) => {
        if(res['message'] == 1){
          let user = res['user']
          localStorage.setItem('firstName', user['firstName']);
          localStorage.setItem('lastName',user['lastName']);
          localStorage.setItem('phone', user['phone']);
          localStorage.setItem('email', user['email']);
          localStorage.setItem('picture', user['firstName']);
          localStorage.setItem('type', user['type']);
          localStorage.setItem('picture', user['picture']);
          switch(user['type']){
            case 'Academy player' : {this.router.navigate(['academy']); break;}
            case 'Recreational player' : {this.router.navigate(['recreational']); break;}
            case 'Coach' : {this.router.navigate(['coach']); break;}
            case 'Admin' : {this.router.navigate(['admin']); break;}
          }
        }

        else
        {
          this.credentialsError = 'Wrong credentials'
        }
      }
    )
  }

  checkNewPassword(){

  }

  public changePassword(){
    this.againPasswordError = '';
    if(localStorage.getItem('email')){
      if(this.newPassword == this.confirmPassword){
        if(this.checkPassword(this.newPassword)){
          let form : FormData = new FormData();
          form.append('email', localStorage.getItem('email'))
          form.append('newPassword' , this.newPassword);
          this.guestService.changePassword(form).subscribe(
            (res) => {
              if(res['message'] != 1){
                console.log('Server Error, password change failed!');
              }
            }
          );
        }
        else{
          console.log(this.passwordError)
        }
      }
      else{
        this.againPasswordError = 'Passwords do not match!'
        console.log(this.againPasswordError);
      }
  
      
    }
    else{
      this.notLoggedInPasswordError = 'You have to be signed in before changing password!';
      console.log(this.notLoggedInPasswordError)
    }
  }

}
