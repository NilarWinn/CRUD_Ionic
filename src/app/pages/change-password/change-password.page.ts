import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppConstants } from 'src/app/const/app.constants';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  pwdShow = false;
  confirmPwdShow = false;
  oldPasswordShow = false;

  constructor(private nav: NavController,
    public formBuilder: FormBuilder,
    public constant : AppConstants,
    public global : GlobalServiceService) {
      global.checkNetwork();
     }
 
  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/[0-9]{6}/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9]{6}/)]],
      confirmPwd: ['', [Validators.required, Validators.pattern(/[0-9]{6}/) ]],
    });
  }

  // check form validation error
  get errorCtr() {
    return this.changePasswordForm.controls;
  }

  // check match new password
  matchingPasswords() {
    return this.changePasswordForm.controls.password.value == this.changePasswordForm.controls.confirmPwd.value;
   }

  // call change password api
  onSubmit(){
    this.submitted = true;
    if (!this.changePasswordForm.valid) {
      this.global.showAlert(this.constant.notValidData);
      return false;
    } else {
      if (this.matchingPasswords() == false){
        return false;
      }
      // call change password api
      if (this.global.isOnline === true){
        this.nav.back();
      }
    }
  }

  //show or hide security key password 
  showPass(value, type){
    if (type == 'password'){
      this.pwdShow = !value;
    }else if (type == 'oldPassword') {
      this.oldPasswordShow = !value;
    }else{
      this.confirmPwdShow = !value;
    }
  }

  // reset the form data
  clear() {
    this.changePasswordForm.reset();
  }

}
