import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidenavPage } from './sidenav.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: SidenavPage,
    children : [
      {
        path: 'post-list',
        loadChildren: () => import('../post-list/post-list.module').then( m => m.PostListPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'add-new-product',
        loadChildren: () => import('../add-new-product/add-new-product.module').then( m => m.AddNewProductPageModule)
      },
      {
        path: 'add-new-user',
        loadChildren: () => import('../add-new-user/add-new-user.module').then( m => m.AddNewUserPageModule)
      },
      {
        path: 'user-list',
        loadChildren: () => import('../user-list/user-list.module').then( m => m.UserListPageModule)
      },
      {
        path: 'confirm-product',
        loadChildren: () => import('../confirm-product/confirm-product.module').then( m => m.ConfirmProductPageModule)
      },
      {
        path: 'confirm-user',
        loadChildren: () => import('../confirm-user/confirm-user.module').then( m => m.ConfirmUserPageModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
      },
      {
        path: 'upload-csv',
        loadChildren: () => import('../upload-csv/upload-csv.module').then( m => m.UploadCsvPageModule)
      },
      {
        path: 'main/tabs',
        redirectTo: '/main/tabs/post-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'main',
    redirectTo: '/main/tabs/post-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidenavPageRoutingModule {}
