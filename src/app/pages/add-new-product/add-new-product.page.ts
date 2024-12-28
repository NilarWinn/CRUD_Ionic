import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AppConstants } from 'src/app/const/app.constants';
import { Post } from 'src/app/models/post';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.page.html',
  styleUrls: ['./add-new-product.page.scss'],
})
export class AddNewProductPage implements OnInit {
  postForm: FormGroup;
  submitted = false;
  status = true;
  isEdit: Boolean = false;
  postData : Post;

  constructor(public formBuilder: FormBuilder, 
    public alertCtrl: AlertController,
    public nav: NavController,
    public router: Router,
    public constant : AppConstants,
    public global : GlobalServiceService
    ) {
      if (router.getCurrentNavigation().extras.state) {
        let params = router.getCurrentNavigation().extras.state;
        this.postData = params.postData;
        this.isEdit = params.isEdit;
      }
  }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required ]],
      description: ['', [Validators.required ]]
    });
  }

  ionViewWillEnter() {
    // carry postData from list
    if(this.postData != null){
      this.postForm.controls.title.setValue(this.postData.title);
      this.postForm.controls.description.setValue(this.postData.description);
    }
  }

  // check form validation error
  get errorCtr() {
    return this.postForm.controls;
  }

  // go to confirm product page
  onSubmit(){
    this.submitted = true;
    if (!this.postForm.valid) {
      this.global.showAlert(this.constant.notValidData);
      return false;
    } else {
      let params: any = {
        title: this.postForm.controls.title.value,
        description: this.postForm.controls.description.value,
        status: this.status, 
        isEdit : this.isEdit
      }
      this.nav.navigateForward('main/tabs/confirm-product', { state: params });
    }
  }

  // change status
  changeStatus($event){
    this.status = !this.status;
  }

  // reset form data
  clear(){
    this.postForm.reset();
  }
  
}
