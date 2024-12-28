import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Storage } from '@ionic/storage';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.scss'],
})
export class SidenavPage implements OnInit {
  active = '';
  userRole = '';

  constructor(private router: Router,
    private service: GlobalServiceService,
    public storage: Storage,
    private nav: NavController,
    public alertCtrl : AlertController) { 
   
    this.router.events.subscribe((event: RouterEvent) => {
      this.active = event.url;
    })
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get("role").then(data =>{
      if (data) {
        this.userRole = data;
      }
    })
  }

  logout(){
    this.alertCtrl.create({
      header: 'Confirm Alert',
      message: 'Are you want to sure Exit?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.storage.clear();
            this.nav.navigateRoot('/login', { animationDirection: 'forward' });
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

  gotoRoute(route){
    this.router.navigate(['main/tabs/'+route]);
  }

}
