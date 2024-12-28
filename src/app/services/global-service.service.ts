import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../const/app.constants';
import { ConnectionStatus, NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {
  isLoading = false;
  isOnline: boolean;

  constructor( public loadingController: LoadingController,
    private network: NetworkService,
    public alertCtrl: AlertController,
    public constant : AppConstants
    ) {
   
  }

  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  checkNetwork() {
    this.network.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status === ConnectionStatus.Offline){
        this.isOnline = false;
      }else{
        this.isOnline = true;
      }
    });
  }

  async showLoader() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      backdropDismiss: true,
      message: 'Loading...',
    });
    await loading.present().then(() => {
      if (!this.isLoading) {
        loading.dismiss();
      }
    })
 }

  async stopLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
  
}
