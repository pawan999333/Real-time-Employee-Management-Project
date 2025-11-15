import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
   {path:'pages', loadChildren:()=>import('./pages/pages.module')
    .then(mod=>mod.PagesModule)
   },
   {
    path:'',loadChildren:()=>import('./session/session.module')
    .then(mode=>mode.SessionModule)
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
