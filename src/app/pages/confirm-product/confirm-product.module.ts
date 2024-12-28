import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmProductPageRoutingModule } from './confirm-product-routing.module';

import { ConfirmProductPage } from './confirm-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmProductPageRoutingModule
  ],
  declarations: [ConfirmProductPage]
})
export class ConfirmProductPageModule {}
