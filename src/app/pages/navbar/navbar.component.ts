import { Component } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  usuario:UsuarioModel={};
   storedData = localStorage.getItem('currentUser');

  constructor(private router:Router) {

    if (this.storedData) {
      // Parseamos el string a un objeto
      const user = JSON.parse(this.storedData);
      this.usuario=user;
      // Ahora puedes acceder a las propiedades del objeto
      console.log(user.email);  // Acceder a la propiedad 'email' del objeto
    } else {
      console.error('No se encontró el usuario en localStorage');
    }

  }
  

  logout(){

    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);



  }
}
