import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public storage: Storage, private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#448cbc');
      this.splashScreen.hide();
    });

    this.storage.set("role", "admin" );
    this.storage.set("token","dasdfasdfadsfas");
     this.storage.get("role").then(data => {
      if (data != null) {
        this.router.navigate(['main/tabs/post-list']);
      }else{
        this.router.navigate(['login']);
      }
    })
  }
}