import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmUserPageRoutingModule } from './confirm-user-routing.module';

import { ConfirmUserPage } from './confirm-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmUserPageRoutingModule
  ],
  declarations: [ConfirmUserPage]
})
export class ConfirmUserPageModule {}
