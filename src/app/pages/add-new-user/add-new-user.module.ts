import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewUserPageRoutingModule } from './add-new-user-routing.module';

import { AddNewUserPage } from './add-new-user.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewUserPageRoutingModule
  ],
  declarations: [AddNewUserPage]
})
export class AddNewUserPageModule {}
