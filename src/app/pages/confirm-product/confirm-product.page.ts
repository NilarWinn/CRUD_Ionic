import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { AppConstants } from 'src/app/const/app.constants';

@Component({
  selector: 'app-confirm-product',
  templateUrl: './confirm-product.page.html',
  styleUrls: ['./confirm-product.page.scss'],
})
export class ConfirmProductPage implements OnInit {

  postTitle = '';
  postDescription = '';
  postStatus :Boolean;
  isEdit :Boolean ;
  constructor(public router: Router, 
    private nav: NavController,
    public api : ApiService, 
    public storage: Storage,
    public constant : AppConstants,
    public global : GlobalServiceService) {

    if (router.getCurrentNavigation().extras.state) {
      let params = router.getCurrentNavigation().extras.state;
      this.postTitle = params.title;
      this.postDescription = params.description;
      this.postStatus = params.status;
      this.isEdit = params.isEdit;
    }
    this.global.checkNetwork();
   }

  ngOnInit() { }

  // change status
  changeStatus($event){
    this.postStatus = !this.postStatus;
  }

  // back to add new product page
  cancel() {
    this.nav.back();
  }

  ionViewWillLeave() {
    this.postTitle = '';
    this.postDescription = '';
    this.postStatus = false;
    this.isEdit = false ;
  }

  // call create post api
  createPost() {
    let postData = {
      "title" : this.postTitle,
      "description" : this.postDescription
    }
    this.storage.get("token").then(token => {
      if (token != null){
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.createPost(postData, token, this.isEdit).subscribe(data => {
            var responseData : any = data;
            this.global.stopLoader();
            if (responseData.status == "success") {
              this.nav.navigateRoot('main/tabs/post-list', { animationDirection: 'forward' });
            }else{
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
