import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./bookmarks/bookmarks.module').then(m => m.BookmarksPageModule)
  },
  {
    path: 'downloads',
    loadChildren: () => import('./downloads/downloads.module').then(m => m.DownloadsPageModule)
  },
  {
    path: 'file-view',
    loadChildren: () => import('./file-view/file-view.module').then(m => m.FileViewPageModule)
  },
  {
    path: 'file-view/:page',
    loadChildren: () => import('./file-view/file-view.module').then(m => m.FileViewPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
