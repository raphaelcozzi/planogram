import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login/login-page/login-page.module').then( m => m.LoginPagePageModule)
  },
  {
    path: 'planogram-page',
    loadChildren: () => import('./planogram/planogram-page/planogram-page.module').then( m => m.PlanogramPagePageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./login/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
