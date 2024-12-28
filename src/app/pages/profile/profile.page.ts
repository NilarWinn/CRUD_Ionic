import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage';
import { AppConstants } from 'src/app/const/app.constants';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userImg: any = '';
  userData : User;
  isEdit: Boolean;
  password : String;
  userList = [];

  constructor(public router: Router,
    private api : ApiService,
    private nav: NavController,
    public storage: Storage,
    public constant : AppConstants,
    public global : GlobalServiceService) { 
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getProfile();
  }

  // get user data
  getProfile() {
    this.storage.get("token").then( token => {
      if (token != null) {
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.getProfile().subscribe(data => {
            this.global.stopLoader();
            var responseData : any = data;
            if (responseData.success == true) {
              var dataList:any = responseData.data.docs;
              this.userData = dataList[0];
            }
            this.password = (this.userData.password.toString()).replace(/[0-9]/g, '*');
          },error => {
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }

  ionViewWillLeave() {
    this.userData = null;
    this.isEdit = false ;
  }

  // go to user edit page
  goToEdit() {
    let params: any = {
      isEdit : true,
      userData : this.userData
    }
    this.nav.navigateForward('main/tabs/add-new-user', { state: params });
  }

}
