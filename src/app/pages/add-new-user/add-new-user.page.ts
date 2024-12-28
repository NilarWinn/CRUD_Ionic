import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/Camera/ngx';
import { User } from 'src/app/models/user';
import * as GlobalConst from 'src/app/const/global.constants';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { AppConstants } from 'src/app/const/app.constants';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.page.html',
  styleUrls: ['./add-new-user.page.scss'],
})
export class AddNewUserPage implements OnInit {
  userForm: FormGroup;
  submitted = false;
  defaultDate = "1987-06-30";
  customPopoverOptions ;
  isEdit: Boolean = false;
  userImg: any = '';
  base64Img = '';
  pwdShow = false;
  confirmPwdShow = false;
  userType : String = 'User';
  userList = GlobalConst.userTypeList;
  userData : User;

  constructor(
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public formBuilder: FormBuilder,
    private nav: NavController,
    public router: Router,
    public constant : AppConstants,
    public global : GlobalServiceService
    ) { 
      this.customPopoverOptions = { cssClass : 'course-popover' };
      if (router.getCurrentNavigation().extras.state) {
        let params = router.getCurrentNavigation().extras.state;
        this.isEdit = params.isEdit;
        this.userData = params.userData;
      }
      this.userImg = 'assets/img/icon.png';
    }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required ]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.pattern(/[0-9]{6}/)]],
      confirmPwd: ['', [Validators.required, Validators.pattern(/[0-9]{6}/) ]],
      phone: ['', [Validators.required, Validators.pattern(/[0-9]{11}/)]],
      dob: [''],
      address : [''],
      profile : [''],
      userType : ['']
    });
  }

  ionViewWillEnter() {
    // carry userData from list
    if(this.userData != null){
      this.userForm.controls.name.setValue(this.userData.name);
      this.userForm.controls.email.setValue(this.userData.email);
      this.userForm.controls.phone.setValue(this.userData.phone);
      this.userForm.controls.dob.setValue(this.userData.dob);
      this.userForm.controls.address.setValue(this.userData.address);
      this.userType = this.userData.type == '1' ? 'User' : 'Admin';
      this.userForm.controls.password.setValue(this.userData.password);
      this.userForm.controls.confirmPwd.setValue(this.userData.password);
    }
  }

  // check form validation error
  get errorCtr() {
    return this.userForm.controls;
  }

  // check match password 
  matchingPasswords() {
   return  this.userForm.controls.password.value == this.userForm.controls.confirmPwd.value;
  }

  // go to confirm user page
  onSubmit(){
    this.submitted = true;
    if (!this.userForm.valid) {
      this.global.showAlert(this.constant.notValidData);
      return false;
    } else {
      if (this.matchingPasswords() == false){
        return false;
      }
      var user = new User();
      user.name = this.userForm.controls.name.value;
      user.email = this.userForm.controls.email.value;
      user.password = this.userForm.controls.password.value;
      user.type = this.userForm.controls.userType.value;
      user.phone = this.userForm.controls.phone.value;
      user.address = this.userForm.controls.address.value;
      user.dob = this.userForm.controls.dob.value;
      let params: any = {
        userData : user,
        isEdit : this.isEdit,
        userImg : this.userImg
      };
      this.nav.navigateForward('main/tabs/confirm-user', { state: params });
    }
  }

  // get date of brith data
  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.userForm.get('dob').setValue(date, {
       onlyself: true
    })
  }

  // reset form data
  clear(){
    this.userForm.reset();
  }
  
  // show or hide security password
  showPass(value, type){
    if (type == 'password'){
      this.pwdShow = !value;
    }else{
      this.confirmPwdShow = !value;
    }
  }

  // choose user type
  optionsType(user){
    console.log(this.userForm.controls.userType.value);
  }

  // select image using user choose type
  async pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.userImg = base64Image;
      this.userForm.get('profile').setValue(this.userImg);
     }, (err) => {
      console.log(err);
     });
  }

  // choose image from camera or gallery
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();     
  }

  // go to change password
  goToChangePassword() {
    this.nav.navigateForward('main/tabs/change-password');
  }
}
