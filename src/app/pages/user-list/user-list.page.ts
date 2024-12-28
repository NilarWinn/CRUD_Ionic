import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonFab, IonInfiniteScroll, NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { SettingPage } from '../setting/setting.page';
import { Storage } from '@ionic/storage';
import { AppConstants } from 'src/app/const/app.constants';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  @ViewChild('fabComponent') fabComponent: IonFab;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  userList = [];
  popover: any;
  isSearch = false;
  isOpen = false;
  searchData : any;
  isLoadMore = true;
  start = 1;
  end = 0;

  constructor(private nav: NavController,
    private api : ApiService,
    private popoverController : PopoverController,
    public storage: Storage,
    public constant : AppConstants,
    public global : GlobalServiceService,
    public alertCtrl : AlertController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.isSearch = false;
    this.getUserList(this.start);
  }

  // get user list data
  getUserList(start) {
    this.storage.get("token").then( token => {
      if (token != null) {
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.getUserList(start, token).subscribe(data => {
            this.global.stopLoader();
            var responseData : any = data;
            if (responseData.success == true) {
              var dataList:any = responseData.query;
              this.end = dataList.length != 0 ? start + 1 : 0;
              dataList.forEach((item, index) => {
                this.userList.push(item);
              })
            }
          },err =>{
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }

  // display popover for edit and delete function
  async presentPopover(ev: any, userId: any, userData) {
    this.popover = await this.popoverController.create({
      component: SettingPage,
      event: ev,
      cssClass: 'popover_setting',
      componentProps: {
        id: userId
      },
      translucent: true,
    });
    this.popover.onDidDismiss().then((result) => {
      var response:any = result.data
      if (response.type == "edit") {
        let params: any = {
          isEdit : true,
          userData : userData
        }
        this.nav.navigateForward('main/tabs/add-new-user', { state: params });
      }else{
        this.showConfirm(userId) 
      }
    });
    return await this.popover.present();
  }

  showConfirm(userId) {
    this.alertCtrl.create({
      header: this.constant.confirmAlertheader,
      message:  this.constant.confirmAlertMsg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deleteUser(userId);
          }
        },
        {
          text: 'Cancel',
          handler: () => { }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  // call delete api
  deleteUser(userId){
    var user = {
      "user_id": userId
    }
    this.storage.get("token").then( token => {
      if (token != null) {
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.deleteUser(user, token).subscribe(data => {
            this.global.stopLoader();
            var responseData : any = data;
            if (responseData.success == true) {
              this.start = 0;
              this.userList = [];
              this.getUserList(this.start);
            }
          },error=>{
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }

  // Load more data
  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      this.start += 1;
      this.getUserList(this.start);
       if (this.start >= this.end) {
        event.target.disabled = true;
      }
      if (this.start > this.end) {
       event.target.disabled = true;
        this.isLoadMore = false
      }
    }, 500);
  }

  // dismiss load more function
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  //Floating action button
  floatingBtn() {
    this.isOpen = true;
  }

  search() {
    this.isOpen = false;
    this.isSearch = true;
    this.searchData = "";
  }

  // For search textfield
  ionChange(event){
    var searchData = event.detail.value;
    this.start = 0;
    this.userList = [];
    this.storage.get("token").then( token => {
      if (token != null) {
        this.global.showLoader();
        this.api.searchUserList(searchData, this.start, token).subscribe(data => {
          this.global.stopLoader();
          var responseData : any = data;
          if (responseData.success == true) {
            var dataList:any = responseData.query;
            this.end = dataList.length != 0 ? this.start + 1 : 0;
            dataList.forEach((item, index) => {
              this.userList.push(item);
            })
          }
        },err =>{
          this.global.stopLoader();
          this.global.showAlert(this.constant.internalServerError);
        })
      }
    })
  }

  onClear(event) {
    this.isSearch = false;
    this.start = 0;
    this.userList = [];
    this.getUserList(this.start);
  }

  // when touch start window, hide floating button list
  touchstart(event){
    this.fabComponent.close();
  }

}
