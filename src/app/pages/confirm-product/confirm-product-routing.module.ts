import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmProductPage } from './confirm-product.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmProductPageRoutingModule {}
