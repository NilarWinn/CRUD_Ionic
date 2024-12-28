import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { AppConstants } from 'src/app/const/app.constants';

@Component({
  selector: 'app-confirm-user',
  templateUrl: './confirm-user.page.html',
  styleUrls: ['./confirm-user.page.scss'],
})
export class ConfirmUserPage implements OnInit {
  userImg: any = '';
  userData : User;
  isEdit: Boolean;
  password : String;

  constructor(public router: Router,
    private nav: NavController,
    public storage: Storage,
    public api : ApiService, 
    public constant : AppConstants,
    public global : GlobalServiceService
    ) { 
    if (router.getCurrentNavigation().extras.state) {
      let params = router.getCurrentNavigation().extras.state;
      this.userData = params.userData;
      this.isEdit = params.isEdit;
      this.userImg = params.userImg;
      this.password = (this.userData.password.toString()).replace(/[0-9]/g, '*');
    }
    this.global.checkNetwork();
  }

  ngOnInit() { }

  // back to add new product page
  cancel() {
    this.nav.back();
  }

  ionViewWillLeave() {
    this.userData = null;
    this.isEdit = false ;
  }

  // call create user api
  createUser() {
    let postData = {
      "name" : this.userData.name,
      "email" : this.userData.email,
      "password" : this.userData.password,
      "profile" : this.userData.profile,
      "type" : this.userData.type,
      "phone" : this.userData.phone,
      "address" : this.userData.address,
      "dob" : this.userData.dob
    }
    this.storage.get("token").then(token => {
      if (token != null){
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.createUser(postData, token, this.isEdit).subscribe(data => {
            var responseData : any = data;
            this.global.stopLoader();
            if (responseData.status == "success") {
              this.router.navigate(['main/tabs/user-list']);
            }else {
              alert(responseData.error);
            }
          },err =>{
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }

}
