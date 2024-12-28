import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonFab, IonInfiniteScroll, NavController, Platform, PopoverController } from '@ionic/angular';
import { Papa } from 'ngx-papaparse';
import { Post } from 'src/app/models/post';
import { ApiService } from 'src/app/services/api.service';
import { SettingPage } from '../setting/setting.page';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { AppConstants } from 'src/app/const/app.constants';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.page.html',
  styleUrls: ['./post-list.page.scss'],
})
export class PostListPage implements OnInit {
  @ViewChild('fabComponent') fabComponent: IonFab;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  popover: any;
  searchData : any;
  postList = [];
  isSearch = false;
  isOpen = false;
  csvData: any[] = [];
  headerRow: any[] = ["Id","Title","Description","Created User Id", "Created At"];
  unsubscribeBackEvent: any;
  start = 0;
  end = 0;
   
  constructor(
    private router: Router,
    private platform: Platform,
    private popoverController : PopoverController,
    private nav: NavController,
    private api : ApiService,
    private papa: Papa,
    private file: File,
    private socialSharing: SocialSharing,
    public storage: Storage,
    public constant : AppConstants,
    public global : GlobalServiceService,
    public alertCtrl : AlertController) { }

  ngOnInit() {  }

  ionViewWillEnter() {
    this.isSearch = false;
    this.getPostList(this.start);
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  // get post list data
  getPostList(start) {
    this.storage.get("token").then( token => {
      if (token != null) {
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.getPostList(start, token).subscribe(data => {
            this.global.stopLoader();
            var responseData : any = data;
            if (responseData.success == true) {
              var dataList:any = responseData.query;
              this.end = dataList.length != 0 ? start + 1 : 0;
              dataList.forEach((item, index) => {
                this.postList.push(item);
              })
            }
          },error=>{
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }
  
  // to show pop over for edit and delete function
  async presentPopover(ev: any, postId: any, post : Post) {
    this.popover = await this.popoverController.create({
      component: SettingPage,
      event: ev,
      cssClass: 'popover_setting',
      componentProps: {
        id: postId
      },
      translucent: true,
      mode: "md",
    });
    this.popover.onDidDismiss().then((result) => {
      var response:any = result.data
      if (response.type == "edit") {
        let params: any = {
          isEdit : true,
          postData : post
        }
        this.nav.navigateForward('main/tabs/add-new-product', { state: params });
      }else{
        this.showConfirm(postId);
      }
    });
    return await this.popover.present();
  }

  showConfirm(postId) {
    this.alertCtrl.create({
      header: this.constant.confirmAlertheader,
      message:  this.constant.confirmAlertMsg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deletePost(postId);
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
  deletePost(postId){
    var post = {
      "post_id": postId
    }
    this.storage.get("token").then( token => {
      if (token != null) {
        if (this.global.isOnline == false){
          this.global.showAlert(this.constant.networkError);
        }else{
          this.global.showLoader();
          this.api.deletePost(post, token).subscribe(data => {
            this.global.stopLoader();
            var responseData : any = data;
            if (responseData.success == true) {
              this.start = 0;
              this.postList = [];
              this.getPostList(this.start);
            }
          },error=>{
            this.global.stopLoader();
            this.global.showAlert(this.constant.internalServerError);
          })
        }
      }
    })
  }

  // For search textfield
  ionChange(event){
    var searchData = event.detail.value;
    this.start = 0;
    this.postList = [];
    this.storage.get("token").then( token => {
      if (token != null) {
        this.global.showLoader();
        this.api.searchPostList(searchData, this.start, token).subscribe(data => {
          this.global.stopLoader();
          var responseData : any = data;
          if (responseData.success == true) {
            var dataList:any = responseData.query;
            this.end = dataList.length != 0 ? this.start + 1 : 0;
            dataList.forEach((item, index) => {
              this.postList.push(item);
            })
          }
        },error=> {
          this.global.stopLoader();
          this.global.showAlert(this.constant.internalServerError);
        })
      }
    })
  }

  // clear search data
  onClear(event) {
    this.isSearch = false;
    this.start = 0;
    this.postList = [];
    this.getPostList(this.start);
  }

  // For load more data
  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      this.start += 1;
      this.getPostList(this.start)
      if (this.start >= this.end) {
        event.target.disabled = true;
      }
    }, 500);
  }

  // dismiss load more function
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  // floating action button
  exportCSV() {
    this.isOpen = false;
    var strArray  = [];
    if (this.postList.length > 0){
      for (var i = 0; i < this.postList.length; i++) {
        var postdata = this.postList[i];
        var row = [];
        for (var key in postdata) {
          row.push(postdata[key].toString());
        }
        strArray.push(row);
      }
    }
    if(strArray.length > 0) {
      let csv = this.papa.unparse({
        fields: this.headerRow,
        data: strArray
      });
     
      this.file.writeFile(this.file.dataDirectory, 'data.csv', csv, {replace: true}).then( res => {
        this.socialSharing.share(null, null, res.nativeURL, null).then(e =>{
          // Success
          console.log("Share success", e);
        }).catch(e =>{
          console.log('Share failed:', e);
        });
      }, err => {
        console.log('Error: ', err);
      });
    }
  }

  // go to upload-csv page
  upload() {
   this.isOpen = false;
    this.nav.navigateForward('main/tabs/upload-csv');
  }

  // click list of search floating action button 
  search() {
    this.isOpen = false;
    this.isSearch = true;
    this.searchData = "";
  }

  // click ion-fab-button
  floatingBtn() {
    this.isOpen = true;
  }

  // when touch start window, hide floating button list
  touchstart(event){
    this.fabComponent.close();
  }

  // show window confirm alert when double touch back button click
  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/main/tabs/post-list') {
        if (window.confirm('Do you want to exit the app?')) {
          navigator['app'].exitApp();
        }
      }
    });
  }

  ionViewWillLeave() {
    this.unsubscribeBackEvent.unsubscribe();
  }
}
