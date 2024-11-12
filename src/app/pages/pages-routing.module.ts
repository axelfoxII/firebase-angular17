import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
{  path: 'admin-panel',
    component: PagesComponent, children:[
      { path: 'usuarios', component: UsuariosComponent}
    ]

}   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
