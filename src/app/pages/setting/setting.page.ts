import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  id;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  edit() {
    this.popoverController.dismiss({
      id :this.id,
      type : "edit"
    });
  }

  delete() {
    this.popoverController.dismiss({
      id :this.id,
      type : "delete"
    });
  }

}
