import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  loadedFirstName : string = "";
  loadedLastName : string = "";
  loadedPicture : string = "defaul_picture.png";
  loadedPhone : string = "";
  loadedType : string = "";
  loadedEmail : string = "";
  firstNameError: string;
  lastNameError: string;
  phoneError: string = ''
  passwordError: string;

  ngOnInit(){
    if(localStorage.getItem('email')){
      this.loadedFirstName = localStorage.getItem('firstName');
      this.loadedLastName = localStorage.getItem('lastName');
      this.loadedPicture = localStorage.getItem('picture');
      this.loadedPhone = localStorage.getItem('phone');
      this.loadedType = localStorage.getItem('type');
      this.loadedEmail = localStorage.getItem('email');
      if(!this.loadedPicture){
        this.loadedPicture = 'defaul_picture.png';
      }
    }
  }

  constructor(private userService:UserService, private router : Router){
    
  }
  picture : File = null;

  public profilePictureImage(event){
    this.newPicture = event.target.files[0];
  }

  openChange : boolean[] = [false,false,false,false];
  newFirstName : string ="";
  newLastName : string ="";
  newPhone : string ="";
  newEmail : string ="";
  newPicture : File = null;

  emailExistsError : string = '';

  toggleForm(n:number){
    this.openChange[n] = !this.openChange[n];
  }




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
    
   if(this.checkRegex(regex_fname, this.newFirstName)){
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
    
   if(this.checkRegex(regex_lname,this.newLastName)){
    this.lastNameError = 'Last name must only contain letters!';
    return false;
   }
   else {
    this.lastNameError = '';
    return true;
   }
   
  }

  checkPhone(){
   
    let phone_check = /\+\d\d\d{0,1}\d+/;
    let regex_phone = RegExp(phone_check, 'g');
    
    if(this.checkRegex(regex_phone,this.newPhone)){
      this.phoneError = 'Incorrect phone format!';
      return false;
    }
    else {
      this.phoneError = '';
      return true;
    }
  

  }

  checkEmail(){
    let email_check = /.+@.+/
    let regex_check = RegExp(email_check, 'g');
    let matched = regex_check.exec(this.newEmail);
    if(matched && matched[0] == this.newEmail)
      return true;
    else return false;
  }

  changeInputs(){
    this.emailExistsError = '';
    this.phoneError = ''


    let form : FormData = new FormData();
    form.append('which', this.loadedEmail);
    if(this.newFirstName != '')
    {

      if(this.checkFirstName())
        form.append('firstName', this.newFirstName)
      else
        return;

    } 
    else
      form.append('firstName', '')

    if(this.newLastName != '')
    {

      if(this.checkLastName())
        form.append('lastName', this.newLastName)
      else
        return;

    } 
    else
      form.append('lastName', '')

    if(this.newPhone != '')
    {

      if(this.checkPhone())
        form.append('phone', this.newPhone)
      else
        return;

    } 
    else
      form.append('phone', '')

    if(this.newEmail != '')
    {

      if(this.checkEmail())
        form.append('newEmail', this.newEmail)
      else
        return;

    }
    else
      form.append('newEmail', '')

    if(this.newPicture != null)
    {

      form.append('profilePicture', this.newPicture)

    }

    this.userService.changeUserInputs(form).subscribe(
      (res) => {

        if(res['message'] == '1')
        {
          if(this.newFirstName !== ''){
            localStorage.removeItem('firstName');
            localStorage.setItem('firstName', this.newFirstName);
          }
          
          if(this.newLastName !== ''){
            localStorage.removeItem('lastName');
            localStorage.setItem('lastName', this.newLastName);
          }
          
          if(this.newPhone !== ''){
            localStorage.removeItem('phone');
            localStorage.setItem('phone', this.newPhone);
          }
          
          if(this.newPicture != null){
            localStorage.removeItem('picture');
            localStorage.setItem('picture', res['picture']);
          }
  
          if(this.newEmail !== ''){
            if(res['message'] === '1'){
              localStorage.removeItem('email');
              localStorage.setItem('email', this.newEmail);
            }
           
            else{
              this.emailExistsError = 'Email already in use!';
              return;
            }
            
          }
          
          location.reload();
        }
        else{
          this.emailExistsError = 'That email already exists!'
        }
        
       
      }
    )

  }

  isSmallScreen()
  {
    if(window.innerWidth < 600)
      return true;
    return false;
  }
}
