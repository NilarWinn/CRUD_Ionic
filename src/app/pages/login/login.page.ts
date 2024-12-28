import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { AppConstants } from 'src/app/const/app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  myForm: FormGroup;
  submitted = false;
  passShow = false;
  unsubscribeBackEvent: any;

  constructor(
    private platform: Platform,
    public formBuilder: FormBuilder, 
    public alertCtrl: AlertController, 
    private router: Router,
    private nav: NavController,
    public storage: Storage,
    public global : GlobalServiceService,
    public api : ApiService,
    public constant: AppConstants) { 
      this.global.checkNetwork();
    }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9]{6}/)]]
    })
  }

  // show or hide security password
  showPass(){
    this.passShow = !this.passShow;
  }

  // check form validation error
  get errorCtr() {
    return this.myForm.controls;
  }

  // call login api
  onSubmit() {
    this.submitted = true;
    if (!this.myForm.valid) {
      this.global.showAlert(this.constant.notValidData);
      return false;
    } else if(this.global.isOnline == false){
      this.global.showAlert(this.constant.networkError);
    }else{
      this.global.showLoader();
      var loginData = {
        "email": this.myForm.controls.email.value,
        "password": this.myForm.controls.password.value
      }
      this.api.login(loginData).subscribe(data => {
        var responseData : any = data;
        this.global.stopLoader()
        if (responseData.status == "success") {
          this.showAlert("Successfully", "Login is successful");
          this.storage.set("token", responseData.token);
          this.storage.set("role", responseData.type == '0' ? "admin" : "user");
        }else{
          alert(responseData.error);
        }
      },err =>{
        this.global.stopLoader();
        this.global.showAlert(this.constant.internalServerError);
      })
    }
  }

  // show alert
  showAlert(subheader,message){
    this.alertCtrl.create({
      subHeader: subheader,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.nav.navigateRoot(['main/tabs/post-list']);
        }
      },]
    }).then(res => {
      res.present();
    });
  }

  ionViewWillLeave(){
    this.myForm.reset();
    this.submitted = false;
    this.unsubscribeBackEvent.unsubscribe();
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  // show window confirm alert when double touch back button click
  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/login') {
        if (window.confirm('Do you want to exit the app?')) {
          navigator['app'].exitApp();
        }
      } 
    });
  }
}