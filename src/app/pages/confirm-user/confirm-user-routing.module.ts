import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmUserPage } from './confirm-user.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmUserPageRoutingModule {}
